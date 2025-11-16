// admin_consultas.js
document.getElementById("modalAgendar") && (document.getElementById("modalAgendar").style.display = "none");

document.addEventListener("DOMContentLoaded", () => {
  // auth guard (admin)
  const session = JSON.parse(localStorage.getItem("user_session"));
  if (!session || session.perfil !== "admin") {
    window.location.href = "login.html";
    return;
  }

  carregarListas();
  carregarConsultas();

  const form = document.getElementById("formAgendarConsulta");
  if (form) form.addEventListener("submit", salvarConsulta);

  const searchEl = document.getElementById("searchConsulta");
  if (searchEl) searchEl.addEventListener("input", filtrarConsultas);
});

// modal controls
function openScheduleModal() {
  carregarListas(); // atualiza selects antes de abrir
  const m = document.getElementById("modalAgendar");
  if (m) m.style.display = "flex";
}
function closeScheduleModal() {
  const m = document.getElementById("modalAgendar");
  if (m) m.style.display = "none";
}

// load selects
function carregarListas() {
  const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
  const profissionais = JSON.parse(localStorage.getItem("profissionais")) || [];

  const selectPac = document.getElementById("agendarPaciente");
  const selectProf = document.getElementById("agendarProfissional");
  if (selectPac) {
    selectPac.innerHTML = pacientes.map(p => `<option value="${p.id}">${p.nome}${p.cpf ? ' ('+p.cpf+')' : ''}</option>`).join("") || `<option value="">Nenhum paciente cadastrado</option>`;
  }
  if (selectProf) {
    selectProf.innerHTML = profissionais.map(p => `<option value="${p.id}" data-email="${p.email || ''}">${p.nome}${p.especialidade ? ' - '+p.especialidade : ''}</option>`).join("") || `<option value="">Nenhum profissional cadastrado</option>`;
  }
}

// save consultation — always store ids AND names/emails for compatibility
function salvarConsulta(e) {
  e.preventDefault();
  const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
  const profissionais = JSON.parse(localStorage.getItem("profissionais")) || [];
  let consultas = JSON.parse(localStorage.getItem("consultas") || "[]");

  const pacienteId = document.getElementById("agendarPaciente").value;
  const profissionalId = document.getElementById("agendarProfissional").value;
  const data = document.getElementById("agendarData").value;
  const hora = document.getElementById("agendarHora").value;
  const tipo = document.getElementById("agendarTipo").value || "presencial";
  const status = document.getElementById("agendarStatus").value || "agendada";

  if (!pacienteId || !profissionalId || !data || !hora) {
    alert("Preencha todos os campos.");
    return;
  }

  const paciente = pacientes.find(p => p.id === pacienteId) || {};
  const profissional = profissionais.find(p => p.id === profissionalId) || {};

  const novaConsulta = {
    id: "CONS_" + Date.now() + "_" + Math.floor(Math.random()*1000),
    pacienteId: pacienteId,
    pacienteName: paciente.nome || '',
    profissionalId: profissionalId,
    profissional: profissional.nome || profissional.email || '',
    profissionalEmail: profissional.email || '',
    data,
    hora,
    tipo,
    status,
    prontuario: ""
  };

  consultas.push(novaConsulta);
  localStorage.setItem("consultas", JSON.stringify(consultas));

  alert("Consulta agendada com sucesso!");
  closeScheduleModal();
  carregarConsultas();
}

// listagem admin
function carregarConsultas(filter = "") {
  const consultas = JSON.parse(localStorage.getItem("consultas")) || [];
  const list = document.getElementById("listaConsultas");
  if (!list) return;

  const filas = consultas.filter(c => {
    if (!filter) return true;
    const texto = `${c.pacienteName||''} ${c.profissional||''} ${c.data||''}`.toLowerCase();
    return texto.includes(filter.toLowerCase());
  });

  list.innerHTML = filas.map(c => `
      <tr>
        <td>${c.pacienteName || buscarNome("pacientes", c.pacienteId) || "—"}</td>
        <td>${c.profissional || buscarNome("profissionais", c.profissionalId) || "—"}</td>
        <td>${c.data}</td>
        <td>${c.hora}</td>
        <td>${c.tipo || "Presencial"}</td>
        <td>${c.status || "agendada"}</td>
        <td>
          <button class="btn-small" onclick="alert('Edição em breve')">Editar</button>
          <button class="btn-small danger" onclick="removerConsulta('${c.id}')">Cancelar</button>
        </td>
      </tr>
    `).join("") || "<tr><td colspan='7'>Nenhuma consulta encontrada</td></tr>";
}

function buscarNome(chave, id) {
  const lista = JSON.parse(localStorage.getItem(chave)) || [];
  const item = lista.find(x => x.id == id);
  return item ? item.nome : null;
}

function removerConsulta(id) {
  if (!confirm("Deseja cancelar esta consulta?")) return;
  let consultas = JSON.parse(localStorage.getItem("consultas") || "[]");
  consultas = consultas.filter(c => c.id !== id);
  localStorage.setItem("consultas", JSON.stringify(consultas));
  carregarConsultas();
}

// busca (usada pelo input)
function filtrarConsultas() {
  const termo = document.getElementById("searchConsulta").value;
  carregarConsultas(termo);
}
