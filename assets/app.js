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
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  const reveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  }, { threshold: .12 });

  document.querySelectorAll(".reveal").forEach(el => reveal.observe(el));

  // Contacto: registro local de la solicitud para evitar formularios que aparenten enviar datos a un servidor inexistente.
  const contactForm = document.querySelector("#contactForm");
  const contactNotice = document.querySelector("#formNotice");
  if (contactForm && contactNotice) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        tipo: "contacto",
        fechaRegistro: new Date().toISOString(),
        nombre: document.querySelector("#contactName")?.value.trim() || "",
        email: document.querySelector("#contactEmail")?.value.trim() || "",
        motivo: document.querySelector("#subject")?.value || "",
        mensaje: document.querySelector("#message")?.value.trim() || ""
      };
      const records = JSON.parse(localStorage.getItem("medicontrol_contactos") || "[]");
      records.push(data);
      localStorage.setItem("medicontrol_contactos", JSON.stringify(records));
      contactNotice.style.display = "block";
      contactNotice.textContent = "Tu solicitud de contacto quedó registrada correctamente en este dispositivo.";
      contactForm.reset();
    });
  }

  // Citas: registra la solicitud en el navegador y permite descargar un comprobante.
  const appointmentForm = document.querySelector("#appointmentForm");
  const appointmentNotice = document.querySelector("#appointmentNotice");
  const appointmentActions = document.querySelector("#appointmentActions");
  const downloadAppointment = document.querySelector("#downloadAppointment");
  let lastAppointment = null;

  const setMinimumDate = () => {
    const dateInput = document.querySelector("#date");
    if (dateInput) {
      const now = new Date();
      const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split("T")[0];
      dateInput.min = localDate;
    }
  };
  setMinimumDate();

  const params = new URLSearchParams(window.location.search);
  const specialtyParam = params.get("especialidad");
  const specialtySelect = document.querySelector("#specialty");
  if (specialtySelect && specialtyParam) {
    const option = [...specialtySelect.options].find(o => o.value === specialtyParam);
    if (option) specialtySelect.value = specialtyParam;
  }

  if (appointmentForm && appointmentNotice) {
    appointmentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!appointmentForm.reportValidity()) return;

      lastAppointment = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        tipo: "cita",
        fechaRegistro: new Date().toISOString(),
        nombre: document.querySelector("#name").value.trim(),
        telefono: document.querySelector("#phone").value.trim(),
        correo: document.querySelector("#email").value.trim(),
        especialidad: document.querySelector("#specialty").value,
        fechaPreferida: document.querySelector("#date").value,
        horarioPreferido: document.querySelector("#time").value,
        motivo: document.querySelector("#reason").value.trim()
      };

      const records = JSON.parse(localStorage.getItem("medicontrol_citas") || "[]");
      records.push(lastAppointment);
      localStorage.setItem("medicontrol_citas", JSON.stringify(records));

      appointmentNotice.style.display = "block";
      appointmentNotice.textContent = "Tu solicitud fue registrada correctamente en este dispositivo. Descarga el comprobante para conservar los datos de tu solicitud.";
      if (appointmentActions) appointmentActions.hidden = false;
      appointmentForm.reset();
      setMinimumDate();
    });
  }

  if (downloadAppointment) {
    downloadAppointment.addEventListener("click", () => {
      if (!lastAppointment) return;
      const text = [
        "CLÍNICA MEDICONTROL",
        "COMPROBANTE DE SOLICITUD DE CITA",
        "----------------------------------------",
        `Código: ${lastAppointment.id}`,
        `Nombre: ${lastAppointment.nombre}`,
        `Teléfono: ${lastAppointment.telefono}`,
        `Correo: ${lastAppointment.correo}`,
        `Especialidad: ${lastAppointment.especialidad}`,
        `Fecha preferida: ${lastAppointment.fechaPreferida}`,
        `Horario preferido: ${lastAppointment.horarioPreferido}`,
        `Motivo: ${lastAppointment.motivo}`,
        "",
        "Este documento corresponde a una solicitud de cita y no constituye una confirmación de atención."
      ].join("\n");
      downloadText(text, `MediControl_Solicitud_${lastAppointment.id.slice(0, 8)}.txt`);
    });
  }

  function downloadText(content, filename) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
});
