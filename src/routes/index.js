const express = require("express");
const router = express.Router();
const seoRoutes = require("./seoRoutes");

router.use("/seo", seoRoutes);

router.get("/", (req, res) => {
  const { url, error } = req.query;
  res.render("pages/index", { title: "SEO Analyzer", url, error });
});

module.exports = router;
