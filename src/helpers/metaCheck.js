async function extractMetaTags(page) {
  return await page.evaluate(() => {
    const getMetaTag = (name) =>
      document.querySelector(`meta[name='${name}']`)?.getAttribute("content") ||
      "";
    const getOGTag = (property) =>
      document
        .querySelector(`meta[property='${property}']`)
        ?.getAttribute("content") || "";

    return {
      title: document.querySelector("title")?.innerText || "",
      description: getMetaTag("description"),
      keywords: getMetaTag("keywords"),
      viewport: getMetaTag("viewport"),
      canonical:
        document.querySelector('link[rel="canonical"]')?.getAttribute("href") ||
        "",
      ogTitle: getOGTag("og:title"),
      ogDescription: getOGTag("og:description"),
      ogImage: getOGTag("og:image"),
    };
  });
}

module.exports = { extractMetaTags };
