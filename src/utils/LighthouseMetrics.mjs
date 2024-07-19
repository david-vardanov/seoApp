import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

async function getLighthouseMetrics(url) {
  const chrome = await launch({ chromeFlags: ["--headless"] });
  const options = {
    logLevel: "info",
    output: "json",
    onlyCategories: ["performance"],
    port: chrome.port,
  };

  const runnerResult = await lighthouse(url, options);
  const { audits, categories } = runnerResult.lhr;

  // Extracting important performance metrics
  const performanceScore = categories.performance.score * 100; // Score out of 100
  const metrics = {
    performanceScore,
    firstContentfulPaint: audits["first-contentful-paint"].numericValue,
    speedIndex: audits["speed-index"].numericValue,
    largestContentfulPaint: audits["largest-contentful-paint"].numericValue,
    timeToInteractive: audits["interactive"].numericValue,
    totalBlockingTime: audits["total-blocking-time"].numericValue,
    cumulativeLayoutShift: audits["cumulative-layout-shift"].numericValue,
  };

  await chrome.kill();
  return metrics;
}

export { getLighthouseMetrics };
