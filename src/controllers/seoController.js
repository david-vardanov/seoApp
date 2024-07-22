const puppeteer = require("puppeteer");
const SEOAnalysis = require("../models/SEOAnalysis");
const {
  storeAnalysis,
  getAnalysis,
  getPaginatedLinks,
} = require("../storage/analysisResults");
const { extractMetaTags } = require("../helpers/metaCheck");
const {
  extractHeaders,
  extractLinks,
  extractStrongAndBoldTexts,
  extractFirstParagraph,
} = require("../helpers/contentCheck");
const { getLighthouseMetrics } = require("../helpers/lighthouseCheck");
const { generatePDF } = require("../helpers/pdfGenerator");

async function analyze(req, res) {
  const { url } = req.query;

  if (!url) {
    req.flash("error", "URL is required");
    return res.redirect("/");
  }

  const formattedUrl = url.startsWith("http") ? url : `http://${url}`;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const sendProgress = (progress, status) => {
    res.write(`data: ${JSON.stringify({ progress, status })}\n\n`);
  };

  const browser = await puppeteer.launch({ headless: true });
  let page;

  try {
    page = await browser.newPage();
    sendProgress(10, "Navigating to the URL...");
    await page.goto(formattedUrl, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    sendProgress(30, "Extracting meta tags...");
    const metaTags = await extractMetaTags(page);

    sendProgress(50, "Extracting headers...");
    const headers = await extractHeaders(page);

    sendProgress(60, "Extracting links...");
    const links = await extractLinks(page);

    sendProgress(70, "Extracting strong and bold texts...");
    const { strongs, bolds } = await extractStrongAndBoldTexts(page);

    sendProgress(80, "Extracting first paragraph...");
    const firstParagraph = await extractFirstParagraph(page);

    sendProgress(90, "Running Lighthouse analysis...");
    let lighthouseMetrics;
    try {
      lighthouseMetrics = await getLighthouseMetrics(formattedUrl);
    } catch (error) {
      console.error("Lighthouse analysis failed:", error);
      sendProgress(100, "Error during Lighthouse analysis.");
      res.end();
      return;
    }

    sendProgress(100, "Analysis complete.");

    const analysis = new SEOAnalysis(
      formattedUrl,
      metaTags.title,
      metaTags.description,
      metaTags.keywords,
      metaTags.viewport,
      metaTags.canonical,
      metaTags.ogTitle,
      metaTags.ogDescription,
      metaTags.ogImage,
      links,
      lighthouseMetrics,
      {
        loadTime: await page.evaluate(
          () =>
            window.performance.timing.loadEventEnd -
            window.performance.timing.navigationStart
        ),
        domContentLoaded: await page.evaluate(
          () =>
            window.performance.timing.domContentLoadedEventEnd -
            window.performance.timing.navigationStart
        ),
      },
      metaTags.title ? metaTags.title.length : 0,
      metaTags.description ? metaTags.description.length : 0,
      headers,
      links.filter((link) => link.isInternal).length,
      links.filter((link) => !link.isInternal).length,
      metaTags.title
        ? metaTags.title.length >= 50 && metaTags.title.length <= 60
        : false,
      metaTags.description
        ? metaTags.description.length >= 150 &&
          metaTags.description.length <= 160
        : false,
      firstParagraph,
      headers.length, // Assuming headers are paragraph count
      strongs,
      bolds
    );

    storeAnalysis(formattedUrl, analysis);
    req.flash("success", "SEO analysis complete.");
    res.end();
  } catch (error) {
    console.error("Error performing SEO analysis:", error);

    let errorMessage = "Error performing SEO analysis";
    if (error.message.includes("net::ERR_NAME_NOT_RESOLVED")) {
      errorMessage = "Error: The domain name could not be resolved.";
    } else if (error.message.includes("net::ERR_ADDRESS_UNREACHABLE")) {
      errorMessage = "Error: The address is unreachable.";
    }
    req.flash("error", errorMessage);

    // Notify client of error
    sendProgress(100, errorMessage);
    res.end();
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function getAnalysisByUrl(req, res) {
  const { url, page = 0 } = req.query;
  if (!url) {
    req.flash("error", "No URL provided");
    return res.redirect("/");
  }
  const analysis = getAnalysis(url);
  if (!analysis) {
    req.flash("error", "No analysis found for the given URL");
    return res.redirect("/");
  }

  const paginatedLinks = getPaginatedLinks(url, parseInt(page));
  res.render("pages/result", {
    analysis,
    paginatedLinks,
    title: "SEO Analysis Result",
  });
}

async function downloadReport(req, res) {
  const { url } = req.query;
  const analysis = getAnalysis(url);

  if (!analysis) {
    return res.status(404).send("No analysis found for the given URL");
  }

  generatePDF(analysis, res);
}

module.exports = { analyze, getAnalysisByUrl, downloadReport };
