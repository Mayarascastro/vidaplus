// ==================== RESET LEGADO ====================
// Remove storage antigo para evitar conflito
localStorage.removeItem("usuarios");


// ==================== CRIA USUÁRIOS PADRÃO ====================
function criarUsuariosPadrao() {

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let profissionais = JSON.parse(localStorage.getItem("profissionais")) || [];
  let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];

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
      perfil: "profissional",
      especialidade: "Clínico Geral",
      telefone: "(00) 00000-0000"
    },
    {
      id: "U_PAC",
      nome: "Paciente Exemplo",
      email: "paciente@vida.com",
      senha: "1234",
      perfil: "paciente",
      cpf: "000.000.000-00",
      telefone: "(00) 00000-0000"
    }
  ];

  let changed = false;

  padroes.forEach(u => {

    // USERS
    if (!users.some(x => x.email === u.email)) {
      users.push({
        id: u.id,
        nome: u.nome,
        email: u.email,
        senha: u.senha,
        perfil: u.perfil
      });
      changed = true;
    }

    // PROFISSIONAIS
    if (u.perfil === "profissional") {
      if (!profissionais.some(x => x.email === u.email)) {
        profissionais.push({
          id: u.id,
          nome: u.nome,
          email: u.email,
          especialidade: u.especialidade,
          telefone: u.telefone
        });
        changed = true;
      }
    }

    // PACIENTES
    if (u.perfil === "paciente") {
      if (!pacientes.some(x => x.email === u.email)) {
        pacientes.push({
          id: u.id,
          nome: u.nome,
          email: u.email,
          cpf: u.cpf,
          telefone: u.telefone
        });
        changed = true;
      }
    }
  });

  if (changed) {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("profissionais", JSON.stringify(profissionais));
    localStorage.setItem("pacientes", JSON.stringify(pacientes));
  }
}

criarUsuariosPadrao();


// ==================== SESSÃO ====================
function getSession() {
  try { return JSON.parse(localStorage.getItem("user_session")); }
  catch { return null; }
}

function requireAuth(allowed) {
  const s = getSession();
  if (!s) {
    window.location.href = "login.html";
    return null;
  }
  if (allowed && !allowed.includes(s.perfil)) {
    alert("Acesso não autorizado.");
    window.location.href = "login.html";
    return null;
  }
  const nameEl = document.getElementById("user-name-display");
  if (nameEl) nameEl.textContent = s.nome || s.email;
  return s;
}

function logout() {
  localStorage.removeItem("user_session");
  window.location.href = "login.html";
}
