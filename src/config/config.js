module.exports = {
  port: process.env.PORT || 3000,
  puppeteerOptions: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
};
