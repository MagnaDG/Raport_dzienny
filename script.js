document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-input');
    const shiftSelect = document.getElementById('shift-select');
    const lineSelect = document.getElementById('line-select');
    const menuBtn = document.getElementById('menu-btn');
    const menuModal = document.getElementById('menu-modal');
    const editModal = document.getElementById('edit-modal');
    const productionTableBody = document.getElementById('production-table-body');
    const mainTableHeader = document.getElementById('main-table-header');
    const addRowBtn = document.getElementById('add-row-btn');
    const saveDataBtn = document.getElementById('save-data-btn');
    const editTableBody = document.querySelector('#edit-table tbody');

    // Inicjalizacja danych z localStorage
    let storedData = JSON.parse(localStorage.getItem('productionData')) || {
        lines: [],
        codes: {}
    };

    // Ustawienie aktualnej daty z "nowym dniem" od 6:00
    function setDate() {
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        if (hour < 6) {
            now.setDate(day - 1);
        }

        const displayDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
        dateInput.value = displayDate;
    }

    // Generowanie nagłówków 1-10
    function generateTableHeaders() {
        for (let i = 1; i <= 10; i++) {
            const headerCell = document.createElement('div');
            headerCell.classList.add('table-header-cell');
            headerCell.textContent = i;
            mainTableHeader.appendChild(headerCell);
        }
    }

    // Generowanie wiersza z godzinami na podstawie wybranej zmiany
    function generateInitialRow() {
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

        createTableRow(startHour, endHour, 'default');
    }

    // Tworzenie wiersza tabeli
    function createTableRow(startHour, endHour, type) {
        const row = document.createElement('div');
        row.classList.add('table-data-row');

        const hourCell = document.createElement('div');
        hourCell.classList.add('table-cell', 'hour-cell');
        hourCell.textContent = `${type === 'p' ? 'P ' : ''}${startHour}-${endHour}`;

        const plusYellow = document.createElement('button');
        plusYellow.classList.add('plus-button', 'plus-yellow');
        plusYellow.textContent = '+';
        plusYellow.addEventListener('click', () => {
            insertNewRow(row, 'p', startHour, endHour);
        });

        const plusBlue = document.createElement('button');
        plusBlue.classList.add('plus-button', 'plus-blue');
        plusBlue.textContent = '+';
        plusBlue.addEventListener('click', () => {
            insertNewRow(row, 'regular', startHour + 1, endHour + 1);
        });

        if (type !== 'p') {
            hourCell.appendChild(plusYellow);
            hourCell.appendChild(plusBlue);
        }

        row.appendChild(hourCell);

        for (let i = 0; i < 9; i++) {
            const dataCell = document.createElement('div');
            dataCell.classList.add('table-cell');
            const input = document.createElement('input');
            input.type = 'text';

            if (i === 2) { // Kolumna 3 (indeks 2) na kod
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
            } else {
                dataCell.appendChild(input);
            }
            row.appendChild(dataCell);
        }

        productionTableBody.appendChild(row);
    }

    function insertNewRow(currentRow, type, startHour, endHour) {
        const newRow = document.createElement('div');
        newRow.classList.add('table-data-row');

        const hourCell = document.createElement('div');
        hourCell.classList.add('table-cell', 'hour-cell');
        hourCell.textContent = `${type === 'p' ? 'P ' : ''}${startHour}-${endHour}`;

        const plusYellow = document.createElement('button');
        plusYellow.classList.add('plus-button', 'plus-yellow');
        plusYellow.textContent = '+';
        plusYellow.addEventListener('click', () => {
            insertNewRow(newRow, 'p', startHour, endHour);
        });

        const plusBlue = document.createElement('button');
        plusBlue.classList.add('plus-button', 'plus-blue');
        plusBlue.textContent = '+';
        plusBlue.addEventListener('click', () => {
            insertNewRow(newRow, 'regular', startHour + 1, endHour + 1);
        });

        if (type !== 'p') {
            hourCell.appendChild(plusYellow);
            hourCell.appendChild(plusBlue);
        }

        newRow.appendChild(hourCell);

        for (let i = 0; i < 9; i++) {
            const dataCell = document.createElement('div');
            dataCell.classList.add('table-cell');
            const input = document.createElement('input');
            input.type = 'text';

            if (i === 2) { // Kolumna 3 (indeks 2) na kod
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
                    updateCC(newRow, line, select.value);
                });
                dataCell.appendChild(select);
            } else {
                dataCell.appendChild(input);
            }
            newRow.appendChild(dataCell);
        }
        
        currentRow.parentNode.insertBefore(newRow, currentRow.nextSibling);
    }

    function updateCC(row, line, code) {
        const ccCell = row.children[5]; // Kolumna 6 (indeks 5)
        const lineCodes = storedData.codes[line] || [];
        const foundCode = lineCodes.find(item => item.kod === code);
        
        if (foundCode) {
            ccCell.textContent = foundCode.cc;
        } else {
            ccCell.textContent = '';
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
        storedData.lines.forEach(line => {
            const lineCodes = storedData.codes[line] || [];
            lineCodes.forEach(codeData => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${line}</td>
                    <td>${codeData.kod}</td>
                    <td><input type="text" value="${codeData.cc}" data-field="cc"></td>
                    <td><input type="text" value="${codeData.osob}" data-field="osob"></td>
                    <td><input type="text" value="${codeData.A}" data-field="A"></td>
                    <td><input type="text" value="${codeData.B}" data-field="B"></td>
                    <td><input type="text" value="${codeData.C}" data-field="C"></td>
                    <td><input type="text" value="${codeData.D}" data-field="D"></td>
                    <td><input type="text" value="${codeData.E}" data-field="E"></td>
                    <td><input type="text" value="${codeData.F}" data-field="F"></td>
                    <td><input type="text" value="${codeData.G}" data-field="G"></td>
                    <td><input type="text" value="${codeData.H}" data-field="H"></td>
                `;
                editTableBody.appendChild(row);
            });
        });
    }

    // Dodawanie nowego wiersza w tabeli edycji
    addRowBtn.addEventListener('click', () => {
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
        renderLineOptions(); // Aktualizacja listy linii
        generateInitialRow(); // Odświeżenie tabeli głównej
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

    // Zmiana zmiany
    shiftSelect.addEventListener('change', () => {
        productionTableBody.innerHTML = '';
        generateInitialRow();
    });

    // Zmiana linii
    lineSelect.addEventListener('change', () => {
        productionTableBody.innerHTML = '';
        generateInitialRow();
    });

    // Inicjalizacja przy ładowaniu strony
    setDate();
    generateTableHeaders();
    renderLineOptions();
    generateInitialRow();
});
