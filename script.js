// ... (pozostała część kodu)

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
        <td class="oee-cell font-bold">0%</td>
        <td class="nominal-people-cell">-</td>
        <td class="nominal-cycle-cell">-</td>
        <td><input type="number" class="cell-input real-people" value="0"></td>
        <td class="real-cycle-cell">0.00</td>
        <td class="split-cell-td"><div class="split-cell">${codeSelectOptions()}</div></td>
        <td class="split-cell-td"><div class="split-cell"><span>0</span><span>0</span></div></td>
        <td class="split-cell-td"><div class="split-cell"><span>0</span><span>0</span></div></td>
        <td class="split-cell-td"><div class="split-cell"><input type="number" class="cell-input ok-qty-lh" value="0"><input type="number" class="cell-input ok-qty-rh" value="0"></div></td>
        <td class="split-cell-td"><div class="split-cell"><input type="number" class="cell-input nok-qty-lh" value="0"><input type="number" class="cell-input nok-qty-rh" value="0"></div></td>
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
// ... (reszta kodu bez zmian)
