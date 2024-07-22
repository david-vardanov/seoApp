const express = require("express");
const router = express.Router();
const seoController = require("../controllers/seoController");
const { getPaginatedLinks } = require("../storage/analysisResults");

router.get("/analyze", seoController.analyze);

router.get("/result", seoController.getAnalysisByUrl);

router.get("/links", (req, res) => {
  const { url, page = 0 } = req.query;
  const paginatedLinks = getPaginatedLinks(url, parseInt(page));
  if (!paginatedLinks) {
    return res.status(404).send("No analysis found for the given URL");
  }
  res.json(paginatedLinks);
});

router.get("/report", seoController.downloadReport);

module.exports = router;
