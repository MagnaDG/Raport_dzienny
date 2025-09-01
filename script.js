document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-input');
    const shiftSelect = document.getElementById('shift-select');
    const lineSelect = document.getElementById('line-select');
    const menuBtn = document.getElementById('menu-button'); // Poprawiony ID
    const addRowBtn = document.getElementById('add-row-button'); // Nowy przycisk
    const menuModal = document.getElementById('menu-modal');
    const editModal = document.getElementById('edit-modal');
    const productionTableBody = document.getElementById('production-table-body');
    const mainTableHeader = document.getElementById('main-table-header');
    const addEditRowBtn = document.getElementById('add-edit-row');
    const saveDataBtn = document.getElementById('save-data-button');
    const editTableBody = document.querySelector('#edit-table tbody');

    // Inicjalizacja danych z localStorage
    let storedData = JSON.parse(localStorage.getItem('productionData')) || {
        lines: ['MP4', 'liniaB'],
        codes: {
            'MP4': [
                { kod: "37000057487MXX", cc: 50 },
                { kod: "KOD-A2", cc: 65 },
                { kod: "KOD-A3", cc: 45 }
            ],
            'liniaB': [
                { kod: "KOD-B1", cc: 40 },
                { kod: "KOD-B2", cc: 70 },
                { kod: "KOD-B3", cc: 55 }
            ]
        }
    };

    // Ustawienie aktualnej daty z "nowym dniem" od 6:00
    function setDate() {
        const now = new Date();
        const hour = now.getHours();
        const displayDate = new Date(now.getTime());

        if (hour < 6) {
            displayDate.setDate(displayDate.getDate() - 1);
        }

        const formattedDate = `${String(displayDate.getDate()).padStart(2, '0')}.${String(displayDate.getMonth() + 1).padStart(2, '0')}.${displayDate.getFullYear()}`;
        dateInput.value = formattedDate;
    }

    // Generowanie nagłówków 1-10
    function generateTableHeaders() {
        mainTableHeader.innerHTML = '';
        const headers = ['Godz.', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        headers.forEach(text => {
            const headerCell = document.createElement('div');
            headerCell.classList.add('table-header-cell');
            headerCell.textContent = text;
            mainTableHeader.appendChild(headerCell);
        });
    }

    // Generowanie wiersza z danymi
    function createTableRow(hourLabel = '') {
        const row = document.createElement('div');
        row.classList.add('table-data-row');

        const hourCell = document.createElement('div');
        hourCell.classList.add('table-cell', 'hour-cell');
        hourCell.textContent = hourLabel;

        const plusYellow = document.createElement('button');
        plusYellow.classList.add('plus-button', 'plus-yellow');
        plusYellow.textContent = '+';
        hourCell.appendChild(plusYellow);

        const plusBlue = document.createElement('button');
        plusBlue.classList.add('plus-button', 'plus-blue');
        plusBlue.textContent = '+';
        hourCell.appendChild(plusBlue);

        row.appendChild(hourCell);

        for (let i = 0; i < 9; i++) {
            const dataCell = document.createElement('div');
            dataCell.classList.add('table-cell');
            
            if (i === 2) { // Kolumna 3 na kod
                const select = document.createElement('select');
                const line = lineSelect.value;
                if (storedData.codes[line]) {
                    storedData.codes[line].forEach(codeData => {
                        const option = document.createElement('option');
                        option.value = codeData.kod;
                        option.textContent = codeData.kod;
                        select.appendChild(option);
                    });
                }
                select.addEventListener('change', () => {
                    updateCC(row, line, select.value);
                });
                dataCell.appendChild(select);
            } else if (i === 5) { // Kolumna 6 na CC
                const input = document.createElement('input');
                input.type = 'text';
                input.readOnly = true;
                dataCell.appendChild(input);
            } else {
                const input = document.createElement('input');
                input.type = 'text';
                dataCell.appendChild(input);
            }
            row.appendChild(dataCell);
        }
        return row;
    }

    // Generowanie początkowych wierszy tabeli
    function generateInitialRows() {
        productionTableBody.innerHTML = '';
        const shift = shiftSelect.value;
        let startHour;
        let endHour;

        if (shift === 'I') {
            startHour = 6;
            endHour = 7;
        } else if (shift === 'II') {
            startHour = 14;
            endHour = 15;
        } else {
            startHour = 22;
            endHour = 23;
        }

        const initialRow = createTableRow(`${startHour}-${endHour}`);
        productionTableBody.appendChild(initialRow);

        // Dodanie listenerów do plusików dla pierwszego wiersza
        const plusYellow = initialRow.querySelector('.plus-yellow');
        const plusBlue = initialRow.querySelector('.plus-blue');

        plusYellow.addEventListener('click', () => {
            insertNewRow(initialRow, 'P', startHour, endHour);
        });

        plusBlue.addEventListener('click', () => {
            insertNewRow(initialRow, '', startHour + 1, endHour + 1);
        });
    }

    // Wstawianie nowego wiersza z godzinami
    function insertNewRow(currentRow, prefix, startHour, endHour) {
        const newRow = createTableRow(`${prefix} ${startHour}-${endHour}`);
        currentRow.parentNode.insertBefore(newRow, currentRow.nextSibling);
    }
    
    // Dodawanie nowego, pustego wiersza na koniec tabeli
    function addNewRow() {
        const newRow = createTableRow('');
        productionTableBody.appendChild(newRow);
    }

    // Aktualizacja wartości CC
    function updateCC(row, line, code) {
        const ccInput = row.querySelectorAll('.table-cell')[5].querySelector('input');
        const lineCodes = storedData.codes[line] || [];
        const foundCode = lineCodes.find(item => item.kod === code);
        
        if (foundCode) {
            ccInput.value = foundCode.cc;
        } else {
            ccInput.value = '';
        }
    }

    // Otwieranie modala menu
    menuBtn.addEventListener('click', () => {
        menuModal.style.display = 'flex';
        renderMenuOptions();
    });

    // Zamykanie modali
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });

    window.onclick = (event) => {
        if (event.target == menuModal) {
            menuModal.style.display = 'none';
        }
        if (event.target == editModal) {
            editModal.style.display = 'none';
        }
    };

    // Renderowanie opcji menu
    function renderMenuOptions() {
        const menuOptionsDiv = menuModal.querySelector('.menu-options');
        menuOptionsDiv.innerHTML = '';
        const options = ['Funkcja 1', 'Funkcja 2', 'Funkcja 3', 'Funkcja 4', 'EDYTUJ DANE'];
        options.forEach(option => {
            const btn = document.createElement('button');
            btn.textContent = option;
            btn.addEventListener('click', () => {
                if (option === 'EDYTUJ DANE') {
                    const password = prompt('Podaj hasło:');
                    if (password === 'z') {
                        menuModal.style.display = 'none';
                        editModal.style.display = 'flex';
                        renderEditTable();
                    } else {
                        alert('Błędne hasło!');
                    }
                } else {
                    alert(`Wybrano: ${option}`);
                }
            });
            menuOptionsDiv.appendChild(btn);
        });
    }

    // Renderowanie tabeli edycji
    function renderEditTable() {
        editTableBody.innerHTML = '';
        Object.keys(storedData.codes).forEach(line => {
            storedData.codes[line].forEach(codeData => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${line}</td>
                    <td>${codeData.kod}</td>
                    <td><input type="text" value="${codeData.cc}" data-field="cc"></td>
                    <td><input type="text" value="${codeData.osob || ''}" data-field="osob"></td>
                    <td><input type="text" value="${codeData.A || ''}" data-field="A"></td>
                    <td><input type="text" value="${codeData.B || ''}" data-field="B"></td>
                    <td><input type="text" value="${codeData.C || ''}" data-field="C"></td>
                    <td><input type="text" value="${codeData.D || ''}" data-field="D"></td>
                    <td><input type="text" value="${codeData.E || ''}" data-field="E"></td>
                    <td><input type="text" value="${codeData.F || ''}" data-field="F"></td>
                    <td><input type="text" value="${codeData.G || ''}" data-field="G"></td>
                    <td><input type="text" value="${codeData.H || ''}" data-field="H"></td>
                `;
                editTableBody.appendChild(row);
            });
        });
    }

    // Dodawanie nowego wiersza w tabeli edycji
    addEditRowBtn.addEventListener('click', () => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" placeholder="Linia" data-field="line"></td>
            <td><input type="text" placeholder="Kod" data-field="kod"></td>
            <td><input type="text" placeholder="CC" data-field="cc"></td>
            <td><input type="text" placeholder="Osób" data-field="osob"></td>
            <td><input type="text" placeholder="A" data-field="A"></td>
            <td><input type="text" placeholder="B" data-field="B"></td>
            <td><input type="text" placeholder="C" data-field="C"></td>
            <td><input type="text" placeholder="D" data-field="D"></td>
            <td><input type="text" placeholder="E" data-field="E"></td>
            <td><input type="text" placeholder="F" data-field="F"></td>
            <td><input type="text" placeholder="G" data-field="G"></td>
            <td><input type="text" placeholder="H" data-field="H"></td>
        `;
        editTableBody.appendChild(row);
    });

    // Zapisywanie danych z tabeli edycji do localStorage
    saveDataBtn.addEventListener('click', () => {
        const newLines = new Set();
        const newCodes = {};
        const rows = editTableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const lineInput = row.querySelector('[data-field="line"]');
            const kodInput = row.querySelector('[data-field="kod"]');
            const line = lineInput ? lineInput.value : row.cells[0].textContent;
            const kod = kodInput ? kodInput.value : row.cells[1].textContent;

            if (line && kod) {
                newLines.add(line);
                if (!newCodes[line]) {
                    newCodes[line] = [];
                }
                const codeData = { kod: kod };
                row.querySelectorAll('[data-field]').forEach(input => {
                    codeData[input.dataset.field] = input.value;
                });
                newCodes[line].push(codeData);
            }
        });

        storedData.lines = Array.from(newLines);
        storedData.codes = newCodes;

        localStorage.setItem('productionData', JSON.stringify(storedData));
        alert('Dane zostały zapisane!');
        editModal.style.display = 'none';
        renderLineOptions();
        generateInitialRows();
    });

    // Generowanie opcji linii produkcyjnych
    function renderLineOptions() {
        lineSelect.innerHTML = '';
        storedData.lines.forEach(line => {
            const option = document.createElement('option');
            option.value = line;
            option.textContent = line;
            lineSelect.appendChild(option);
        });
    }

    // Obsługa zmiany zmiany
    shiftSelect.addEventListener('change', () => {
        generateInitialRows();
    });

    // Obsługa zmiany linii
    lineSelect.addEventListener('change', () => {
        generateInitialRows();
    });

    // Obsługa przycisku "Dodaj wiersz"
    addRowBtn.addEventListener('click', addNewRow);

    // Inicjalizacja przy ładowaniu strony
    setDate();
    generateTableHeaders();
    renderLineOptions();
    generateInitialRows();
});
