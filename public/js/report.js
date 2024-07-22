document.addEventListener("DOMContentLoaded", () => {
  const downloadButton = document.getElementById("downloadReport");

  downloadButton.addEventListener("click", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const url = urlParams.get("url");

    fetch(`/seo/report?url=${encodeURIComponent(url)}`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "SEO_Report.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => console.error("Error downloading report:", err));
  });
});
