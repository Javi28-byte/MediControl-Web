document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  const drops = document.querySelectorAll(".drop");
  const dropButtons = document.querySelectorAll(".drop-btn");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", nav.classList.contains("active"));
    });
  }

  dropButtons.forEach((button, index) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      drops.forEach((drop, i) => {
        if (i !== index) drop.classList.remove("open");
      });
      drops[index].classList.toggle("open");
    });
  });

  document.addEventListener("click", (e) => {
    drops.forEach(drop => {
      if (!drop.contains(e.target)) drop.classList.remove("open");
    });
  });

  document.querySelectorAll(".nav-links a").forEach(a => {
    a.addEventListener("click", () => {
      if (nav) nav.classList.remove("active");
      drops.forEach(drop => drop.classList.remove("open"));
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
      notice.textContent = "Gracias. Hemos recibido tu solicitud de contacto. En una versión conectada, este formulario enviaría la solicitud a recepción.";
      form.reset();
    });
  }

  const appointmentForm = document.querySelector("#appointmentForm");
  const appointmentNotice = document.querySelector("#appointmentNotice");
  if (appointmentForm && appointmentNotice) {
    appointmentForm.addEventListener("submit", e => {
      e.preventDefault();
      appointmentNotice.style.display = "block";
      appointmentNotice.textContent = "Solicitud preparada. Esta demostración no realiza una reserva real; en una versión conectada, la solicitud llegaría a recepción.";
      appointmentForm.reset();
    });
  }
});