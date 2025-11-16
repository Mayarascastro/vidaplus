document.addEventListener('DOMContentLoaded', function () {

  const session = JSON.parse(localStorage.getItem("user_session"));
  if (!session || session.perfil !== "admin") {
    window.location.href = "login.html";
    return;
  }

  const list = document.getElementById("listaUsuarios");

  function render() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    list.innerHTML = "";

    users.forEach((u, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.nome}</td>
        <td>${u.email}</td>
        <td>${u.perfil}</td>
        <td><button class="btn-small" data-del="${i}">Excluir</button></td>
      `;
      list.appendChild(tr);
    });
  }

  document.addEventListener("click", e => {
    if (e.target.matches("[data-del]")) {
      if (!confirm("Excluir usuário?")) return;

      let users = JSON.parse(localStorage.getItem("users")) || [];
      const deleted = users.splice(Number(e.target.dataset.del), 1)[0];

      localStorage.setItem("users", JSON.stringify(users));

      // remover também profissionais/pacientes
      if (deleted.perfil === "profissional") {
        let profs = JSON.parse(localStorage.getItem("profissionais")) || [];
        profs = profs.filter(p => p.email !== deleted.email);
        localStorage.setItem("profissionais", JSON.stringify(profs));
      }

      if (deleted.perfil === "paciente") {
        let pacs = JSON.parse(localStorage.getItem("pacientes")) || [];
        pacs = pacs.filter(p => p.email !== deleted.email);
        localStorage.setItem("pacientes", JSON.stringify(pacs));
      }

      render();
    }
  });

  render();
});
