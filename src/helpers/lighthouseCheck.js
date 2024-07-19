async function getLighthouseMetrics(url) {
  const { getLighthouseMetrics } = await import(
    "../utils/LighthouseMetrics.mjs"
  );
  return getLighthouseMetrics(url);
}

module.exports = { getLighthouseMetrics };
