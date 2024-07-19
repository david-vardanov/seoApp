const puppeteer = require("puppeteer");
const SEOAnalysis = require("../models/SEOAnalysis");
const { puppeteerOptions } = require("../config/config");
const {
  storeAnalysis,
  getAnalysis,
  getPaginatedLinks,
} = require("../storage/analysisResults");
const { extractMetaTags } = require("../helpers/metaCheck");
const { extractHeaders, extractLinks } = require("../helpers/contentCheck");
const { getLighthouseMetrics } = require("../helpers/lighthouseCheck");

async function analyze(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("URL is required");
  }

  const formattedUrl = url.startsWith("http") ? url : `http://${url}`;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const sendProgress = (progress, status) => {
    res.write(`data: ${JSON.stringify({ progress, status })}\n\n`);
  };

  const browser = await puppeteer.launch(puppeteerOptions);
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

    sendProgress(70, "Extracting links...");
    const links = await extractLinks(page);

    sendProgress(90, "Running Lighthouse analysis...");
    const lighthouseMetrics = await getLighthouseMetrics(formattedUrl);

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
      metaTags.title.length,
      metaTags.description.length,
      headers,
      links.filter((link) => link.isInternal).length,
      links.filter((link) => !link.isInternal).length,
      metaTags.title.length >= 50 && metaTags.title.length <= 60,
      metaTags.description.length >= 150 && metaTags.description.length <= 160
    );

    storeAnalysis(formattedUrl, analysis);

    res.end();
  } catch (error) {
    console.error("Error performing SEO analysis:", error);

    // Handle specific error
    if (error.message.includes("net::ERR_NAME_NOT_RESOLVED")) {
      sendProgress(100, "Error: The domain name could not be resolved.");
    } else {
      sendProgress(100, "Error performing SEO analysis");
    }

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
    return res.redirect("/");
  }
  const analysis = getAnalysis(url);
  if (!analysis) {
    return res.redirect("/");
  }

  const paginatedLinks = getPaginatedLinks(url, parseInt(page));
  res.render("pages/result", {
    analysis,
    paginatedLinks,
    title: "SEO Analysis Result",
  });
}

module.exports = { analyze, getAnalysisByUrl };
