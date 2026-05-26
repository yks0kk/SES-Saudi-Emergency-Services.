const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("show");
  });
});

document.querySelectorAll(".fade").forEach(el => observer.observe(el));

const input = document.getElementById("numInput");

input.addEventListener("input", () => {
  input.value = input.value.replace(/[^0-9]/g, "");
});