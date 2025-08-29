// Domyślne dane, jeśli w localStorage nic nie ma
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

// Stałe hasło do edycji danych
const EDIT_PASSWORD = 'z';

// Funkcja do pobierania danych z localStorage lub domyślnych
function getProductionData() {
    const storedData = localStorage.getItem('productionData');
    if (storedData) {
        return JSON.parse(storedData);
    }
    return defaultProductionData;
}

// Funkcja do zapisywania danych w localStorage
function saveProductionData(data) {
    localStorage.setItem('productionData', JSON.stringify(data));
}

let productionData = getProductionData();

document.addEventListener('DOMContentLoaded', () => {
    const datePicker = document.getElementById('date-picker');
    const lineSelect = document.getElementById('line-select');
    const tableBody = document.querySelector('#report-table tbody');
    const numRows = 8;
    
    // Nowe elementy interfejsu
    const menuButton = document.getElementById('menu-button');
    const menuModal = document.getElementById('menu-modal');
    const closeModalButton = document.querySelector('.close-button');
    const editDataButton = document.getElementById('edit-data-button');
    const editSection = document.getElementById('edit-section');
    const reportTable = document.getElementById('report-table');
    const saveDataButton = document.getElementById('save-data-button');
    const backButton = document.getElementById('back-button');
    const editTableContainer = document.getElementById('edit-table-container');

    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;

    const workHours = ["6-7", "7-8", "8-9", "9-10", "10-11", "11-12", "12-13", "13-14"];

    // Funkcja do generowania wierszy tabeli głównej
    function generateTableRows() {
        tableBody.innerHTML = '';
        const selectedLine = lineSelect.value;
        const codes = productionData[selectedLine] || [];

        const getCodeOptions = () => {
            let options = '<option value="">Wybierz kod</option>';
            codes.forEach(data => {
                options += `<option value="${data.kod}">${data.kod}</option>`;
            });
            return options;
        };

        for (let i = 0; i < numRows; i++) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${workHours[i] || ''}</td>
                <td></td>
                <td>
                    <div>
                        <select class="kod-select-1">${getCodeOptions()}</select>
                        <select class="kod-select-2">${getCodeOptions()}</select>
                    </div>
                </td>
                <td>
                    <div>
                        <input type="number" class="ok-input-1" min="0" value="0">
                        <input type="number" class="ok-input-2" min="0" value="0">
                    </div>
                </td>
                <td>
                    <div>
                        <input type="number" class="nok-input-1" min="0" value="0">
                        <input type="number" class="nok-input-2" min="0" value="0">
                    </div>
                </td>
                <td><input type="number" class="cc-input" disabled value="0"></td>
                <td><input type="number" class="time-input" min="0" value="0"></td>
                <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
            `;
            tableBody.appendChild(row);
        }
    }

    // Funkcja do aktualizowania wartości CC i obliczania OEE
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

        const foundCode1 = productionData[selectedLine]?.find(data => data.kod === selectedKod1);
        const cc1 = foundCode1 ? foundCode1.cc : 0;
        
        const totalCc = cc1;
        ccInput.value = totalCc;

        const totalOk = (parseInt(okInput1.value) || 0) + (parseInt(okInput2.value) || 0);
        const totalNok = (parseInt(nokInput1.value) || 0) + (parseInt(nokInput2.value) || 0);
        const totalTime = parseInt(timeInput.value) || 0;

        let oee = 0;
        if (totalTime > 0 && totalCc > 0) {
            const plannedProduction = totalTime * totalCc;
            if (plannedProduction > 0) {
                oee = ((totalOk + totalNok) / plannedProduction) * 100;
            }
        }
        oeeCell.textContent = oee.toFixed(2) + '%';
    }

    // Funkcja do generowania wierszy tabeli do edycji
    function generateEditTable() {
        editTableContainer.innerHTML = '';
        const table = document.createElement('table');
        let headerRow = '<tr><th>Linia</th><th>KOD</th><th>CC</th>';
        for (let i = 1; i <= 10; i++) {
            headerRow += `<th>DANE${i}</th>`;
        }
        headerRow += '</tr>';
        
        table.innerHTML = `<thead>${headerRow}</thead><tbody></tbody>`;
        const tbody = table.querySelector('tbody');

        for (const line in productionData) {
            productionData[line].forEach(data => {
                const row = document.createElement('tr');
                let rowContent = `<td>${line}</td><td><input type="text" value="${data.kod}"></td><td><input type="number" value="${data.cc}"></td>`;
                for (let i = 1; i <= 10; i++) {
                    rowContent += `<td><input type="number" value="${data['dane' + i]}"></td>`;
                }
                row.innerHTML = rowContent;
                tbody.appendChild(row);
            });
        }
        editTableContainer.appendChild(table);
    }

    // Funkcja do zapisywania danych z tabeli edycji
    function saveData() {
        const rows = editTableContainer.querySelectorAll('tbody tr');
        const newProductionData = {};
        
        rows.forEach(row => {
            const line = row.querySelector('td:first-child').textContent;
            const kod = row.querySelector('td:nth-child(2) input').value;
            const cc = parseInt(row.querySelector('td:nth-child(3) input').value) || 0;
            
            const params = { kod, cc };
            for (let i = 1; i <= 10; i++) {
                params['dane' + i] = parseInt(row.querySelector(`td:nth-child(${i + 3}) input`).value) || 0;
            }
            
            if (!newProductionData[line]) {
                newProductionData[line] = [];
            }
            newProductionData[line].push(params);
        });

        productionData = newProductionData;
        saveProductionData(productionData);
        alert('Dane zapisane pomyślnie!');
    }

    // Obsługa przycisku "MENU" - pokazuje modal
    menuButton.addEventListener('click', () => {
        menuModal.classList.remove('hidden');
    });

    // Obsługa zamknięcia modala
    closeModalButton.addEventListener('click', () => {
        menuModal.classList.add('hidden');
    });

    // Obsługa kliknięcia poza modalem, aby go zamknąć
    window.addEventListener('click', (event) => {
        if (event.target === menuModal) {
            menuModal.classList.add('hidden');
        }
    });

    // Obsługa kliknięcia przycisku "Edytuj dane"
    editDataButton.addEventListener('click', () => {
        menuModal.classList.add('hidden');
        const password = prompt('Wprowadź hasło do edycji danych:');
        if (password === EDIT_PASSWORD) {
            reportTable.classList.add('hidden');
            editSection.classList.remove('hidden');
            generateEditTable();
        } else {
            alert('Błędne hasło!');
        }
    });

    // Obsługa przycisku "Zapisz dane"
    saveDataButton.addEventListener('click', () => {
        saveData();
    });

    // Obsługa przycisku "Wróć"
    backButton.addEventListener('click', () => {
        editSection.classList.add('hidden');
        reportTable.classList.remove('hidden');
        generateTableRows();
    });

    // Nasłuchiwanie zmian na selectach i inputach w głównej tabeli
    lineSelect.addEventListener('change', () => {
        generateTableRows();
    });

    tableBody.addEventListener('input', (event) => {
        const target = event.target;
        const row = target.closest('tr');
        
        if (target.classList.contains('kod-select-1') ||
            target.classList.contains('kod-select-2') ||
            target.classList.contains('ok-input-1') ||
            target.classList.contains('ok-input-2') ||
            target.classList.contains('nok-input-1') ||
            target.classList.contains('nok-input-2') ||
            target.classList.contains('time-input')) {
            updateValues(row);
        }
    });

    // Nasłuchiwanie klawiszy strzałek dla nawigacji
    document.addEventListener('keydown', (event) => {
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'SELECT')) {
            const row = activeElement.closest('tr');
            if (!row) return;

            const allInputs = Array.from(row.querySelectorAll('input, select'));
            const currentIndex = allInputs.indexOf(activeElement);

            if (event.key === 'ArrowRight' && currentIndex < allInputs.length - 1) {
                allInputs[currentIndex + 1].focus();
                event.preventDefault();
            } else if (event.key === 'ArrowLeft' && currentIndex > 0) {
                allInputs[currentIndex - 1].focus();
                event.preventDefault();
            } else if (event.key === 'ArrowDown' || event.key === 'Enter') {
                const nextRow = row.nextElementSibling;
                if (nextRow) {
                    const nextRowInputs = Array.from(nextRow.querySelectorAll('input, select'));
                    if (nextRowInputs[currentIndex]) {
                        nextRowInputs[currentIndex].focus();
                        event.preventDefault();
                    }
                }
            } else if (event.key === 'ArrowUp') {
                const prevRow = row.previousElementSibling;
                if (prevRow) {
                    const prevRowInputs = Array.from(prevRow.querySelectorAll('input, select'));
                    if (prevRowInputs[currentIndex]) {
                        prevRowInputs[currentIndex].focus();
                        event.preventDefault();
                    }
                }
            }
        }
    });

    // Początkowe generowanie wierszy
    generateTableRows();
});

