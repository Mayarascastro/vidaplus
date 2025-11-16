// =============================================================
// ADMIN - GERENCIAMENTO DE PROFISSIONAIS
// =============================================================
document.addEventListener("DOMContentLoaded", function () {
  // Protege a página: somente ADMIN
  const session = requireAuth(["admin"]);
  if (!session) return;

  carregarProfissionais();

  document.getElementById("btnSalvar").addEventListener("click", salvarProfissional);
  document.getElementById("searchProfissional").addEventListener("input", filtrarProfissionais);
});

// =============================================================
// LISTAR PROFISSIONAIS
// =============================================================
function carregarProfissionais() {
  const lista = JSON.parse(localStorage.getItem("profissionais")) || [];
  const tabela = document.getElementById("listaProfissionais");

  tabela.innerHTML = "";

  lista.forEach((prof) => {
    tabela.innerHTML += `
      <tr>
        <td>${prof.nome}</td>
        <td>${prof.especialidade}</td>
        <td>${prof.registro}</td>
        <td>${prof.telefone}</td>
        <td>${prof.email}</td>
        <td>
          <button class="btn-small" onclick="editarProfissional('${prof.id}')">Editar</button>
          <button class="btn-small btn-danger" onclick="removerProfissional('${prof.id}')">Excluir</button>
        </td>
      </tr>
    `;
  });
}

// =============================================================
// ABRIR / FECHAR MODAL
// =============================================================
let editandoId = null;

function openModal() {
  editandoId = null;
  document.getElementById("modalTitle").innerText = "Cadastrar Profissional";

  document.getElementById("nomeCadastro").value = "";
  document.getElementById("especialidadeCadastro").value = "";
  document.getElementById("registroCadastro").value = "";
  document.getElementById("telefoneCadastro").value = "";
  document.getElementById("emailCadastro").value = "";
  document.getElementById("senhaCadastro").value = "";

  document.getElementById("modalCadastro").style.display = "block";
}

function fecharModal() {
  document.getElementById("modalCadastro").style.display = "none";
}

// =============================================================
// SALVAR PROFISSIONAL
// =============================================================
function salvarProfissional() {
  const nome = document.getElementById("nomeCadastro").value.trim();
  const especialidade = document.getElementById("especialidadeCadastro").value.trim();
  const registro = document.getElementById("registroCadastro").value.trim();
  const telefone = document.getElementById("telefoneCadastro").value.trim();
  const email = document.getElementById("emailCadastro").value.trim();
  const senha = document.getElementById("senhaCadastro").value.trim() || "1234";

  if (!nome || !especialidade || !registro || !telefone || !email) {
    alert("Preencha todos os campos!");
    return;
  }

  const profissionais = JSON.parse(localStorage.getItem("profissionais")) || [];
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // EDITAR
  if (editandoId) {
    const prof = profissionais.find(p => p.id === editandoId);

    prof.nome = nome;
    prof.especialidade = especialidade;
    prof.registro = registro;
    prof.telefone = telefone;
    prof.email = email;

    // Atualiza também o usuário vinculado
    const user = usuarios.find(u => u.profissionalId === editandoId);
    if (user) {
      user.nome = nome;
      user.email = email;
    }

    localStorage.setItem("profissionais", JSON.stringify(profissionais));
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Profissional atualizado com sucesso!");
    fecharModal();
    carregarProfissionais();
    return;
  }

  // CADASTRAR NOVO PROFISSIONAL
  const id = "PROF_" + Date.now();

  const novo = {
    id,
    nome,
    especialidade,
    registro,
    telefone,
    email
  };

  profissionais.push(novo);
  localStorage.setItem("profissionais", JSON.stringify(profissionais));

  // Criar usuário automaticamente
  const novoUser = {
    id: "USR_" + Date.now(),
    nome,
    email,
    senha,
    perfil: "profissional",
    profissionalId: id
  };

  usuarios.push(novoUser);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  alert("Profissional cadastrado com sucesso!");
  fecharModal();
  carregarProfissionais();
}

// =============================================================
// EDITAR
// =============================================================
function editarProfissional(id) {
  const profissionais = JSON.parse(localStorage.getItem("profissionais")) || [];
  const prof = profissionais.find(p => p.id === id);

  editandoId = id;

  document.getElementById("modalTitle").innerText = "Editar Profissional";

  document.getElementById("nomeCadastro").value = prof.nome;
  document.getElementById("especialidadeCadastro").value = prof.especialidade;
  document.getElementById("registroCadastro").value = prof.registro;
  document.getElementById("telefoneCadastro").value = prof.telefone;
  document.getElementById("emailCadastro").value = prof.email;

  document.getElementById("modalCadastro").style.display = "block";
}

// =============================================================
// REMOVER
// =============================================================
function removerProfissional(id) {
  if (!confirm("Tem certeza que deseja excluir este profissional?")) return;

  let profissionais = JSON.parse(localStorage.getItem("profissionais")) || [];
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  profissionais = profissionais.filter(p => p.id !== id);
  usuarios = usuarios.filter(u => u.profissionalId !== id);

  localStorage.setItem("profissionais", JSON.stringify(profissionais));
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  carregarProfissionais();
}

// =============================================================
// BUSCAR / FILTRAR
// =============================================================
function filtrarProfissionais() {
  const termo = this.value.toLowerCase();
  const profissionais = JSON.parse(localStorage.getItem("profissionais")) || [];
  const tabela = document.getElementById("listaProfissionais");

  const filtrados = profissionais.filter(p =>
    p.nome.toLowerCase().includes(termo) ||
    p.especialidade.toLowerCase().includes(termo)
  );

  tabela.innerHTML = "";
  filtrados.forEach((prof) => {
    tabela.innerHTML += `
      <tr>
        <td>${prof.nome}</td>
        <td>${prof.especialidade}</td>
        <td>${prof.registro}</td>
        <td>${prof.telefone}</td>
        <td>${prof.email}</td>
        <td>
          <button class="btn-small" onclick="editarProfissional('${prof.id}')">Editar</button>
          <button class="btn-small btn-danger" onclick="removerProfissional('${prof.id}')">Excluir</button>
        </td>
      </tr>
    `;
  });
}
