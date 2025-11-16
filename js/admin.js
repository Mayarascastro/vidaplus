// admin.js – controla o menu da dashboard do administrador

document.addEventListener("DOMContentLoaded", () => {
  // Protege a página
  const session = requireAuth(["admin"]);
  if (!session) return;

  // === MENU LATERAL =========================================
  const menuItems = document.querySelectorAll(".menu-item");

  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      // remove ativo de todos
      menuItems.forEach(i => i.classList.remove("active"));
      // adiciona no clicado
      item.classList.add("active");

      const id = item.id;

      // Chama as telas correspondentes
      switch (id) {
        case "menu-dashboard":
          window.location.href = "admin_main.html";
          break;

        case "menu-profissionais":
          window.location.href = "admin_profissionais.html";
          break;

        case "menu-pacientes":
          window.location.href = "admin_pacientes.html";
          break;

        case "menu-consultas":
          window.location.href = "admin_consultas.html";
          break;

        case "menu-usuarios":
          window.location.href = "admin_usuarios.html";
          break;
      }
    });
  });

  // === CARREGAR NÚMEROS DA DASHBOARD ==========================
  atualizarResumo();

});

function atualizarResumo() {
  const profissionais = JSON.parse(localStorage.getItem("profissionais")) || [];
  const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
  const consultas = JSON.parse(localStorage.getItem("consultas")) || [];

  if (document.getElementById("count-pacientes"))
    document.getElementById("count-pacientes").textContent = pacientes.length;

  if (document.getElementById("count-profissionais"))
    document.getElementById("count-profissionais").textContent = profissionais.length;

  if (document.getElementById("count-consultas"))
    document.getElementById("count-consultas").textContent =
      consultas.filter(c => c.data === getHoje()).length;

  if (document.getElementById("count-agendadas"))
    document.getElementById("count-agendadas").textContent = consultas.length;
}

function getHoje() {
  const hoje = new Date();
  return hoje.toISOString().split("T")[0];
}
