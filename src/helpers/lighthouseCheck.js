async function getLighthouseMetrics(url) {
  const { getLighthouseMetrics } = await import(
    "../utils/LighthouseMetrics.mjs"
  );
  return await getLighthouseMetrics(url);
}

module.exports = { getLighthouseMetrics };
