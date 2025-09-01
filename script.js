document.addEventListener('DOMContentLoaded', () => {

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
    const shiftSelect = document.getElementById('shift-select');
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
    //  KONFIGURACJA ZMIANOWA
    // ========================
    const shiftsConfig = {
        'I': ['6-7', '7-8', '8-9', '9-10', '10-11', '11-12', '12-13', '13-14'],
        'II': ['14-15', '15-16', '16-17', '17-18', '18-19', '19-20', '20-21', '21-22'],
        'III': ['22-23', '23-24', '0-1', '1-2', '2-3', '3-4', '4-5', '5-6']
    };

    // ========================
    //  FUNKCJE POMOCNICZE
    // ========================

    // Ustawienie aktualnej daty z "nowym dniem" od 6:00
    function setDate() {
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDate();
        
        if (hour < 6) {
            now.setDate(day - 1);
        }
        datePicker.value = now.toISOString().split('T')[0];
    }
    
    // Generowanie opcji KOD dla wybranej linii
    function getCodeOptionsForSelectedLine() {
        const selectedLine = lineSelect.value;
        const codes = productionData[selectedLine] || [];
        let options = '<option value="">Wybierz kod</option>';
        codes.forEach(item => {
            options += `<option value="${item.kod}">${item.kod}</option>`;
        });
        return options;
    }

    // ========================
    //  TABELA GŁÓWNA
    // ========================

    // Tworzenie nowego wiersza tabeli głównej
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
            <td><input type="number" class="dane-input" min="0" value="0"></td>
            <td><input type="number" class="dane-input" min="0" value="0"></td>
            <td><input type="number" class="dane-input" min="0" value="0"></td>
            <td><input type="number" class="dane-input" min="0" value="0"></td>
            <td><input type="number" class="dane-input" min="0" value="0"></td>
            <td><input type="number" class="dane-input" min="0" value="0"></td>
            <td><input type="number" class="dane-input" min="0" value="0"></td>
            <td><input type="number" class="dane-input" min="0" value="0"></td>
            <td><input type="number" class="dane-input" min="0" value="0"></td>
            <td><input type="number" class="dane-input" min="0" value="0"></td>
        `;
        return tr;
    }

    // Generowanie wierszy tabeli na podstawie wybranej zmiany
    function generateTableRows() {
        tableBody.innerHTML = '';
        const selectedShift = shiftSelect.value;
        const workHours = shiftsConfig[selectedShift] || [];
        
        workHours.forEach(hour => {
            const row = createMainRow(hour);
            tableBody.appendChild(row);
        });
    }

    // Aktualizacja wartości (CC, OEE) w wierszu
    function updateValues(row) {
        const kodSelect1 = row.querySelector('.kod-select-1');
        const okInput1 = row.querySelector('.ok-input-1');
        const okInput2 = row.querySelector('.ok-input-2');
        const nokInput1 = row.querySelector('.nok-input-1');
        const nokInput2 = row.querySelector('.nok-input-2');
        const ccInput = row.querySelector('.cc-input');
        const timeInput = row.querySelector('.time-input');
        const oeeCell = row.querySelector('.col-oee');

        const selectedLine = lineSelect.value;
        const selectedKod1 = kodSelect1.value;

        const foundCode1 = productionData[selectedLine]?.find(d => d.kod === selectedKod1);
        const cc1 = foundCode1 ? Number(foundCode1.cc) : 0;
        
        ccInput.value = cc1;

        const totalOk = (parseInt(okInput1.value) || 0) + (parseInt(okInput2.value) || 0);
        const totalNok = (parseInt(nokInput1.value) || 0) + (parseInt(nokInput2.value) || 0);
        const totalTime = parseInt(timeInput.value) || 0;
        
        let oee = 0;
        if (totalTime > 0 && cc1 > 0) {
            const planned = totalTime * cc1;
            if (planned > 0) {
                oee = ((totalOk + totalNok) / planned) * 100;
            }
        }
        oeeCell.textContent = oee.toFixed(2) + '%';
    }

    // Reakcja na zmianę KOD
    tableBody.addEventListener('change', (event) => {
        const target = event.target;
        if (target.classList.contains('kod-select-1')) {
            const row = target.closest('tr');
            updateValues(row);
        }
    });

    // Reakcja na zmianę innych inputów (dane liczbowe)
    tableBody.addEventListener('input', (event) => {
        const target = event.target;
        if (target.classList.contains('ok-input-1') || target.classList.contains('ok-input-2') ||
            target.classList.contains('nok-input-1') || target.classList.contains('nok-input-2') ||
            target.classList.contains('time-input')) {
            const row = target.closest('tr');
            updateValues(row);
        }
    });

    // Reakcja na zmianę linii lub zmiany - przebudowa tabeli
    lineSelect.addEventListener('change', generateTableRows);
    shiftSelect.addEventListener('change', generateTableRows);

    // Dodawanie NOWEGO wiersza do głównej tabeli
    addRowButton.addEventListener('click', () => {
        const newRow = createMainRow(''); // dodatkowy wiersz bez etykiety godzin
        tableBody.appendChild(newRow);
    });

    // ========================
    //  MODAL + MENU
    // ========================

    menuButton.addEventListener('click', () => {
        menuModal.classList.add('active');
    });
    closeModalButton.addEventListener('click', () => {
        menuModal.classList.remove('active');
    });
    window.addEventListener('click', (e) => {
        if (e.target === menuModal) menuModal.classList.remove('active');
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') menuModal.classList.remove('active');
    });

    // ========================
    //  EDYCJA DANYCH
    // ========================

    // Generowanie tabeli edycji z danymi z productionData
    function generateEditTable() {
        editTableContainer.innerHTML = '';
        const table = document.createElement('table');
        const header = `<thead><tr>
            <th>LINIA</th>
            <th>KOD</th>
            <th>CC</th>
            <th>DANE1</th><th>DANE2</th><th>DANE3</th><th>DANE4</th><th>DANE5</th>
            <th>DANE6</th><th>DANE7</th><th>DANE8</th><th>DANE9</th><th>DANE10</th>
            <th>Akcje</th>
        </tr></thead>`;
        table.innerHTML = header + '<tbody></tbody>';
        const tbody = table.querySelector('tbody');

        for (const lineName of Object.keys(productionData)) {
            productionData[lineName].forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><input type="text" class="ed-line" value="${lineName}"></td>
                    <td><input type="text" class="ed-kod" value="${item.kod}"></td>
                    <td><input type="number" class="ed-cc" value="${item.cc}" min="0"></td>
                    ${Array.from({ length: 10 }, (_, i) => `<td><input type="number" class="ed-d${i + 1}" value="${item['dane' + (i + 1)] || 0}" min="0"></td>`).join('')}
                    <td><button class="edit-del">Usuń</button></td>
                `;
                tbody.appendChild(tr);
            });
        }
        tbody.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-del')) {
                e.target.closest('tr').remove();
            }
        });
        editTableContainer.appendChild(table);
    }

    // Dodawanie pustego wiersza w tabeli edycji
    function addEmptyEditRow() {
        const table = editTableContainer.querySelector('table');
        const tbody = table.querySelector('tbody');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" class="ed-line" value=""></td>
            <td><input type="text" class="ed-kod" value=""></td>
            <td><input type="number" class="ed-cc" value="0" min="0"></td>
            ${Array.from({ length: 10 }, (_, i) => `<td><input type="number" class="ed-d${i + 1}" value="0" min="0"></td>`).join('')}
            <td><button class="edit-del">Usuń</button></td>
        `;
        tbody.appendChild(tr);
    }

    // Zapisywanie danych z tabeli edycji
    function saveEditedData() {
        const rows = editTableContainer.querySelectorAll('tbody tr');
        const newData = {};

        rows.forEach(row => {
            const line = row.querySelector('.ed-line').value.trim();
            const kod = row.querySelector('.ed-kod').value.trim();

            if (!line || !kod) {
                return; // Pomiń puste wiersze
            }

            const cc = parseInt(row.querySelector('.ed-cc').value) || 0;
            const item = { kod, cc };
            for (let i = 1; i <= 10; i++) {
                item['dane' + i] = parseInt(row.querySelector(`.ed-d${i}`).value) || 0;
            }

            if (!newData[line]) newData[line] = [];
            newData[line].push(item);
        });

        productionData = newData;
        saveProductionData(productionData);
        alert('Dane zapisane pomyślnie!');

        // Odświeżenie selectów linii po zapisie
        updateLineSelectOptions();
        
        // Powrót do widoku głównego
        editSection.classList.add('hidden');
        reportTable.parentElement.classList.remove('hidden');
        generateTableRows();
    }
    
    // Aktualizacja opcji w select linii
    function updateLineSelectOptions() {
        const selectedLine = lineSelect.value;
        lineSelect.innerHTML = '<option value="">Wybierz linię</option>';
        Object.keys(productionData).forEach(line => {
            const option = document.createElement('option');
            option.value = line;
            option.textContent = line;
            lineSelect.appendChild(option);
        });
        lineSelect.value = selectedLine;
    }

    // Otwórz edycję po haśle
    editDataButton.addEventListener('click', () => {
        menuModal.classList.remove('active');
        const pwd = prompt('Wprowadź hasło do edycji danych:');
        if (pwd !== EDIT_PASSWORD) {
            alert('Błędne hasło!');
            return;
        }
        editSection.classList.remove('hidden');
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
    
    // ========================
    //  INICJALIZACJA
    // ========================
    setDate();
    updateLineSelectOptions();
    generateTableRows();
});
