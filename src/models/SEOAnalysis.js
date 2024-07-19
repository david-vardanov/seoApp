class SEOAnalysis {
  constructor(
    url,
    title,
    description,
    keywords,
    viewport,
    robots,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    links,
    lightHouseMetrics,
    performance,
    titleLength,
    descriptionLength,
    headers,
    internalLinksCount,
    externalLinksCount,
    titleValid,
    descriptionValid,
    firstParagraph,
    paragraphsCount,
    strongs,
    bolds
  ) {
    this.url = url;
    this.title = title;
    this.description = description;
    this.keywords = keywords;
    this.viewport = viewport;
    this.robots = robots;
    this.canonical = canonical;
    this.ogTitle = ogTitle;
    this.ogDescription = ogDescription;
    this.ogImage = ogImage;
    this.links = links;
    this.lightHouseMetrics = lightHouseMetrics;
    this.performance = performance;
    this.titleLength = titleLength;
    this.descriptionLength = descriptionLength;
    this.headers = headers;
    this.internalLinksCount = internalLinksCount;
    this.externalLinksCount = externalLinksCount;
    this.titleValid = titleValid;
    this.descriptionValid = descriptionValid;
    this.firstParagraph = firstParagraph;
    this.paragraphsCount = paragraphsCount;
    this.strongs = strongs;
    this.bolds = bolds;
  }

  // Method to validate the length of the title and description
  validateMetaLengths() {
    const titleValid = this.titleLength >= 50 && this.titleLength <= 60;
    const descriptionValid =
      this.descriptionLength >= 150 && this.descriptionLength <= 160;
    return { titleValid, descriptionValid };
  }

  // Method to calculate link distribution
  calculateLinkDistribution() {
    const internalLinks = this.internalLinksCount;
    const externalLinks = this.externalLinksCount;
    return { internalLinks, externalLinks, totalLinks: this.links.length };
  }

  // Method to generate a performance report
  generatePerformanceReport() {
    return {
      loadTime: this.performance.loadTime,
      domContentLoaded: this.performance.domContentLoaded,
      lighthouseScore: this.lightHouseMetrics.performanceScore,
    };
  }

  // Method to summarize the SEO analysis
  summarizeAnalysis() {
    const { titleValid, descriptionValid } = this.validateMetaLengths();
    const { internalLinks, externalLinks, totalLinks } =
      this.calculateLinkDistribution();
    const performanceReport = this.generatePerformanceReport();

    return {
      url: this.url,
      title: this.title,
      titleValid,
      descriptionValid,
      internalLinks,
      externalLinks,
      totalLinks,
      lighthouseScore: performanceReport.lighthouseScore,
    };
  }
}

module.exports = SEOAnalysis;
