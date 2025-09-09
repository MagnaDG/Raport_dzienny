document.addEventListener('DOMContentLoaded', () => {

    // Ustawienie dzisiejszej daty
    document.getElementById('report-date').valueAsDate = new Date();

    // --- LOGIKA ZARZĄDZANIA DANYMI ---
    const STORAGE_KEY = 'productData';
    let productData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
        { line: 'LINE_A', code: 'KOD1', cycleTime: 30, people: 4, side: 'LH' },
        { line: 'LINE_A', code: 'KOD2', cycleTime: 45, people: 3, side: 'RH' },
        { line: 'LINE_B', code: 'KOD3', cycleTime: 25, people: 5, side: 'LH' }
    ];

    function saveProductData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(productData));
    }

    // --- FUNKCJE DYNAMICZNEGO INTERFEJSU ---
    function updateLineSelect() {
        const lineSelect = document.getElementById('line-select');
        lineSelect.innerHTML = '<option value="">Wybierz...</option>';
        const lines = [...new Set(productData.map(item => item.line))].sort();
        lines.forEach(line => {
            const option = document.createElement('option');
            option.value = line;
            option.textContent = line.replace('LINE_', 'Linia ');
            lineSelect.appendChild(option);
        });
    }

    function updateCodeSelects() {
        const line = document.getElementById('line-select').value;
        const codeSelectsLH = document.querySelectorAll('.code-select-lh');
        const codeSelectsRH = document.querySelectorAll('.code-select-rh');

        const codesLH = productData.filter(p => p.line === line && p.side === 'LH').map(p => p.code).sort();
        const codesRH = productData.filter(p => p.line === line && p.side === 'RH').map(p => p.code).sort();

        codeSelectsLH.forEach(select => {
            const currentVal = select.value;
            select.innerHTML = '<option value="">Wybierz kod...</option>';
            codesLH.forEach(code => {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = code;
                select.appendChild(option);
            });
            select.value = currentVal;
        });

        codeSelectsRH.forEach(select => {
            const currentVal = select.value;
            select.innerHTML = '<option value="">Wybierz kod...</option>';
            codesRH.forEach(code => {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = code;
                select.appendChild(option);
            });
            select.value = currentVal;
        });
    }

    // --- LOGIKA MODALU DANYCH ---
    function renderDataModalTable() {
        const dataTableBody = document.getElementById('data-table-body');
        dataTableBody.innerHTML = '';
        
        productData.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <select class="cell-input data-line" data-index="${index}">
                        <option value="LINE_A" ${item.line === 'LINE_A' ? 'selected' : ''}>Linia A</option>
                        <option value="LINE_B" ${item.line === 'LINE_B' ? 'selected' : ''}>Linia B</option>
                        <option value="LINE_C" ${item.line === 'LINE_C' ? 'selected' : ''}>Linia C</option>
                    </select>
                </td>
                <td><input type="text" class="cell-input data-code" value="${item.code}" data-index="${index}"></td>
                <td><input type="number" step="0.1" class="cell-input data-cycle" value="${item.cycleTime}" data-index="${index}"></td>
                <td><input type="number" class="cell-input data-people" value="${item.people}" data-index="${index}"></td>
                <td>
                    <select class="cell-input data-side" data-index="${index}">
                        <option value="LH" ${item.side === 'LH' ? 'selected' : ''}>LH</option>
                        <option value="RH" ${item.side === 'RH' ? 'selected' : ''}>RH</option>
                    </select>
                </td>
                <td><button class="text-red-500 font-bold delete-data-row" data-index="${index}">Usuń</button></td>
            `;
            dataTableBody.appendChild(row);
        });
    }

    // Obsługa dodawania wiersza w modalu danych
    document.getElementById('add-data-row-btn').addEventListener('click', function() {
        productData.push({ line: 'LINE_A', code: '', cycleTime: 0, people: 0, side: 'LH' });
        renderDataModalTable();
    });

    // Obsługa usuwania wiersza w modalu danych (użycie delegacji zdarzeń)
    document.getElementById('data-table-body').addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-data-row')) {
            const index = e.target.dataset.index;
            productData.splice(index, 1);
            renderDataModalTable();
        }
    });

    // Obsługa zapisu danych z modalu
    document.getElementById('save-data-btn').addEventListener('click', function() {
        const updatedData = [];
        document.querySelectorAll('#data-table-body tr').forEach(row => {
            const line = row.querySelector('.data-line').value;
            const code = row.querySelector('.data-code').value;
            const cycleTime = parseFloat(row.querySelector('.data-cycle').value);
            const people = parseInt(row.querySelector('.data-people').value, 10);
            const side = row.querySelector('.data-side').value;
            
            updatedData.push({ line, code, cycleTime, people, side });
        });
        
        productData = updatedData;
        saveProductData();
        document.getElementById('data-modal').classList.remove('open');
        updateLineSelect();
        updateCodeSelects();
    });

    // --- FUNKCJE OBSŁUGI GŁÓWNEJ TABELI RAPORTU ---
    window.addNextHourRow = function(startHour, isChangeover) {
        const tableBody = document.getElementById('table-body');
        const row = document.createElement('tr');
        row.classList.add('hour-row');
        
        const hourText = isChangeover ? `P ${startHour}-${startHour+1}` : `${startHour}-${startHour+1}`;
        
        const codeSelectOptions = () => {
            const line = document.getElementById('line-select').value;
            const codesLH = productData.filter(p => p.line === line && p.side === 'LH').map(p => p.code).sort();
            const codesRH = productData.filter(p => p.line === line && p.side === 'RH').map(p => p.code).sort();
            return `
                <select class="cell-input code-select-lh">
                    <option value="">Wybierz kod...</option>
                    ${codesLH.map(code => `<option value="${code}">${code}</option>`).join('')}
                </select>
                <select class="cell-input code-select-rh">
                    <option value="">Wybierz kod...</option>
                    ${codesRH.map(code => `<option value="${code}">${code}</option>`).join('')}
                </select>
            `;
        };

        row.innerHTML = `
            <td class="relative">
                <div class="font-semibold">${hourText}</div>
                <div class="absolute bottom-1 right-1 flex">
                    <span class="add-btn blue-plus" title="Dodaj następną godzinę" onclick="addNextHourRow(${startHour+1}, false)">+</span>
                    <span class="add-btn green-plus" title="Dodaj przezbrojenie" onclick="addNextHourRow(${startHour}, true)">+</span>
                    <span class="add-btn red-minus" title="Usuń wiersz" onclick="this.closest('tr').remove()">-</span>
                </div>
            </td>
            <td class="oee-cell font-bold">0.00%</td>
            <td class="nominal-people-cell"><div class="split-cell"><span>-</span><span>-</span></div></td>
            <td class="nominal-cycle-cell"><div class="split-cell"><span>-</span><span>-</span></div></td>
            <td><input type="number" class="cell-input real-people" value="0"></td>
            <td class="real-cycle-cell">0.00</td>
            <td><div class="split-cell">${codeSelectOptions()}</div></td>
            <td class="plan-qty-cell"><div class="split-cell"><span>0</span><span>0</span></div></td>
            <td class="max-qty-cell"><div class="split-cell"><span>0</span><span>0</span></div></td>
            <td><div class="split-cell"><input type="number" class="cell-input ok-qty-lh" value="0"><input type="number" class="cell-input ok-qty-rh" value="0"></div></td>
            <td><div class="split-cell"><input type="number" class="cell-input nok-qty-lh" value="0"><input type="number" class="cell-input nok-qty-rh" value="0"></div></td>
            <td><input type="number" class="cell-input available-time" value="60"></td>
            <td class="downtime-cell">0</td>
            <td class="inefficiency-cell">0</td>
            <td class="reconciliation-cell">60</td>
            <td colspan="5" class="p-0">
                <table class="w-full losses-table">
                    ${Array(5).fill(0).map(() => `
                    <tr class="loss-row">
                        <td>
                            <select class="cell-input loss-reason">
                                <option value="">--</option>
                                <option value="BRAK_WYDAJNOSCI">Brak wydajności</option>
                                <option value="POSTOJ_TECHNICZNY">Postój techniczny</option>
                                <option value="BRAK_MATERIALU">Brak materiału</option>
                                <option value="INNE">Inne</option>
                            </select>
                        </td>
                        <td><input type="text" class="cell-input loss-operation"></td>
                        <td><input type="number" step="0.5" class="cell-input loss-time" value="0"></td>
                        <td><input type="number" class="cell-input loss-events" value="1"></td>
                        <td><input type="text" class="cell-input loss-desc"></td>
                    </tr>`).join('')}
                </table>
            </td>
        `;
        tableBody.appendChild(row);
    }
    
    // --- OBSŁUGA MODALI I PRZYCISKÓW ---
    const menuModal = document.getElementById('menu-modal');
    const dataModal = document.getElementById('data-modal');

    document.getElementById('menu-btn').addEventListener('click', () => menuModal.classList.add('open'));
    document.getElementById('close-menu-modal').addEventListener('click', () => menuModal.classList.remove('open'));
    document.getElementById('data-modify-btn').addEventListener('click', () => {
        const password = prompt("Podaj hasło, aby kontynuować:");
        if (password === "z") {
            menuModal.classList.remove('open');
            dataModal.classList.add('open');
            renderDataModalTable();
        } else if (password !== null) {
            alert("Nieprawidłowe hasło!");
        }
    });
    document.getElementById('close-data-modal').addEventListener('click', () => dataModal.classList.remove('open'));
    document.getElementById('save-report-btn').addEventListener('click', () => {
        alert('Raport został zapisany!');
        menuModal.classList.remove('open');
    });

    // --- NASŁUCHIWANIE NA ZMIANY W GŁÓWNYM INTERFEJSIE ---
    document.getElementById('line-select').addEventListener('change', updateCodeSelects);

    // Inicjalizacja: Wczytaj dane i wygeneruj pierwszy wiersz
    updateLineSelect();
    addNextHourRow(6, false);
});
