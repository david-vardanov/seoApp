const express = require("express");
const router = express.Router();
const seoController = require("../controllers/seoController");
const { getPaginatedLinks } = require("../storage/analysisResults");

router.get("/analyze", seoController.analyze);

router.get("/result", (req, res) => {
  const { url, page = 0 } = req.query;
  if (!url) {
    return res.redirect("/");
  }
  const analysis = seoController.getAnalysis(url);
  if (!analysis) {
    return res.redirect("/");
  }

  const paginatedLinks = getPaginatedLinks(url, parseInt(page));
  res.render("pages/result", {
    analysis,
    paginatedLinks,
    title: "SEO Analysis Result",
  });
});

router.get("/links", (req, res) => {
  const { url, page = 0 } = req.query;
  const paginatedLinks = getPaginatedLinks(url, parseInt(page));
  if (!paginatedLinks) {
    return res.status(404).send("No analysis found for the given URL");
  }
  res.json(paginatedLinks);
});

router.post("/reanalyze", (req, res) => {
  const { url } = req.body;
  res.redirect(`/seo/analyze?url=${encodeURIComponent(url)}`);
});

module.exports = router;
