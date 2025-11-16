// login.js - handles login form and session
document.addEventListener('DOMContentLoaded', function(){
  // profile buttons
  const profileButtons = document.querySelectorAll(".profile-btn");
  const perfilInput = document.getElementById("perfil");
  profileButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      profileButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      perfilInput.value = btn.dataset.role;
    });
  });

  // toggle password
  const togglePasswordButton = document.querySelector(".toggle-password");
  const senhaField = document.getElementById("senha");
  if (togglePasswordButton && senhaField) {
    togglePasswordButton.addEventListener("click", () => {
      const isPassword = senhaField.type === "password";
      senhaField.type = isPassword ? "text" : "password";
      togglePasswordButton.textContent = isPassword ? "visibility_off" : "visibility";
    });
  }

  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", function(e){
      e.preventDefault();

      const rawEmail = document.getElementById("email").value || '';
      const rawSenha = document.getElementById("senha").value || '';
      const perfil = document.getElementById("perfil").value;

      const email = rawEmail.trim().toLowerCase();
      const senha = rawSenha.trim();

      let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

      // debug quick log (remova em produção)
      // console.log('Tentativa de login:', {email, perfil});
      // console.log('usuarios armazenados:', usuarios);

      const usuarioEncontrado = usuarios.find(u => {
        const uEmail = (u.email || '').toString().trim().toLowerCase();
        const uSenha = (u.senha || '').toString().trim();
        const uPerfil = (u.perfil || '').toString().trim();
        return uEmail === email && uSenha === senha && uPerfil === perfil;
      });

      if (!usuarioEncontrado) {
        alert("Credenciais inválidas!");
        return;
      }

      // save session (with id, pacienteId, profissionalId)
      localStorage.setItem("user_session", JSON.stringify({
        id: usuarioEncontrado.id || null,
        nome: usuarioEncontrado.nome || '',
        email: usuarioEncontrado.email || '',
        perfil: usuarioEncontrado.perfil || '',
        pacienteId: usuarioEncontrado.pacienteId || null,
        profissionalId: usuarioEncontrado.profissionalId || null
      }));

      // redirect based on profile
      if (perfil === "admin") window.location.href = "admin_main.html";
      if (perfil === "profissional") window.location.href = "profissional_dashboard.html";
      if (perfil === "paciente") window.location.href = "paciente_dashboard.html";
    });
  }
});
