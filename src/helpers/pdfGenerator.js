const PDFDocument = require("pdfkit");

function generatePDF(analysis, res) {
  const doc = new PDFDocument();
  let buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    let pdfData = Buffer.concat(buffers);
    res
      .writeHead(200, {
        "Content-Length": Buffer.byteLength(pdfData),
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment;filename=report.pdf",
      })
      .end(pdfData);
  });

  doc.fontSize(25).text("SEO Analysis Report", { align: "center" });
  doc.moveDown();
  doc.fontSize(18).text(`URL: ${analysis.url}`);
  doc.moveDown();

  // Meta Tags Section
  doc.fontSize(16).text("Meta Tags");
  doc.fontSize(12).text(`Title: ${analysis.title || "N/A"}`);
  doc.text(`Description: ${analysis.description || "N/A"}`);
  doc.text(`Keywords: ${analysis.keywords || "N/A"}`);
  doc.moveDown();

  // Headers Section
  doc.fontSize(16).text("Headers");
  if (analysis.headers && analysis.headers.length > 0) {
    analysis.headers.forEach((header) => {
      doc.fontSize(12).text(`${header.tag}: ${header.content}`);
    });
  } else {
    doc.fontSize(12).text("No headers found.");
  }
  doc.moveDown();

  // Strong Texts Section
  doc.fontSize(16).text("Strong Texts");
  if (analysis.strongs && analysis.strongs.length > 0) {
    analysis.strongs.forEach((strong) => {
      doc.fontSize(12).text(strong);
    });
  } else {
    doc.fontSize(12).text("No strong texts found.");
  }
  doc.moveDown();

  // Bold Texts Section
  doc.fontSize(16).text("Bold Texts");
  if (analysis.bolds && analysis.bolds.length > 0) {
    analysis.bolds.forEach((bold) => {
      doc.fontSize(12).text(bold);
    });
  } else {
    doc.fontSize(12).text("No bold texts found.");
  }
  doc.moveDown();

  // First Paragraph Section
  doc.fontSize(16).text("First Paragraph");
  doc.fontSize(12).text(analysis.firstParagraph || "No paragraphs found.");
  doc.moveDown();

  // Content Word Count Section
  doc.fontSize(16).text("Content Word Count");
  doc.fontSize(12).text(`Total paragraphs: ${analysis.paragraphsCount}`);
  doc.moveDown();

  // Links Section
  doc.fontSize(16).text("Links");
  if (analysis.links && analysis.links.length > 0) {
    analysis.links.forEach((link) => {
      doc
        .fontSize(12)
        .text(`${link.href} (${link.isInternal ? "Internal" : "External"})`);
    });
  } else {
    doc.fontSize(12).text("No links found.");
  }
  doc.moveDown();

  // Lighthouse Metrics Section
  doc.fontSize(16).text("Lighthouse Metrics");
  if (analysis.lightHouseMetrics) {
    Object.keys(analysis.lightHouseMetrics).forEach((key) => {
      doc.fontSize(12).text(`${key}: ${analysis.lightHouseMetrics[key]}`);
    });
  } else {
    doc.fontSize(12).text("Lighthouse Metrics not available.");
  }

  doc.end();
}

module.exports = { generatePDF };
