const puppeteer = require("puppeteer");
const SEOAnalysis = require("../models/SEOAnalysis");
const { puppeteerOptions } = require("../config/config");
const { storeAnalysis, getAnalysis } = require("../storage/analysisResults");

async function getLighthouseMetrics(url) {
  const { getLighthouseMetrics } = await import(
    "../utils/LighthouseMetrics.mjs"
  );
  return getLighthouseMetrics(url);
}

exports.analyze = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("URL is required");
  }

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
    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

    sendProgress(30, "Extracting meta tags...");
    const metaTags = await page.evaluate(() => {
      const getMetaTag = (name) =>
        document
          .querySelector(`meta[name='${name}']`)
          ?.getAttribute("content") || "";
      const getOGTag = (property) =>
        document
          .querySelector(`meta[property='${property}']`)
          ?.getAttribute("content") || "";

      return {
        title: document.querySelector("title")?.innerText || "",
        description: getMetaTag("description"),
        keywords: getMetaTag("keywords"),
        viewport: getMetaTag("viewport"),
        robots: getMetaTag("robots"),
        canonical:
          document
            .querySelector('link[rel="canonical"]')
            ?.getAttribute("href") || "",
        ogTitle: getOGTag("og:title"),
        ogDescription: getOGTag("og:description"),
        ogImage: getOGTag("og:image"),
      };
    });

    sendProgress(50, "Extracting headers and paragraphs...");
    const headersAndParagraphs = await page.evaluate(() => {
      const headers = [
        ...document.querySelectorAll("h1, h2, h3, h4, h5, h6"),
      ].map((el) => ({
        tag: el.tagName,
        content: el.innerText,
      }));

      const paragraphs = [...document.querySelectorAll("p")].map(
        (el) => el.innerText
      );
      const strongs = [...document.querySelectorAll("strong")].map(
        (el) => el.innerText
      );
      const bolds = [...document.querySelectorAll("b")].map(
        (el) => el.innerText
      );

      return { headers, paragraphs, strongs, bolds };
    });

    const firstParagraph =
      headersAndParagraphs.paragraphs.length > 0
        ? headersAndParagraphs.paragraphs[0]
        : "";

    sendProgress(70, "Extracting links...");
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("a")).map((anchor) => ({
        href: anchor.href,
        text: anchor.innerText,
        isInternal: anchor.hostname === location.hostname,
      }));
    });

    sendProgress(90, "Running Lighthouse analysis...");
    const lighthouseMetrics = await getLighthouseMetrics(url);

    sendProgress(100, "Analysis complete.");

    const analysis = new SEOAnalysis(
      url,
      metaTags.title,
      metaTags.description,
      metaTags.keywords,
      metaTags.viewport,
      metaTags.robots,
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
      headersAndParagraphs.headers,
      links.filter((link) => link.isInternal).length,
      links.filter((link) => !link.isInternal).length,
      metaTags.title.length >= 50 && metaTags.title.length <= 60,
      metaTags.description.length >= 150 && metaTags.description.length <= 160,
      firstParagraph,
      headersAndParagraphs.paragraphs.length,
      headersAndParagraphs.strongs,
      headersAndParagraphs.bolds
    );

    storeAnalysis(url, analysis);

    res.end();
  } catch (error) {
    console.error("Error performing SEO analysis:", error);
    sendProgress(100, "Error performing SEO analysis");
    res.end();
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

exports.getAnalysis = (url) => {
  return getAnalysis(url);
};
