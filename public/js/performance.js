document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".circle").forEach((circle) => {
    const value = circle.getAttribute("data-value");
    circle.style.setProperty("--value", value / 100);
    const span = circle.querySelector("span");
    span.textContent = `${value}%`;
  });
});
