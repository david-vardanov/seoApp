document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("analyzeForm");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const url = form.url.value;

      document.querySelector(".progress").style.display = "block";
      document.querySelector(".progress-bar").style.width = "0%";
      document.querySelector(".progress-bar").innerText = "0%";
      document.querySelector("#status").innerText = "Starting analysis...";

      const source = new EventSource(
        `/seo/analyze?url=${encodeURIComponent(url)}`
      );

      source.addEventListener("message", function (event) {
        const data = JSON.parse(event.data);
        document.querySelector(
          ".progress-bar"
        ).style.width = `${data.progress}%`;
        document.querySelector(".progress-bar").innerText = `${data.progress}%`;
        document.querySelector("#status").innerText = data.status;

        if (data.progress === 100) {
          source.close();
          window.location.href = `/seo/result?url=${encodeURIComponent(url)}`;
        }
      });

      source.addEventListener("error", function () {
        source.close();
        document.querySelector("#status").innerText =
          "An error occurred during analysis. Please try again later.";
      });
    });
  }
});
