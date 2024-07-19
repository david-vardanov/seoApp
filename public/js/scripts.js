document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("analyzeForm");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      let url = form.url.value.trim();
      const statusText = document.querySelector("#status");

      if (!url) {
        statusText.innerText = "Please enter a URL.";
        statusText.style.color = "red";
        return;
      }

      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `https://${url}`;
      }

      try {
        new URL(url); // Validate URL
      } catch (e) {
        statusText.innerText = "Invalid URL format.";
        statusText.style.color = "red";
        return;
      }

      window.location.href = `/?url=${encodeURIComponent(url)}`;
    });
  }

  const params = new URLSearchParams(window.location.search);
  if (params.has("error")) {
    const error = params.get("error");
    const statusText = document.querySelector("#status");
    if (statusText) {
      statusText.innerText = error;
      statusText.style.color = "red"; // Optional: Make the error text red
    }
  }
});
