document.addEventListener("DOMContentLoaded", () => {
  const tabLinks = document.querySelectorAll('[data-bs-toggle="tab"]');
  tabLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      new bootstrap.Tab(link).show();
    });
  });
});
