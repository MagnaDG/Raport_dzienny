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
    
    document.querySelectorAll('.delete-data-row').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.dataset.index;
            productData.splice(index, 1);
            saveProductData();
            renderDataModalTable(); // Ponowne renderowanie po usunięciu
        });
    });
}
