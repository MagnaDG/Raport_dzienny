/* script.js — spójna wersja: dodawanie wierszy, edycja linii/kodów, liczenie CC i OEE.
   Hasło do edycji: haslo123
*/

const EDIT_PASSWORD = 'haslo123';

// Domyślne dane
const defaultProductionData = {
  MP4: [
    { kod: "37000057487MXX", cc: 50, dane1:0, dane2:0, dane3:0, dane4:0, dane5:0, dane6:0, dane7:0, dane8:0, dane9:0, dane10:0 },
    { kod: "KOD-A2", cc: 65, dane1:0, dane2:0, dane3:0, dane4:0, dane5:0, dane6:0, dane7:0, dane8:0, dane9:0, dane10:0 }
  ],
  liniaB: [
    { kod: "KOD-B1", cc: 40, dane1:0, dane2:0, dane3:0, dane4:0, dane5:0, dane6:0, dane7:0, dane8:0, dane9:0, dane10:0 },
    { kod: "KOD-B2", cc: 70, dane1:0, dane2:0, dane3:0, dane4:0, dane5:0, dane6:0, dane7:0, dane8:0, dane9:0, dane10:0 }
  ]
};

function loadProductionData(){
  const s = localStorage.getItem('productionData');
  return s ? JSON.parse(s) : structuredClone(defaultProductionData);
}
function saveProductionData(obj){
  localStorage.setItem('productionData', JSON.stringify(obj));
}

let productionData = loadProductionData();

// DOM refs
document.addEventListener('DOMContentLoaded', () => {
  const datePicker = document.getElementById('date-picker');
  const globalLineSelect = document.getElementById('global-line-select');

  const menuButton = document.getElementById('menu-button');
  const menuModal = document.getElementById('menu-modal');
  const closeModalBtn = document.querySelector('.close-button');
  const editDataButton = document.getElementById('edit-data-button');

  const reportTable = document.getElementById('report-table');
  const reportBody = reportTable.querySelector('tbody');
  const addRowMain = document.getElementById('add-row-main');

  const editSection = document.getElementById('edit-section');
  const editTableContainer = document.getElementById('edit-table-container');
  const addRowEdit = document.getElementById('add-row-edit');
  const saveDataBtn = document.getElementById('save-data-button');
  const backBtn = document.getElementById('back-button');

  // ustaw datę na dziś
  datePicker.value = new Date().toISOString().split('T')[0];

  // pomocnicze: options lini i kodów
  function getLineOptionsHTML(selected=''){
    let html = `<option value="">--</option>`;
    for(const line of Object.keys(productionData)){
      html += `<option value="${escapeHtml(line)}"${line===selected ? ' selected':''}>${escapeHtml(line)}</option>`;
    }
    return html;
  }
  function getCodeOptionsHTML(line, selected=''){
    let html = `<option value="">--</option>`;
    const list = productionData[line] || [];
    for(const it of list){
      html += `<option value="${escapeHtml(it.kod)}"${it.kod===selected ? ' selected':''}>${escapeHtml(it.kod)}</option>`;
    }
    return html;
  }

  // tworzy wiersz główny tabeli
  function createMainRow(hourLabel=''){
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input class="hour-input" type="text" value="${escapeHtml(hourLabel)}" /></td>
      <td class="oee-cell">0.00%</td>
      <td>
        <div class="cell-2in1">
          <select class="kod-select kod-select-1"></select>
          <select class="kod-select kod-select-2"></select>
        </div>
      </td>
      <td>
        <div class="cell-2in1">
          <input class="ok-input ok-input-1" type="number" min="0" value="0" />
          <input class="ok-input ok-input-2" type="number" min="0" value="0" />
        </div>
      </td>
      <td>
        <div class="cell-2in1">
          <input class="nok-input nok-input-1" type="number" min="0" value="0" />
          <input class="nok-input nok-input-2" type="number" min="0" value="0" />
        </div>
      </td>
      <td><input class="cc-input" type="number" value="0" disabled /></td>
      <td><input class="time-input" type="number" min="0" value="0" /></td>
      <td><select class="linia-select"></select></td>
      ${Array.from({length:10}).map((_,i)=>`<td><input class="dane-input dane-${i+1}" type="number" value="0" /></td>`).join('')}
      <td><button class="btn delete-row">Usuń</button></td>
    `;
    // wstaw opcje linii i kodów (kodów puste dopóki nie wybierzesz linii)
    const liniaSelect = tr.querySelector('.linia-select');
    liniaSelect.innerHTML = getLineOptionsHTML();
    // kod selecty puste
    const kod1 = tr.querySelector('.kod-select-1');
    const kod2 = tr.querySelector('.kod-select-2');
    kod1.innerHTML = `<option value="">--</option>`;
    kod2.innerHTML = `<option value="">--</option>`;

    return tr;
  }

  // wygeneruj kilka domyślnych godzin
  const defaultHours = ["6-7","7-8","8-9","9-10","10-11","11-12","12-13","13-14"];
  function generateInitialRows(){
    reportBody.innerHTML = '';
    for(const h of defaultHours){
      reportBody.appendChild(createMainRow(h));
    }
  }

  // update CC i OEE dla wiersza
  function updateValuesForRow(tr){
    const linia = tr.querySelector('.linia-select').value;
    const kod1 = tr.querySelector('.kod-select-1').value;
    const kod2 = tr.querySelector('.kod-select-2').value;

    const ok1 = parseInt(tr.querySelector('.ok-input-1').value) || 0;
    const ok2 = parseInt(tr.querySelector('.ok-input-2').value) || 0;
    const nok1 = parseInt(tr.querySelector('.nok-input-1').value) || 0;
    const nok2 = parseInt(tr.querySelector('.nok-input-2').value) || 0;
    const time = parseInt(tr.querySelector('.time-input').value) || 0;

    let ccTotal = 0;
    if(linia){
      const codes = productionData[linia] || [];
      const found1 = codes.find(x => x.kod === kod1);
      const found2 = codes.find(x => x.kod === kod2);
      const cc1 = found1 ? Number(found1.cc) : 0;
      const cc2 = found2 ? Number(found2.cc) : 0;
      ccTotal = cc1 + cc2;
    }
    const ccInput = tr.querySelector('.cc-input');
    ccInput.value = ccTotal;

    let oeeText = '0.00%';
    if(ccTotal > 0 && time > 0){
      const planned = ccTotal * time;
      const produced = ok1 + ok2 + nok1 + nok2;
      const oee = planned > 0 ? (produced / planned) * 100 : 0;
      oeeText = oee.toFixed(2) + '%';
    }
    tr.querySelector('.oee-cell').textContent = oeeText;
  }

  // aktualizuj selecty KOD w danym wierszu po zmianie linii
  function refreshCodeOptionsForRow(tr){
    const linia = tr.querySelector('.linia-select').value;
    const kod1 = tr.querySelector('.kod-select-1');
    const kod2 = tr.querySelector('.kod-select-2');
    kod1.innerHTML = getCodeOptionsHTML(linia);
    kod2.innerHTML = getCodeOptionsHTML(linia);
    // po zmianie linia -> zresetuj CC/OEE
    updateValuesForRow(tr);
  }

  // Delegacja zdarzeń w tabeli głównej
  reportBody.addEventListener('change', (e) => {
    const target = e.target;
    const tr = target.closest('tr');
    if(!tr) return;

    if(target.classList.contains('linia-select')){
      // zmieniła się linia — odśwież dostępne kody
      refreshCodeOptionsForRow(tr);
    } else if(target.classList.contains('kod-select') || target.classList.contains('time-input')){
      updateValuesForRow(tr);
    }
  });
  reportBody.addEventListener('input', (e) => {
    const target = e.target;
    const tr = target.closest('tr');
    if(!tr) return;
    if(target.classList.contains('ok-input-1') || target.classList.contains('ok-input-2') ||
       target.classList.contains('nok-input-1') || target.classList.contains('nok-input-2') ||
       target.classList.contains('time-input')){
      updateValuesForRow(tr);
    }
  });

  // usuwanie wiersza (delegacja)
  reportBody.addEventListener('click', (e) => {
    if(e.target.classList.contains('delete-row')){
      const tr = e.target.closest('tr');
      tr.remove();
    }
  });

  // Add row main
  addRowMain.addEventListener('click', () => {
    reportBody.appendChild(createMainRow(''));
  });

  // --------- MODAL ----------
  menuButton.addEventListener('click', () => menuModal.classList.add('active'));
  closeModalBtn.addEventListener('click', () => menuModal.classList.remove('active'));
  window.addEventListener('click', (e) => { if(e.target === menuModal) menuModal.classList.remove('active'); });
  window.addEventListener('keydown', (e) => { if(e.key==='Escape') menuModal.classList.remove('active'); });

  // ------- EDIT SECTION (kody/linie) -------
  function generateEditTable(){
    editTableContainer.innerHTML = '';
    const table = document.createElement('table');
    table.id = 'edit-table';

    const headerCols = ['LINIA','KOD','CC','DANE1','DANE2','DANE3','DANE4','DANE5','DANE6','DANE7','DANE8','DANE9','DANE10','AKCJE'];
    table.innerHTML = `<thead><tr>${headerCols.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody></tbody>`;
    const tbody = table.querySelector('tbody');

    for(const lineName of Object.keys(productionData)){
      for(const codeObj of productionData[lineName]){
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><input class="ed-line" value="${escapeHtml(lineName)}"></td>
          <td><input class="ed-kod" value="${escapeHtml(codeObj.kod)}"></td>
          <td><input class="ed-cc" type="number" min="0" value="${codeObj.cc}"></td>
          ${Array.from({length:10}).map((_,i)=>`<td><input class="ed-d${i+1}" type="number" min="0" value="${codeObj['dane'+(i+1)]||0}"></td>`).join('')}
          <td><button class="btn edit-del">Usuń</button></td>
        `;
        tbody.appendChild(tr);
      }
    }

    // obsługa usuwania (delegacja)
    tbody.addEventListener('click', (ev) => {
      if(ev.target.classList.contains('edit-del')){
        ev.target.closest('tr').remove();
      }
    });

    editTableContainer.appendChild(table);
  }

  addRowEdit.addEventListener('click', () => {
    // jeśli jeszcze nie wygenerowane — stwórz
    if(!editTableContainer.querySelector('table')){
      generateEditTable();
    }
    const tbody = editTableContainer.querySelector('tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input class="ed-line" value=""></td>
      <td><input class="ed-kod" value=""></td>
      <td><input class="ed-cc" type="number" min="0" value="0"></td>
      ${Array.from({length:10}).map((_,i)=>`<td><input class="ed-d${i+1}" type="number" min="0" value="0"></td>`).join('')}
      <td><button class="btn edit-del">Usuń</button></td>
    `;
    tbody.appendChild(tr);
  });

  function saveEditedData(){
    const rows = editTableContainer.querySelectorAll('tbody tr');
    const newData = {};
    rows.forEach(row => {
      const line = row.querySelector('.ed-line').value.trim() || 'UNASSIGNED';
      const kod = row.querySelector('.ed-kod').value.trim() || '';
      const cc = parseInt(row.querySelector('.ed-cc').value) || 0;
      if(!kod) return; // pomiń puste kody
      const entry = { kod, cc };
      for(let i=1;i<=10;i++){
        const v = parseInt(row.querySelector(`.ed-d${i}`).value) || 0;
        entry['dane'+i] = v;
      }
      if(!newData[line]) newData[line]=[];
      newData[line].push(entry);
    });
    productionData = newData;
    saveProductionData(productionData);
    // odśwież global select i wszystkie linia-selecty w tabeli
    fillGlobalLineSelect();
    refreshAllRowLineOptions();
    // przelicz CC/OEE w każdej istniejącej linii
    document.querySelectorAll('#report-table tbody tr').forEach(tr => updateValuesForRow(tr));
    alert('Zapisano dane.');
  }

  // helper — uzupełnij globalny select (w header)
  function fillGlobalLineSelect(){
    globalLineSelect.innerHTML = getLineOptionsHTML();
  }
  function refreshAllRowLineOptions(){
    document.querySelectorAll('.linia-select').forEach(sel => {
      const current = sel.value;
      sel.innerHTML = getLineOptionsHTML(current);
    });
  }

  // Save button in edit section
  saveDataBtn.addEventListener('click', saveEditedData);

  // Open edit-section after password
  editDataButton.addEventListener('click', () => {
    menuModal.classList.remove('active');
    const pwd = prompt('Hasło do edycji:');
    if(pwd !== EDIT_PASSWORD){ alert('Błędne hasło'); return;}
    editSection.classList.remove('hidden');
    document.querySelector('.report-wrap').classList.add('hidden');
    generateEditTable();
  });

  backBtn.addEventListener('click', () => {
    editSection.classList.add('hidden');
    document.querySelector('.report-wrap').classList.remove('hidden');
  });

  // Escape hatch: jeśli productionData pusty — ustaw default
  if(Object.keys(productionData).length === 0){
    productionData = structuredClone(defaultProductionData);
    saveProductionData(productionData);
  }

  // Inicjalizacja: wypełnij select global i stwórz początkowe wiersze
  fillGlobalLineSelect();
  generateInitialRows();
});

// proste escape HTML do safety (value injection)
function escapeHtml(str){
  if(!str) return '';
  return String(str).replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[m]);
}
