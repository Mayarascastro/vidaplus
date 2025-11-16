document.addEventListener('DOMContentLoaded', function () {

  const perfilInput = document.getElementById('perfil');
  const profileButtons = document.querySelectorAll('.profile-btn');
  const togglePasswordBtn = document.querySelector('.toggle-password');
  const senhaField = document.getElementById('senha');
  const form = document.getElementById('loginForm');

  // Seleção de perfil
  profileButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      profileButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      perfilInput.value = btn.dataset.role;
    });
  });

  // Toggle senha
  togglePasswordBtn.addEventListener('click', () => {
    const isPassword = senhaField.type === "password";
    senhaField.type = isPassword ? "text" : "password";
    togglePasswordBtn.textContent = isPassword ? "visibility_off" : "visibility";
  });

  function loadUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
  }

  const profissionais = JSON.parse(localStorage.getItem("profissionais")) || [];
  const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const senha = document.getElementById("senha").value.trim();
    const perfil = perfilInput.value;

    const users = loadUsers().map(u => ({ ...u, email: u.email.toLowerCase() }));

    const user = users.find(u => u.email === email && u.senha == senha);

    if (!user) {
      alert("Credenciais inválidas");
      return;
    }

    if (user.perfil !== perfil) {
      alert("Usuário não pertence ao perfil selecionado.");
      return;
    }

    const session = { ...user };

    if (perfil === "profissional") {
      const p = profissionais.find(x => x.email === user.email);
      if (p) session.profissionalId = p.id;
    }

    if (perfil === "paciente") {
      const p = pacientes.find(x => x.email === user.email);
      if (p) session.pacienteId = p.id;
    }

    localStorage.setItem("user_session", JSON.stringify(session));

    if (perfil === "admin") window.location.href = "admin_main.html";
    if (perfil === "profissional") window.location.href = "profissional_dashboard.html";
    if (perfil === "paciente") window.location.href = "paciente_dashboard.html";
  });
});
