// admin_pacientes.js - CRUD de pacientes (admin) + sincronização com usuarios
document.addEventListener('DOMContentLoaded', function () {
  const session = JSON.parse(localStorage.getItem("user_session"));
  if (!session || session.perfil !== 'admin') { window.location.href = "login.html"; return; }

  // DOM
  const list = document.getElementById('listaPacientes');
  const search = document.getElementById('searchPaciente');
  const modal = document.getElementById('modalPaciente');
  let editIndex = null;

  // Load arrays
  let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  // Ensure stable ids for existing pacientes (if missing)
  function ensurePacienteIds() {
    let changed = false;
    for (let i = 0; i < pacientes.length; i++) {
      if (!pacientes[i].id) {
        pacientes[i].id = 'PAC_' + Date.now() + '_' + i;
        changed = true;
      }
    }
    if (changed) localStorage.setItem('pacientes', JSON.stringify(pacientes));
  }
  ensurePacienteIds();

  function savePacientes() {
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
  }
  function saveUsuarios() {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  // ===== Modal open/close (expõe globalmente para onclick no HTML) =====
  function abrirModalPaciente(i = null) {
    editIndex = i;
    document.getElementById('titlePaciente').textContent = editIndex === null ? 'Cadastrar Paciente' : 'Editar Paciente';
    if (editIndex === null) {
      document.getElementById('nomePac').value = '';
      document.getElementById('cpfPac').value = '';
      document.getElementById('telPac').value = '';
      document.getElementById('emailPac').value = '';
    } else {
      const p = pacientes[editIndex];
      document.getElementById('nomePac').value = p.nome || '';
      document.getElementById('cpfPac').value = p.cpf || '';
      document.getElementById('telPac').value = p.tel || '';
      document.getElementById('emailPac').value = p.email || '';
    }
    if (modal) modal.style.display = 'flex';
  }
  function fecharModalPaciente() { if (modal) modal.style.display = 'none'; }
  window.abrirModalPaciente = abrirModalPaciente;
  window.fecharModalPaciente = fecharModalPaciente;
  // ===================================================================

  // Render table
  function render(filter = '') {
    if (!list) return;
    list.innerHTML = '';
    pacientes.forEach(function (p, i) {
      if (filter && !((p.nome + ' ' + (p.cpf || '') + ' ' + (p.email || '')).toLowerCase().includes(filter.toLowerCase()))) return;
      const tr = document.createElement('tr');
      tr.innerHTML =
        `<td>${p.nome}</td>
         <td>${p.cpf || ''}</td>
         <td>${p.tel || ''}</td>
         <td>${p.email || ''}</td>
         <td>
           <button class="btn-small" data-edit="${i}">Editar</button>
           <button class="btn-small danger" data-del="${i}">Excluir</button>
         </td>`;
      list.appendChild(tr);
    });
  }

  // Handle clicks for edit / delete
  document.addEventListener('click', function (e) {
    if (e.target.matches('[data-edit]')) {
      const i = Number(e.target.dataset.edit);
      abrirModalPaciente(i);
    }

    if (e.target.matches('[data-del]')) {
      const i = Number(e.target.dataset.del);
      if (!confirm('Confirma exclusão deste paciente?')) return;
      const removed = pacientes.splice(i, 1)[0];
      savePacientes();

      // também remover usuário relacionado (perfil = paciente) - procurar por email ou pacienteId
      usuarios = usuarios.filter(u => {
        if (u.perfil !== 'paciente') return true;
        // se tiver patientId vinculado no usuario, remova; senão compare email
        if (removed.id && u.pacienteId && u.pacienteId === removed.id) return false;
        if (removed.email && u.email && u.email === removed.email) return false;
        return true;
      });
      saveUsuarios();

      render(search ? search.value : '');
    }
  });

  // Salvar paciente (novo ou edição) + sincronizar usuario
  const btnSalvar = document.getElementById('btnSalvarPaciente') || document.getElementById('btnSalvar'); // fallback name
  if (btnSalvar) {
    btnSalvar.addEventListener('click', function () {
      // read + normalize
      const rawNome = document.getElementById('nomePac').value || '';
      const rawCpf = document.getElementById('cpfPac').value || '';
      const rawTel = document.getElementById('telPac').value || '';
      const rawEmail = document.getElementById('emailPac').value || '';

      const novo = {
        nome: rawNome.trim(),
        cpf: rawCpf.trim(),
        tel: rawTel.trim(),
        email: rawEmail.trim().toLowerCase() // normalize email to lowercase
      };
      if (!novo.nome) { alert('Nome obrigatório'); return; }

      // Se for novo: criar id
      if (editIndex === null) {
        novo.id = 'PAC_' + Date.now();
        pacientes.push(novo);
      } else {
        // manter id atual
        novo.id = pacientes[editIndex].id || ('PAC_' + Date.now());
        pacientes[editIndex] = novo;
      }

      savePacientes();

      // --- SINCRONIZAR USUÁRIOS ---
      usuarios = JSON.parse(localStorage.getItem('usuarios')) || usuarios || [];

      // tentar encontrar usuário existente por pacienteId ou email
      let usuarioIndex = usuarios.findIndex(u => (u.pacienteId && u.pacienteId === novo.id) || (u.email && novo.email && u.email === novo.email));

      if (usuarioIndex === -1) {
        // criar novo usuário
        const newUser = {
          id: 'USR_' + Date.now() + '_' + Math.floor(Math.random()*1000),
          nome: novo.nome,
          email: novo.email,
          senha: (novo.cpf && novo.cpf.length > 0) ? String(novo.cpf).trim() : '1234', // garantir string sem espaços
          perfil: 'paciente',
          pacienteId: novo.id
        };
        usuarios.push(newUser);
        alert('Paciente cadastrado e usuário criado com sucesso! (senha padrão: CPF ou 1234)');
      } else {
        // atualizar usuário existente
        usuarios[usuarioIndex].nome = novo.nome;
        usuarios[usuarioIndex].email = novo.email;
        // se cpf preenchido -> atualiza senha se quiser; aqui mantemos senha existente a menos que queira sobrescrever
        if (novo.cpf) usuarios[usuarioIndex].senha = String(novo.cpf).trim();
        usuarios[usuarioIndex].pacienteId = novo.id;
      }

      // grava imediatamente
      saveUsuarios();
      fecharModalPaciente();
      render(search ? search.value : '');
    });
  }

  // Busca
  if (search) search.addEventListener('input', function (e) { render(e.target.value); });

  // inicializa
  render();
});
