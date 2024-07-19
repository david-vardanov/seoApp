document.addEventListener("DOMContentLoaded", () => {
  const updateLinks = (url, page) => {
    if (!url) return;

    fetch(`/seo/links?url=${encodeURIComponent(url)}&page=${page}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No analysis found for the given URL");
        }
        return response.json();
      })
      .then((data) => {
        const linksList = document.querySelector("#links-list");
        linksList.innerHTML = "";
        data.links.forEach((link) => {
          const listItem = document.createElement("li");
          listItem.className =
            "list-group-item d-flex justify-content-between align-items-center";
          listItem.innerHTML = `
            <span>
              <a href="${link.href}" target="_blank">${link.href}</a> (${
            link.isInternal ? "Internal" : "External"
          })
            </span>
            <button class="btn btn-secondary btn-sm analyze-link" data-url="${
              link.href
            }">
              <i class="bi bi-search"></i> Analyze
            </button>`;
          linksList.appendChild(listItem);
        });

        const paginationLinks = document.querySelectorAll(
          "#links-pagination .page-link"
        );
        paginationLinks.forEach((link, index) => {
          if (index === data.currentPage) {
            link.parentElement.classList.add("active");
          } else {
            link.parentElement.classList.remove("active");
          }
        });

        const analyzeButtons = document.querySelectorAll(".analyze-link");
        analyzeButtons.forEach((button) => {
          button.addEventListener("click", (event) => {
            const url = button.getAttribute("data-url");
            const formInput = document.querySelector(
              "#reanalyzeForm input[name='url']"
            );
            if (formInput) {
              formInput.value = url;
              form.submit();
            } else {
              console.error("Form input element not found");
            }
          });
        });
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  };

  const paginationLinks = document.querySelectorAll(
    "#links-pagination .page-link"
  );
  paginationLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const page = parseInt(event.target.dataset.page, 10);
      const url = new URLSearchParams(window.location.search).get("url");
      updateLinks(url, page);
    });
  });

  // Initialize the first page
  const url = new URLSearchParams(window.location.search).get("url");
  if (url) {
    updateLinks(url, 0);
  }
});
