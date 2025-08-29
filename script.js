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

    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;

    const workHours = ["6-7", "7-8", "8-9", "9-10", "10-11", "11-12", "12-13", "13-14"];

    // Funkcja do generowania wierszy tabeli
    function generateTableRows() {
        tableBody.innerHTML = '';
        const selectedLine = lineSelect.value;
        const codes = productionData[selectedLine] || [];

        // Generowanie opcji kodów do selecta
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
        const kodSelect1 = row.querySelector('.kod-select-1');
        const kodSelect2 = row.querySelector('.kod-select-2');
        const okInput1 = row.querySelector('.ok-input-1');
        const okInput2 = row.querySelector('.ok-input-2');
        const nokInput1 = row.querySelector('.nok-input-1');
        const nokInput2 = row.querySelector('.nok-input-2');
        const ccInput = row.querySelector('.cc-input');
        const timeInput = row.querySelector('.time-input');
        const oeeCell = row.querySelector('td:nth-child(2)');

        const selectedLine = lineSelect.value;
        const selectedKod1 = kodSelect1.value;
        const selectedKod2 = kodSelect2.value;

        // Znajdź wartość CC dla pierwszego wybranego kodu
        const foundCode1 = productionData[selectedLine]?.find(data => data.kod === selectedKod1);
        const cc1 = foundCode1 ? foundCode1.cc : 0;
        
        // Znajdź wartość CC dla drugiego wybranego kodu
        const foundCode2 = productionData[selectedLine]?.find(data => data.kod === selectedKod2);
        const cc2 = foundCode2 ? foundCode2.cc : 0;

        // CC dla całej paletki jest sumą wartości z dwóch kodów
        const totalCc = cc1 + cc2;
        ccInput.value = totalCc;

        // Obliczanie OEE
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

    generateTableRows();
});
