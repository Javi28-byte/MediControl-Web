
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  const drop = document.querySelector(".drop");
  const dropBtn = document.querySelector(".drop-btn");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", nav.classList.contains("active"));
    });
  }

  if (dropBtn) {
    dropBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      drop.classList.toggle("open");
    });
  }

  document.addEventListener("click", (e) => {
    if (drop && !drop.contains(e.target)) drop.classList.remove("open");
  });

  document.querySelectorAll(".nav-links a").forEach(a => {
    a.addEventListener("click", () => {
      if (nav) nav.classList.remove("active");
      if (drop) drop.classList.remove("open");
    });
  });

  const reveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  }, {threshold:.12});

  document.querySelectorAll(".reveal").forEach(el => reveal.observe(el));

  const form = document.querySelector("#contactForm");
  const notice = document.querySelector("#formNotice");
  if (form && notice) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      notice.style.display = "block";
      notice.textContent = "Gracias. La solicitud de demostración quedó preparada como mensaje de contacto.";
      form.reset();
    });
  }
});
