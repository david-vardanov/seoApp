import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

async function getLighthouseMetrics(url) {
  const chrome = await launch({ chromeFlags: ["--headless"] });
  const options = {
    logLevel: "info",
    output: "json",
    onlyCategories: ["performance"],
    port: chrome.port,
    throttling: {
      cpuSlowdownMultiplier: 1,
      rttMs: 40,
      throughputKbps: 10240,
    },
    disableStorageReset: true,
  };

  let runnerResult;
  try {
    console.log(`Starting Lighthouse run for URL: ${url}`);
    runnerResult = await lighthouse(url, options);
    console.log(`Lighthouse run completed for URL: ${url}`);
  } catch (error) {
    console.error("Error during Lighthouse run:", error);
    await chrome.kill();
    throw error; // Rethrow the error after cleanup
  }

  const { audits, categories } = runnerResult.lhr;

  // Extracting important performance metrics
  const performanceScore = categories.performance.score * 100;
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
