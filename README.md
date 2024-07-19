# SEOApp

## Description

SEOApp is a powerful web tool designed to help users perform comprehensive SEO analysis on any given URL. By simply entering a URL, users can get detailed insights into various SEO factors such as meta tags, content structure, link distribution, and performance metrics. The application provides actionable recommendations to improve the SEO health of websites, making it an essential tool for digital marketers and SEO professionals.

## Features

- **Meta Tags Analysis**: Checks the presence and validity of meta tags like title, description, keywords, viewport, robots, canonical, and Open Graph tags.
- **Content Analysis**: Extracts and evaluates headers, paragraphs, strong and bold texts, and the first paragraph of content.
- **Links Analysis**: Analyzes internal and external links, broken links, and provides pagination for easy navigation.
- **Performance Metrics**: Utilizes Lighthouse to provide detailed performance metrics including performance score, first contentful paint, largest contentful paint, speed index, time to interactive, total blocking time, and cumulative layout shift.

## Technologies Used

- **Node.js**: For server-side scripting and handling backend logic.
- **Express.js**: For creating the server and handling routing.
- **Puppeteer**: For web scraping and extracting meta information.
- **Lighthouse**: For generating performance metrics.
- **Bootstrap**: For responsive and modern UI design.
- **EJS**: For templating and rendering views.

## Installation

To install and run the SEOApp locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/seoApp.git
   cd seoApp
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the server:**

   ```bash
   npm start
   ```

## Configuration

The application uses Puppeteer and Lighthouse for web scraping and performance analysis. You can configure Puppeteer options in the `config/config.js` file if necessary.

## config/config.js

```javascript
module.exports = {
  puppeteerOptions: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
};
```

## Usage

1. **Home Page**: Enter the URL you want to analyze and click "Analyze".
2. **Progress Page**: The application will display a progress bar and status updates during the analysis.
3. **Result Page**: After analysis, the results will be displayed in tabs: Meta Tags, Content, Links, and Performance.

## Design Decisions

- **Modular Design**: The application is designed using the MVC pattern to separate concerns and improve maintainability.
- **Responsive UI**: Bootstrap is used to ensure the application is responsive and user-friendly on various devices.
- **Real-time Updates**: The progress bar and status updates provide real-time feedback during the analysis process.
- **Comprehensive Analysis**: The application provides a thorough analysis covering various SEO factors to give users actionable insights.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
