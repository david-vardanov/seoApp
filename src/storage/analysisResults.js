const analysisResults = {};

function storeAnalysis(url, analysis) {
  analysisResults[url] = analysis;
}

function getAnalysis(url) {
  return analysisResults[url];
}

function getPaginatedLinks(url, page = 0, pageSize = 10) {
  const analysis = analysisResults[url];
  if (!analysis) return null;

  const start = page * pageSize;
  const end = start + pageSize;
  const paginatedLinks = analysis.links.slice(start, end);
  const totalPages = Math.ceil(analysis.links.length / pageSize);

  return {
    links: paginatedLinks,
    totalPages,
    currentPage: page,
  };
}

module.exports = { storeAnalysis, getAnalysis, getPaginatedLinks };
