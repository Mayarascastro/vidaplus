// profissional_dashboard.js
document.addEventListener('DOMContentLoaded', function(){
  const session = requireAuth(['profissional']);
  if (!session) return;

  // prefer use profissionalId from session; fallback to email
  const profissionalId = session.profissionalId || null;
  const profissionalEmail = session.email || null;

  const consultasAll = () => JSON.parse(localStorage.getItem('consultas')) || [];

  function render(dayFilter='') {
    const all = consultasAll();
    // map with original index so clicks map to real consultation
    const mapped = all.map((c, idx) => ({ c, idx }));
    const lista = mapped.filter(item => (item.c.profissionalEmail === profissionalEmail || item.c.profissionalId === profissionalId));
    let filtered = lista;
    if (dayFilter) filtered = filtered.filter(item => item.c.data === dayFilter);
    const tbody = document.getElementById('agendaLista');
    if (!tbody) return;

    tbody.innerHTML = filtered.map(item=>{
      const c = item.c;
      const realIdx = item.idx;
      return `<tr>
        <td>${c.data}</td>
        <td>${c.hora}</td>
        <td>${c.pacienteName || buscarNome("pacientes", c.pacienteId) || '—'}</td>
        <td>${c.status||'agendada'}</td>
        <td>
          ${c.status==='agendada'? `<button class="btn-small" data-atender="${realIdx}">Atender</button>` : ''}
        </td>
      </tr>`;
    }).join('') || '<tr><td colspan=5>Nenhuma consulta</td></tr>';
  }

  document.getElementById('btnRefresh').addEventListener('click', ()=>{
    const day = document.getElementById('filterDay').value;
    render(day);
  });

  document.addEventListener('click', function(e){
    if (e.target.matches('[data-atender]')) {
      const i = Number(e.target.dataset.atender);
      const consultas = consultasAll();
      const c = consultas[i];
      if (!c) return;
      localStorage.setItem('selected_consulta_index', i);
      window.location.href = 'prontuario.html';
    }
  });

  render(new Date().toISOString().split('T')[0]);
});

// helper used above
function buscarNome(chave, id) {
  const lista = JSON.parse(localStorage.getItem(chave)) || [];
  const item = lista.find(x => x.id == id);
  return item ? item.nome : null;
}
