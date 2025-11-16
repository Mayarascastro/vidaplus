function criarUsuariosPadrao() {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  const padroes = [
    {
      id: "U_ADMIN",
      nome: "Administrador",
      email: "admin@vida.com",
      senha: "1234",
      perfil: "admin"
    },
    {
      id: "U_PROF",
      nome: "Profissional Exemplo",
      email: "profissional@vida.com",
      senha: "1234",
      perfil: "profissional"
    },
    {
      id: "U_PAC",
      nome: "Paciente Exemplo",
      email: "paciente@vida.com",
      senha: "1234",
      perfil: "paciente"
    }
  ];

  let alterado = false;

  padroes.forEach(p => {
    const existe = users.some(u => u.email === p.email);
    if (!existe) {
      users.push(p);
      alterado = true;
    }
  });

  if (alterado) {
    localStorage.setItem("users", JSON.stringify(users));
    console.log("Usuários padrão criados!");
  }
}

// Executa ao carregar o site
criarUsuariosPadrao();


// =======================================================
// auth.js original — session helpers and page protection
// =======================================================

function getSession() {
  try { return JSON.parse(localStorage.getItem("user_session")); }
  catch(e) { return null; }
}

function requireAuth(allowedProfiles) {
  const session = getSession();
  if (!session) {
    window.location.href = "login.html";
    return null;
  }
  if (allowedProfiles && allowedProfiles.length && !allowedProfiles.includes(session.perfil)) {
    alert("Acesso não autorizado para o seu perfil.");
    window.location.href = "login.html";
    return null;
  }
  const el = document.getElementById('user-name-display');
  if (el) el.textContent = session.nome || session.email || '';
  return session;
}

function logout() {
  localStorage.removeItem("user_session");
  window.location.href = "login.html";
}