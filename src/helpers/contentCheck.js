async function extractHeaders(page) {
  return await page.evaluate(() => {
    return [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")].map(
      (el) => ({
        tag: el.tagName,
        content: el.innerText,
      })
    );
  });
}

async function extractLinks(page) {
  return await page.evaluate(() => {
    return Array.from(document.querySelectorAll("a")).map((anchor) => ({
      href: anchor.href,
      text: anchor.innerText,
      isInternal: anchor.hostname === location.hostname,
    }));
  });
}

module.exports = { extractHeaders, extractLinks };
