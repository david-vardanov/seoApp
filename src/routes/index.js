const express = require("express");
const router = express.Router();
const seoRoutes = require("./seoRoutes");

// Use SEO routes
router.use("/seo", seoRoutes);

router.get("/", (req, res) => {
  const { url } = req.query;
  if (url) {
    res.render("pages/index", { title: "SEO Analyzer", url });
  } else {
    res.render("pages/index", { title: "SEO Analyzer" });
  }
});

module.exports = router;
