// Dane, które powinny być wczytane np. z pliku JSON
const productionData = {
    liniaA: [
        { kod: "KOD-A1", cc: 50 },
        { kod: "KOD-A2", cc: 65 },
        { kod: "KOD-A3", cc: 45 }
    ],
    liniaB: [
        { kod: "KOD-B1", cc: 40 },
        { kod: "KOD-B2", cc: 70 },
        { kod: "KOD-B3", cc: 55 }
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

    // Godziny pracy do wypełnienia pierwszej kolumny
    const workHours = ["6-7", "7-8", "8-9", "9-10", "10-11", "11-12", "12-13", "13-14"];

    // Funkcja do generowania wierszy tabeli
    function generateTableRows() {
        tableBody.innerHTML = '';
        const selectedLine = lineSelect.value;
        const codes = productionData[selectedLine] || [];
        const datalistId = 'kod-list-' + selectedLine;

        const datalist = document.createElement('datalist');
        datalist.id = datalistId;
        codes.forEach(data => {
            const option = document.createElement('option');
            option.value = data.kod;
            datalist.appendChild(option);
        });
        const oldDatalist = document.getElementById(datalistId);
        if (oldDatalist) {
            oldDatalist.remove();
        }
        document.body.appendChild(datalist);

        for (let i = 0; i < numRows; i++) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${workHours[i] || ''}</td>
                <td></td>
                <td>
                    <div>
                        <input list="${datalistId}" class="kod-input-1" type="text" placeholder="Wybierz lub wpisz kod">
                        <input list="${datalistId}" class="kod-input-2" type="text" placeholder="Wybierz lub wpisz kod">
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
                <td>
                    <div>
                        <input type="number" class="cc-input-1" disabled value="0">
                        <input type="number" class="cc-input-2" disabled value="0">
                    </div>
                </td>
                <td>
                    <div>
                        <input type="number" class="time-input-1" min="0" value="0">
                        <input type="number" class="time-input-2" min="0" value="0">
                    </div>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            `;
            tableBody.appendChild(row);
        }
    }

    // Funkcja do aktualizowania wartości CC i obliczania OEE
    function updateValues(row) {
        const kodInput1 = row.querySelector('.kod-input-1');
        const kodInput2 = row.querySelector('.kod-input-2');
        const okInput1 = row.querySelector('.ok-input-1');
        const okInput2 = row.querySelector('.ok-input-2');
        const nokInput1 = row.querySelector('.nok-input-1');
        const nokInput2 = row.querySelector('.nok-input-2');
        const ccInput1 = row.querySelector('.cc-input-1');
        const ccInput2 = row.querySelector('.cc-input-2');
        const timeInput1 = row.querySelector('.time-input-1');
        const timeInput2 = row.querySelector('.time-input-2');
        const oeeCell = row.querySelector('td:nth-child(2)');

        const selectedLine = lineSelect.value;
        const selectedKod1 = kodInput1.value;
        const selectedKod2 = kodInput2.value;

        // Aktualizacja CC dla KOD1
        const foundCode1 = productionData[selectedLine]?.find(data => data.kod === selectedKod1);
        if (foundCode1) {
            ccInput1.value = foundCode1.cc;
        } else {
            ccInput1.value = 0;
        }
        
        // Aktualizacja CC dla KOD2
        const foundCode2 = productionData[selectedLine]?.find(data => data.kod === selectedKod2);
        if (foundCode2) {
            ccInput2.value = foundCode2.cc;
        } else {
            ccInput2.value = 0;
        }

        // Obliczanie OEE
        const totalOk = (parseInt(okInput1.value) || 0) + (parseInt(okInput2.value) || 0);
        const totalNok = (parseInt(nokInput1.value) || 0) + (parseInt(nokInput2.value) || 0);
        const totalTime = (parseInt(timeInput1.value) || 0) + (parseInt(timeInput2.value) || 0);
        const totalCc = (parseInt(ccInput1.value) || 0) + (parseInt(ccInput2.value) || 0);

        let oee = 0;
        if (totalTime > 0 && totalCc > 0) {
            const plannedProduction = totalTime * totalCc;
            if (plannedProduction > 0) {
                oee = ((totalOk + totalNok) / plannedProduction) * 100;
            }
        }
        oeeCell.textContent = oee.toFixed(2) + '%';
    }

    lineSelect.addEventListener('change', () => {
        generateTableRows();
    });

    tableBody.addEventListener('input', (event) => {
        const target = event.target;
        const row = target.closest('tr');
        
        if (target.classList.contains('kod-input-1') ||
            target.classList.contains('kod-input-2') ||
            target.classList.contains('ok-input-1') ||
            target.classList.contains('ok-input-2') ||
            target.classList.contains('nok-input-1') ||
            target.classList.contains('nok-input-2') ||
            target.classList.contains('time-input-1') ||
            target.classList.contains('time-input-2')) {
            updateValues(row);
        }
    });

    generateTableRows();
});
