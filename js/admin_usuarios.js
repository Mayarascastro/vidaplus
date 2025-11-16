// users.js - listar e remover usuários (admin)
document.addEventListener('DOMContentLoaded', function(){
  const session = JSON.parse(localStorage.getItem("user_session"));
  if (!session || session.perfil !== 'admin') { window.location.href = "login.html"; return; }

  const list = document.getElementById('listaUsuarios');
  function render() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    list.innerHTML = '';
    usuarios.forEach(function(u,i){
      const tr = document.createElement('tr');
      tr.innerHTML = '<td>'+(u.nome||'')+'</td><td>'+u.email+'</td><td>'+u.perfil+'</td><td><button class="btn-small" data-del="'+i+'">Excluir</button></td>';
      list.appendChild(tr);
    });
  }

  document.addEventListener('click', function(e){
    if (e.target.matches('[data-del]')) {
      if (!confirm('Excluir usuário?')) return;
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      const u = usuarios.splice(Number(e.target.dataset.del),1)[0];
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      if (u.perfil === 'profissional') {
        let profs = JSON.parse(localStorage.getItem('profissionais')) || [];
        profs = profs.filter(p => p.email !== u.email);
        localStorage.setItem('profissionais', JSON.stringify(profs));
      }
      render();
    }
  });

  render();
});
