import json
from main import get_data

summary, df_all_gdp, df_all_population = get_data()

summary.to_json('summary.json', orient='records')
