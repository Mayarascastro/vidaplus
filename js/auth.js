// auth.js - session helpers and page protection
function getSession() {
  try { return JSON.parse(localStorage.getItem("user_session")); } catch(e) { return null; }
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
