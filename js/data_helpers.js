// data_helpers.js - ensure entities have stable ids
(function(){
  function ensureId(listName, prefix){
    const arr = JSON.parse(localStorage.getItem(listName)) || [];
    let changed = false;
    for(let i=0;i<arr.length;i++){
      if (!arr[i].id){
        arr[i].id = prefix + '_' + Date.now() + '_' + i;
        changed = true;
      }
    }
    if (changed) localStorage.setItem(listName, JSON.stringify(arr));
    return arr;
  }
  ensureId('pacientes','PAC');
  ensureId('profissionais','PROF');
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  let uChanged=false;
  for(let i=0;i<usuarios.length;i++){ if(!usuarios[i].id){ usuarios[i].id='USR_'+Date.now()+'_'+i; uChanged=true; } }
  if(uChanged) localStorage.setItem('usuarios', JSON.stringify(usuarios));
})();
