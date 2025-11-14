from darts.models.forecasting.exponential_smoothing import ModelMode
import wbgapi as wb
import numpy as np
import pandas as pd

from darts import TimeSeries
from darts.models import ExponentialSmoothing
from scipy import stats


wb_population = 'SP.POP.TOTL'
wb_gdp_per_capita = 'NY.GDP.PCAP.PP.KD'


def _calculate_growth_rate(values):
  """
  Calculate annual growth rate using OLS regression on log values.
  Returns annualized growth rate in percentage.
  """
  log_values = np.log(values)
  time = np.arange(len(values))
  slope, _, _, _, _ = stats.linregress(time, log_values)
  total_growth_rate = (np.exp(slope * (len(values) - 1)) - 1) * 100
  return total_growth_rate


def _forecast_countries_data(df, forecast_periods=12):
  """
  Forecast time series data for multiple countries and combine with historical data.

  Parameters:
  -----------
  df : pandas.DataFrame
      DataFrame with countries as rows and years as columns
  forecast_periods : int
      Number of periods to forecast ahead

  Returns:
  --------
  pandas.DataFrame
      DataFrame with both historical and forecasted values, in the same format as input
  """
  # Melt the dataframe to long format
  df_melted = df.melt(id_vars=['Country'], var_name='year', value_name='value')

  # Convert year to datetime
  df_melted['year'] = pd.to_datetime(df_melted['year'], format='%Y')

  # Initialize dictionary to store forecasts
  forecasts = {}

  # Forecast for each country
  for country in df_melted['Country'].unique():
    country_data = df_melted[df_melted['Country'] == country]

    # Create TimeSeries object
    ts = TimeSeries.from_dataframe(country_data, time_col='year', value_cols='value')

    model = ExponentialSmoothing(
      trend=ModelMode.ADDITIVE,
      seasonal=None,
      damped=True,
    )

    model.fit(ts)

    # Generate forecast
    forecast = model.predict(forecast_periods)
    forecasts[country] = forecast

  # Combine all forecasts into single DataFrame
  forecast_df = pd.DataFrame()
  for country, forecast in forecasts.items():
    forecast_df = pd.concat([forecast_df, forecast.to_dataframe().assign(Country=country)])

  # Process forecast_df to match original format
  forecast_df['year'] = forecast_df.index.year.astype(str)
  forecast_df = forecast_df.pivot(index='Country', columns='year', values='value')

  # Combine historical and forecasted data
  last_historical_year = int(df.columns[-1])
  historical_data = df.set_index('Country')

  # Filter out any overlapping years from forecast
  forecast_df = forecast_df.loc[:, str(last_historical_year + 1) :]

  # Combine historical and forecast data
  result = pd.concat([historical_data, forecast_df], axis=1)

  # Reset index to make Country a column again
  result = result.reset_index()

  return result


def get_data():
  print('getting data')
  df_population = wb.data.DataFrame(
    wb_population, time=range(1990, 2025), labels=True
  ).reset_index()
  df_gdp_per_capita = wb.data.DataFrame(
    wb_gdp_per_capita, time=range(1990, 2025), labels=True
  ).reset_index()

  # remove nulls
  df_population = df_population.dropna()
  df_gdp_per_capita = df_gdp_per_capita.dropna()

  # remove countries with no data
  df_population = df_population[df_population['Country'].isin(df_gdp_per_capita['Country'])]
  df_gdp_per_capita = df_gdp_per_capita[df_gdp_per_capita['Country'].isin(df_population['Country'])]

  # remove YR and drop economy column
  df_population.columns = df_population.columns.map(lambda x: x.removeprefix('YR'))
  df_gdp_per_capita.columns = df_gdp_per_capita.columns.map(lambda x: x.removeprefix('YR'))

  df_population = df_population.drop('economy', axis=1)
  df_gdp_per_capita = df_gdp_per_capita.drop('economy', axis=1)

  print('got data!')

  print('forecasting')
  df_all_gdp = _forecast_countries_data(df_gdp_per_capita)
  df_all_population = _forecast_countries_data(df_population)

  print('got forecast!')

  gdp_yearly = df_all_gdp.iloc[:, 1:].astype(float)
  population_yearly = df_all_population.iloc[:, 1:].astype(float)

  gdp_yearly_last_10 = gdp_yearly.loc[:, '2025':'2035']
  population_yearly_last_10 = population_yearly.loc[:, '2025':'2035']

  # Calculate growth rates using the filtered data
  gdp_growth = gdp_yearly_last_10.apply(_calculate_growth_rate, axis=1)
  population_growth = population_yearly_last_10.apply(_calculate_growth_rate, axis=1)

  summary = pd.DataFrame(
    {
      'Country': df_all_gdp['Country'],
      'growth_gdp': gdp_growth,
      'growth_population': population_growth,
      'growth_total': (gdp_growth + population_growth) / 2,
    }
  )
  print('done, returning all the data')

  return (summary, df_all_gdp, df_all_population)

if __name__ == "__main__":
    # Run the data generation
    summary, df_all_gdp, df_all_population = get_data()

    # Create folder if it doesn't exist
    import os
    data_dir = "src/lib/server/data"
    os.makedirs(data_dir, exist_ok=True)

    # Save results to JSON files for SvelteKit
    summary.to_json(f"{data_dir}/summary.json", orient="records")
    df_all_gdp.to_json(f"{data_dir}/df_all_gdp.json", orient="records")
    df_all_population.to_json(f"{data_dir}/df_all_population.json", orient="records")

    print(f"✅ All data exported to {data_dir}/")
