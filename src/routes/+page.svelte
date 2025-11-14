<script lang="ts">
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger
	} from '$lib/components/ui/accordion';
</script>

<div class="container mx-auto max-w-4xl py-20">
	<h1 class="text-3xl font-bold text-center mb-8">GDP & Population Tracker</h1>
	<Accordion type="single" class="">
		<AccordionItem value="about">
			<AccordionTrigger>About This Application</AccordionTrigger>
			<AccordionContent>
				<p class="mb-4">
					This is a comprehensive web application for tracking and analyzing GDP (Gross Domestic Product) and population data across different countries. The application provides interactive visualizations, detailed country statistics, and allows users to save their favorite countries for quick access.
				</p>
				<p>
					Whether you're a researcher, student, or simply curious about global economic trends, this tool helps you explore and understand economic and demographic data in an intuitive and visually appealing way.
				</p>
			</AccordionContent>
		</AccordionItem>

		<AccordionItem value="features">
			<AccordionTrigger>Key Features</AccordionTrigger>
			<AccordionContent>
				<ul class="list-disc list-inside space-y-2">
					<li><strong>Country Data Table:</strong> Browse and sort countries by GDP growth, population growth, and total growth rates</li>
					<li><strong>Interactive Charts:</strong> Visualize GDP and population trends over time with dynamic charts</li>
					<li><strong>Country Details:</strong> View comprehensive statistics for individual countries including growth percentages</li>
					<li><strong>Save Countries:</strong> Create a personalized list of saved countries for quick access</li>
					<li><strong>User Authentication:</strong> Secure login and registration system to protect your saved data</li>
					<li><strong>Dark Mode:</strong> Toggle between light and dark themes for comfortable viewing</li>
					<li><strong>Responsive Design:</strong> Access the application seamlessly on desktop, tablet, and mobile devices</li>
				</ul>
			</AccordionContent>
		</AccordionItem>

		<AccordionItem value="usage">
			<AccordionTrigger>How to Use</AccordionTrigger>
			<AccordionContent>
				<div class="space-y-4">
					<div>
						<h4 class="font-semibold mb-2">1. Browse Countries</h4>
						<p>Navigate to the <strong>Countries</strong> page to see a comprehensive table of all available countries with their growth statistics. You can sort by different metrics to find countries of interest.</p>
					</div>
					<div>
						<h4 class="font-semibold mb-2">2. View Country Details</h4>
						<p>Click on any country name or use the actions menu to view detailed information including GDP and population charts, as well as growth percentages.</p>
					</div>
					<div>
						<h4 class="font-semibold mb-2">3. Save Countries</h4>
						<p>Create an account or log in to save your favorite countries. Use the three-dot menu (⋯) on any country row and select "Save country" to add it to your saved list.</p>
					</div>
					<div>
						<h4 class="font-semibold mb-2">4. Access Saved Countries</h4>
						<p>Visit the <strong>Saved</strong> page to view all your saved countries with their growth statistics in an organized card layout.</p>
					</div>
				</div>
			</AccordionContent>
		</AccordionItem>

		<AccordionItem value="technologies">
			<AccordionTrigger>Technologies Used</AccordionTrigger>
			<AccordionContent>
				<div class="space-y-4">
					<div>
						<h4 class="font-semibold mb-2">Frontend Framework & Tools</h4>
						<ul class="list-disc list-inside space-y-1">
							<li><strong>Svelte 5</strong> - Modern reactive framework for building user interfaces</li>
							<li><strong>SvelteKit</strong> - Full-stack framework for Svelte applications</li>
							<li><strong>TypeScript</strong> - Type-safe JavaScript for better code quality</li>
							<li><strong>Vite</strong> - Fast build tool and development server</li>
						</ul>
					</div>
					<div>
						<h4 class="font-semibold mb-2">UI & Styling</h4>
						<ul class="list-disc list-inside space-y-1">
							<li><strong>Tailwind CSS</strong> - Utility-first CSS framework</li>
							<li><strong>shadcn-svelte</strong> - High-quality component library</li>
							<li><strong>bits-ui</strong> - Accessible UI primitives</li>
							<li><strong>Lucide Icons</strong> - Beautiful icon library</li>
						</ul>
					</div>
					<div>
						<h4 class="font-semibold mb-2">Data Visualization</h4>
						<ul class="list-disc list-inside space-y-1">
							<li><strong>LayerChart</strong> - Modern charting library for Svelte</li>
							<li><strong>D3.js</strong> (d3-scale, d3-shape) - Data visualization utilities</li>
							<li><strong>TanStack Table</strong> - Powerful table component</li>
						</ul>
					</div>
					<div>
						<h4 class="font-semibold mb-2">Backend & Database</h4>
						<ul class="list-disc list-inside space-y-1">
							<li><strong>SQLite</strong> - Lightweight, serverless database</li>
							<li><strong>better-sqlite3</strong> - Fast SQLite3 database driver</li>
							<li><strong>Kysely</strong> - Type-safe SQL query builder</li>
							<li><strong>bcrypt</strong> - Password hashing for secure authentication</li>
							<li><strong>JSON Web Tokens (JWT)</strong> - Secure token-based authentication</li>
						</ul>
					</div>
					<div>
						<h4 class="font-semibold mb-2">Development Tools</h4>
						<ul class="list-disc list-inside space-y-1">
							<li><strong>ESLint</strong> - Code linting and quality assurance</li>
							<li><strong>Prettier</strong> - Code formatting</li>
							<li><strong>TypeScript ESLint</strong> - TypeScript-specific linting rules</li>
						</ul>
					</div>
				</div>
			</AccordionContent>
		</AccordionItem>

		<AccordionItem value="data">
			<AccordionTrigger>Data Sources</AccordionTrigger>
			<AccordionContent>
				<p class="mb-4">
					The application uses pre-processed JSON data files containing GDP and population statistics for various countries. The data includes:
				</p>
				<ul class="list-disc list-inside space-y-2">
					<li><strong>GDP Data:</strong> Historical GDP values and growth rates</li>
					<li><strong>Population Data:</strong> Population figures and growth trends</li>
					<li><strong>Summary Statistics:</strong> Calculated growth percentages for GDP, population, and total growth metrics</li>
				</ul>
				<p class="mt-4">
					The data is stored in JSON format and loaded dynamically to provide fast access to country information and visualizations.
				</p>
			</AccordionContent>
		</AccordionItem>

		<AccordionItem value="architecture">
			<AccordionTrigger>Application Architecture</AccordionTrigger>
			<AccordionContent>
				<div class="space-y-3">
					<div>
						<h4 class="font-semibold mb-2">Client-Side</h4>
						<p>The frontend is built with SvelteKit, providing server-side rendering (SSR) and client-side interactivity. Components are organized in a modular structure with reusable UI components.</p>
					</div>
					<div>
						<h4 class="font-semibold mb-2">Server-Side</h4>
						<p>API endpoints handle data fetching, user authentication, and database operations. The server uses SQLite for data persistence and JWT tokens for secure session management.</p>
					</div>
					<div>
						<h4 class="font-semibold mb-2">Database</h4>
						<p>SQLite database stores user accounts and saved countries. The schema includes user authentication data and a many-to-one relationship between users and their saved countries.</p>
					</div>
					<div>
						<h4 class="font-semibold mb-2">Security</h4>
						<p>Passwords are hashed using bcrypt, and authentication is handled through secure HTTP-only cookies containing JWT tokens. All database queries use parameterized statements to prevent SQL injection.</p>
					</div>
				</div>
			</AccordionContent>
		</AccordionItem>
	</Accordion>
</div>
