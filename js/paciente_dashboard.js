// paciente_dashboard.js
document.addEventListener('DOMContentLoaded', function(){
  const session = requireAuth(['paciente']);
  if (!session) return;

  const userId = session.pacienteId;
  const profissionais = JSON.parse(localStorage.getItem('profissionais')) || [];

  function formatRow(c, i) {
    const prof = profissionais.find(p=>p.email===c.profissionalEmail || p.id===c.profissionalId) || {};
    return `<tr>
      <td>${c.data}</td>
      <td>${c.hora}</td>
      <td>${prof.nome||c.profissional||'—'}</td>
      <td>${c.status||'agendada'}</td>
      <td>
        ${c.status==='agendada' ? `<button class="btn-small danger" data-cancel="${i}">Cancelar</button>` : ''}
      </td>
    </tr>`;
  }

  function render(){
    const consultasAll = JSON.parse(localStorage.getItem('consultas')) || [];
    const fut = consultasAll.filter(c => c.pacienteId===userId && c.status==='agendada');
    const past = consultasAll.filter(c => c.pacienteId===userId && c.status!=='agendada');

    document.getElementById('consultasFuturas').innerHTML = fut.map((c,i)=>formatRow(c,i)).join('') || '<tr><td colspan=5>Nenhuma</td></tr>';
    document.getElementById('consultasPassadas').innerHTML = past.map((c,i)=>formatRow(c,i)).join('') || '<tr><td colspan=5>Nenhuma</td></tr>';
  }

  document.addEventListener('click', function(e){
    if (e.target.matches('[data-cancel]')){
      const i = Number(e.target.dataset.cancel);
      const consultasAll = JSON.parse(localStorage.getItem('consultas')) || [];
      const c = consultasAll[i];
      if (!c) return;
      if (!confirm('Cancelar essa consulta?')) return;
      consultasAll[i].status = 'cancelada';
      localStorage.setItem('consultas', JSON.stringify(consultasAll));
      render();
    }
  });

  render();
});
