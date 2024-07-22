document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("analyzeForm");

  const progressContainer = document.querySelector(".progress");
  const progressBar = document.querySelector(".progress-bar");
  const statusText = document.querySelector("#status");

  let isAnalysisStarted = false; // Flag to prevent double initialization

  const startAnalysis = (url) => {
    if (isAnalysisStarted) return; // Prevent double calls
    isAnalysisStarted = true;

    console.log("startAnalysis called with URL:", url); // Add logging here

    if (progressContainer && progressBar && statusText) {
      progressContainer.style.display = "block";
      progressBar.style.width = "0%";
      progressBar.innerText = "0%";
      statusText.innerText = "Starting analysis...";

      const source = new EventSource(
        `/seo/analyze?url=${encodeURIComponent(url)}`
      );

      source.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        progressBar.style.width = `${data.progress}%`;
        progressBar.innerText = `${data.progress}%`;
        statusText.innerText = data.status;

        if (data.progress === 100) {
          source.close();
          if (data.status.startsWith("Error:")) {
            window.location.href = `/?error=${encodeURIComponent(data.status)}`;
          } else {
            window.location.href = `/seo/result?url=${encodeURIComponent(url)}`;
          }
        }
      });

      source.addEventListener("error", () => {
        source.close();
        statusText.innerText =
          "An error occurred during analysis. Please try again later.";
      });
    } else {
      console.error(
        "One or more elements (progress bar, progress container, status text) are missing."
      );
    }
  };

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let url = form.url.value.trim();
      console.log("Form submitted with URL:", url); // Add logging here

      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `http://${url}`;
      }

      startAnalysis(url);
    });
  }

  const params = new URLSearchParams(window.location.search);
  if (params.has("url")) {
    const url = params.get("url");
    startAnalysis(url);
  }

  if (params.has("error")) {
    const error = params.get("error");
    statusText.innerText = error;
    statusText.style.color = "red";
  }
});
