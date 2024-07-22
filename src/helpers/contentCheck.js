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

async function extractStrongAndBoldTexts(page) {
  const strongs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("strong")).map(
      (el) => el.innerText
    );
  });

  const bolds = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("b")).map((el) => el.innerText);
  });

  return { strongs, bolds };
}

async function extractFirstParagraph(page) {
  return await page.evaluate(() => {
    const p = document.querySelector("p");
    return p ? p.innerText : null;
  });
}

module.exports = {
  extractHeaders,
  extractLinks,
  extractStrongAndBoldTexts,
  extractFirstParagraph,
};
