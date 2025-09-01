// ========================
//  DANE STARTOWE + LS
// ========================
const EDIT_PASSWORD = 'haslo123';

const defaultProductionData = {
  MP4: [
    { kod: "37000057487MXX", cc: 50, dane1: 0, dane2: 0, dane3: 0, dane4: 0, dane5: 0, dane6: 0, dane7: 0, dane8: 0, dane9: 0, dane10: 0 },
    { kod: "KOD-A2", cc: 65, dane1: 0, dane2: 0, dane3: 0, dane4: 0, dane5: 0, dane6: 0, dane7: 0, dane8: 0, dane9: 0, dane10: 0 },
    { kod: "KOD-A3", cc: 45, dane1: 0, dane2: 0, dane3: 0, dane4: 0, dane5: 0, dane6: 0, dane7: 0, dane8: 0, dane9: 0, dane10: 0 }
  ],
  liniaB: [
    { kod: "KOD-B1", cc: 40, dane1: 0, dane2: 0, dane3: 0, dane4: 0, dane5: 0, dane6: 0, dane7: 0, dane8: 0, dane9: 0, dane10: 0 },
    { kod: "KOD-B2", cc: 70, dane1: 0, dane2: 0, dane3: 0, dane4: 0, dane5: 0, dane6: 0, dane7: 0, dane8: 0, dane9: 0, dane10: 0 },
    { kod: "KOD-B3", cc: 55, dane1: 0, dane2: 0, dane3: 0, dane4: 0, dane5: 0, dane6: 0, dane7: 0, dane8: 0, dane9: 0, dane10: 0 }
  ]
};

function getProductionData() {
  const stored = localStorage.getItem('productionData');
  return stored ? JSON.parse(stored) : structuredClone(defaultProductionData);
}
function saveProductionData(data) {
  localStorage.setItem('productionData', JSON.stringify(data));
}

let productionData = getProductionData();

// ========================
//  ELEMENTY DOM
// ========================
const datePicker = document.getElementById('date-picker');
const lineSelect = document.getElementById('line-select');
const reportTable = document.getElementById('report-table');
const tableBody = reportTable.querySelector('tbody');
const addRowButton = document.getElementById('add-row-button');

const menuButton = document.getElementById('menu-button');
const menuModal = document.getElementById('menu-modal');
const closeModalButton = document.querySelector('.close-button');
const editDataButton = document.getElementById('edit-data-button');

const editSection = document.getElementById('edit-section');
const editTableContainer = document.getElementById('edit-table-container');
const addEditRowBtn = document.getElementById('add-edit-row');
const saveDataButton = document.getElementById('save-data-button');
const backButton = document.getElementById('back-button');

// ========================
//  KONFIG
// ========================
const workHoursDefault = ["6-7", "7-8", "8-9", "9-10", "10-11", "11-12", "12-13", "13-14"];
const numRowsDefault = workHoursDefault.length;

// domyślna data = dziś
datePicker.value = new Date().toISOString().split('T')[0];

// ========================
//  TABELA GŁÓWNA
// ========================
function getCodeOptionsForSelectedLine() {
  const sel = lineSelect.value;
  const codes = productionData[sel] || [];
  let options = '<option value="">Wybierz kod</option>';
  for (const item of codes) {
    options += `<option value="${item.kod}">${item.kod}</option>`;
  }
  return options;
}

function createMainRow(hourLabel = '') {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td class="col-hour">${hourLabel}</td>
    <td class="col-oee"></td>
    <td class="col-kod">
      <div class="cell-2in1">
        <select class="kod-select-1">${getCodeOptionsForSelectedLine()}</select>
        <select class="kod-select-2">${getCodeOptionsForSelectedLine()}</select>
      </div>
    </td>
    <td class="col-ok">
      <div class="cell-2in1">
        <input type="number" class="ok-input-1" min="0" value="0">
        <input type="number" class="ok-input-2" min="0" value="0">
      </div>
    </td>
    <td class="col-nok">
      <div class="cell-2in1">
        <input type="number" class="nok-input-1" min="0" value="0">
        <input type="number" class="nok-input-2" min="0" value="0">
      </div>
    </td>
    <td class="col-cc"><input type="number" class="cc-input" value="0" disabled></td>
    <td class="col-time"><input type="number" class="time-input" min="0" value="0"></td>
    <td></td><td></td><td></td><td></td><td></td>
    <td></td><td></td><td></td><td></td><td></td>
  `;
  return tr;
}

function generateTableRows() {
  tableBody.innerHTML = '';
  for (let i = 0; i < numRowsDefault; i++) {
    const row = createMainRow(workHoursDefault[i]);
    tableBody.appendChild(row);
  }
}

function updateValues(row) {
  const kodSelect1 = row.querySelector('.kod-select-1');
  const okInput1 = row.querySelector('.ok-input-1');
  const okInput2 = row.querySelector('.ok-input-2');
  const nokInput1 = row.querySelector('.nok-input-1');
  const nokInput2 = row.querySelector('.nok-input-2');
  const ccInput = row.querySelector('.cc-input');
  const timeInput = row.querySelector('.time-input');
  const oeeCell = row.querySelector('td:nth-child(2)');

  const selectedLine = lineSelect.value;
  const selectedKod1 = kodSelect1.value;

  const foundCode1 = productionData[selectedLine]?.find(d => d.kod === selectedKod1);
  const cc1 = foundCode1 ? Number(foundCode1.cc) : 0;

  const totalCc = cc1;              // trzymamy się Twojej logiki (CC z 1. KOD)
  ccInput.value = totalCc;

  const totalOk  = (parseInt(okInput1.value)  || 0) + (parseInt(okInput2.value)  || 0);
  const totalNok = (parseInt(nokInput1.value) || 0) + (parseInt(nokInput2.value) || 0);
  const totalTime = parseInt(timeInput.value) || 0;

  let oee = 0;
  if (totalTime > 0 && totalCc > 0) {
    const planned = totalTime * totalCc;
    if (planned > 0) {
      oee = ((totalOk + totalNok) / planned) * 100;
    }
  }
  oeeCell.textContent = oee.toFixed(2) + '%';
}

// Zdarzenia w głównej tabeli — delegacja
tableBody.addEventListener('input', (event) => {
  const target = event.target;
  const row = target.closest('tr');
  if (!row) return;

  if (
    target.classList.contains('kod-select-1') ||
    target.classList.contains('kod-select-2') ||
    target.classList.contains('ok-input-1')  ||
    target.classList.contains('ok-input-2')  ||
    target.classList.contains('nok-input-1') ||
    target.classList.contains('nok-input-2') ||
    target.classList.contains('time-input')
  ) {
    updateValues(row);
  }
});

// Nawigacja po polach w wierszach
document.addEventListener('keydown', (event) => {
  const activeElement = document.activeElement;
  if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'SELECT')) {
    const row = activeElement.closest('tr');
    if (!row) return;

    const allInputs = Array.from(row.querySelectorAll('input, select'));
    const idx = allInputs.indexOf(activeElement);

    if (event.key === 'ArrowRight' && idx < allInputs.length - 1) {
      allInputs[idx + 1].focus(); event.preventDefault();
    } else if (event.key === 'ArrowLeft' && idx > 0) {
      allInputs[idx - 1].focus(); event.preventDefault();
    } else if (event.key === 'ArrowDown' || event.key === 'Enter') {
      const nextRow = row.nextElementSibling;
      if (nextRow) {
        const nextInputs = Array.from(nextRow.querySelectorAll('input, select'));
        if (nextInputs[idx]) { nextInputs[idx].focus(); event.preventDefault(); }
      }
    } else if (event.key === 'ArrowUp') {
      const prevRow = row.previousElementSibling;
      if (prevRow) {
        const prevInputs = Array.from(prevRow.querySelectorAll('input, select'));
        if (prevInputs[idx]) { prevInputs[idx].focus(); event.preventDefault(); }
      }
    }
  }
});

// Reaguj na zmianę linii — przebuduj wiersze (żeby selekty KOD miały właściwe opcje)
lineSelect.addEventListener('change', () => {
  generateTableRows();
});

// Dodawanie NOWEGO wiersza do głównej tabeli
addRowButton.addEventListener('click', () => {
  const newRow = createMainRow(''); // dodatkowy wiersz bez etykiety godzin
  tableBody.appendChild(newRow);
});

// Start
generateTableRows();

// ========================
//  MODAL
// ========================
menuButton.addEventListener('click', () => {
  menuModal.classList.add('active'); // pokaż
});
closeModalButton.addEventListener('click', () => {
  menuModal.classList.remove('active'); // ukryj
});
window.addEventListener('click', (e) => {
  if (e.target === menuModal) menuModal.classList.remove('active');
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') menuModal.classList.remove('active');
});

// ========================
//  EDYCJA DANYCH (KODY/LINIE)
//  — teraz edytujesz WSZYSTKO, włącznie z nazwą LINII
//  — możesz dodawać i usuwać wiersze
// ========================
function generateEditTable() {
  editTableContainer.innerHTML = '';

  const table = document.createElement('table');
  let header = `<thead><tr>
    <th>LINIA</th>
    <th>KOD</th>
    <th>CC</th>
    <th>DANE1</th><th>DANE2</th><th>DANE3</th><th>DANE4</th><th>DANE5</th>
    <th>DANE6</th><th>DANE7</th><th>DANE8</th><th>DANE9</th><th>DANE10</th>
    <th>Akcje</th>
  </tr></thead>`;

  table.innerHTML = header + '<tbody></tbody>';
  const tbody = table.querySelector('tbody');

  // zbuduj wiersze na podstawie productionData
  for (const lineName of Object.keys(productionData)) {
    for (const item of productionData[lineName]) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input type="text" class="ed-line" value="${lineName}"></td>
        <td><input type="text" class="ed-kod" value="${item.kod}"></td>
        <td><input type="number" class="ed-cc" value="${item.cc}" min="0"></td>
        ${Array.from({length: 10}, (_,i)=>`<td><input type="number" class="ed-d${i+1}" value="${item['dane'+(i+1)]||0}" min="0"></td>`).join('')}
        <td><button class="edit-del">Usuń</button></td>
      `;
      tbody.appendChild(tr);
    }
  }

  // obsługa usuwania pojedynczych wierszy
  tbody.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-del')) {
      const tr = e.target.closest('tr');
      tr.remove();
    }
  });

  editTableContainer.appendChild(table);
}

function addEmptyEditRow() {
  const table = editTableContainer.querySelector('table');
  const tbody = table.querySelector('tbody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" class="ed-line" value=""></td>
    <td><input type="text" class="ed-kod" value=""></td>
    <td><input type="number" class="ed-cc" value="0" min="0"></td>
    ${Array.from({length: 10}, (_,i)=>`<td><input type="number" class="ed-d${i+1}" value="0" min="0"></td>`).join('')}
    <td><button class="edit-del">Usuń</button></td>
  `;
  tbody.appendChild(tr);
}

function saveEditedData() {
  // zbierz z tabeli edycji wszystkie wiersze → przebuduj obiekt productionData
  const rows = editTableContainer.querySelectorAll('tbody tr');
  const newData = {};

  rows.forEach(row => {
    const line = row.querySelector('.ed-line').value.trim() || 'UNASSIGNED';
    const kod  = row.querySelector('.ed-kod').value.trim();
    const cc   = parseInt(row.querySelector('.ed-cc').value) || 0;

    const out = { kod, cc };
    for (let i = 1; i <= 10; i++) {
      const val = parseInt(row.querySelector(`.ed-d${i}`).value) || 0;
      out['dane' + i] = val;
    }

    if (!newData[line]) newData[line] = [];
    newData[line].push(out);
  });

  productionData = newData;
  saveProductionData(productionData);
  alert('Dane zapisane pomyślnie!');

  // po zapisie — odśwież selekty KOD w głównej tabeli według aktualnie wybranej linii
  generateTableRows();
}

// Otwórz edycję (po haśle)
editDataButton.addEventListener('click', () => {
  menuModal.classList.remove('active');
  const pwd = prompt('Wprowadź hasło do edycji danych:');
  if (pwd !== EDIT_PASSWORD) {
    alert('Błędne hasło!');
    return;
  }
  // pokazujemy sekcję edycji
  editSection.classList.remove('hidden');
  // chowamy główną tabelę (opcjonalnie)
  reportTable.parentElement.classList.add('hidden');
  generateEditTable();
});

// Dodaj pusty wiersz w edycji
addEditRowBtn.addEventListener('click', addEmptyEditRow);

// Zapisz edycje
saveDataButton.addEventListener('click', saveEditedData);

// Wróć do raportu
backButton.addEventListener('click', () => {
  editSection.classList.add('hidden');
  reportTable.parentElement.classList.remove('hidden');
  generateTableRows();
});
