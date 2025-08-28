// Dane, które powinny być wczytane np. z pliku JSON
const productionData = {
    liniaA: [
        { kod: "KOD-A1", cc: 50 },
        { kod: "KOD-A2", cc: 65 }
    ],
    liniaB: [
        { kod: "KOD-B1", cc: 40 },
        { kod: "KOD-B2", cc: 70 }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const datePicker = document.getElementById('date-picker');
    const lineSelect = document.getElementById('line-select');
    const tableBody = document.querySelector('#report-table tbody');
    const numRows = 8;

    // Ustawienie domyślnej daty na dzisiejszą
    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;

    // Funkcja do generowania wierszy tabeli
    function generateTableRows() {
        tableBody.innerHTML = ''; // Wyczyść tabelę przed generowaniem
        const selectedLine = lineSelect.value;
        const codes = productionData[selectedLine] || [];
        const datalistId = 'kod-list-' + selectedLine;

        // Tworzymy datalistę na podstawie wybranej linii
        const datalist = document.createElement('datalist');
        datalist.id = datalistId;
        codes.forEach(data => {
            const option = document.createElement('option');
            option.value = data.kod;
            datalist.appendChild(option);
        });
        document.body.appendChild(datalist);

        for (let i = 0; i < numRows; i++) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td></td>
                <td>
                    <input list="${datalistId}" class="kod-input" type="text" placeholder="Wybierz lub wpisz kod">
                </td>
                <td><input type="number" class="ok-input" min="0" value="0"></td>
                <td><input type="number" class="nok-input" min="0" value="0"></td>
                <td><input type="number" class="cc-input" disabled value="0"></td>
                <td><input type="number" class="time-input" min="0" value="0"></td>
            `;
            tableBody.appendChild(row);
        }
    }

    // Funkcja do aktualizowania wartości CC i obliczania OEE
    function updateValues(row) {
        const kodInput = row.querySelector('.kod-input');
        const okInput = row.querySelector('.ok-input');
        const nokInput = row.querySelector('.nok-input');
        const ccInput = row.querySelector('.cc-input');
        const timeInput = row.querySelector('.time-input');
        const oeeCell = row.querySelector('td:first-child');

        const selectedLine = lineSelect.value;
        const selectedKod = kodInput.value;

        // Znajdź wartość CC dla wpisanego/wybranego kodu
        const foundCode = productionData[selectedLine]?.find(data => data.kod === selectedKod);
        if (foundCode) {
            ccInput.value = foundCode.cc;
        } else {
            ccInput.value = 0; // Ustaw 0, jeśli kod nie pasuje
        }

        // Obliczanie OEE
        const ok = parseInt(okInput.value) || 0;
        const nok = parseInt(nokInput.value) || 0;
        const time = parseInt(timeInput.value) || 0;
        const cc = parseInt(ccInput.value) || 0;

        let oee = 0;
        if (time > 0 && cc > 0) {
            const plannedProduction = time * cc;
            if (plannedProduction > 0) {
                oee = ((ok + nok) / plannedProduction) * 100;
            }
        }
        oeeCell.textContent = oee.toFixed(2) + '%';
    }

    // Nasłuchuj na zmiany w liście 'Linia'
    lineSelect.addEventListener('change', () => {
        generateTableRows();
    });

    // Nasłuchuj na zmiany wewnątrz tabeli (delegowanie zdarzeń)
    tableBody.addEventListener('input', (event) => { // Zmieniono na 'input' dla lepszej responsywności
        const target = event.target;
        const row = target.closest('tr');

        if (target.classList.contains('kod-input') ||
            target.classList.contains('ok-input') ||
            target.classList.contains('nok-input') ||
            target.classList.contains('time-input')) {
            updateValues(row);
        }
    });

    // Inicjalne generowanie tabeli po załadowaniu strony
    generateTableRows();
});
