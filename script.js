// Referencje do elementów
const menuButton = document.getElementById("menu-button");
const menuModal = document.getElementById("menu-modal");
const closeButton = document.querySelector(".close-button");
const editDataButton = document.getElementById("edit-data-button");
const editSection = document.getElementById("edit-section");
const reportTableBody = document.querySelector("#report-table tbody");
const editTableContainer = document.getElementById("edit-table-container");
const addRowButton = document.getElementById("add-row-button");
const saveDataButton = document.getElementById("save-data-button");
const backButton = document.getElementById("back-button");

// Pola edycji nagłówka
const editLine = document.getElementById("edit-line");
const editShift = document.getElementById("edit-shift");
const editBrigade = document.getElementById("edit-brigade");

// Dane produkcyjne
let productionData = [];
let metaData = { line: "", shift: "", brigade: "" };

// ---------------- Menu ----------------
menuButton.addEventListener("click", () => menuModal.classList.remove("hidden"));
closeButton.addEventListener("click", () => menuModal.classList.add("hidden"));

editDataButton.addEventListener("click", () => {
    menuModal.classList.add("hidden");
    editSection.classList.remove("hidden");
    renderEditTable();
});

// ---------------- Edycja ----------------
function renderEditTable() {
    editTableContainer.innerHTML = "";
    const table = document.createElement("table");
    table.innerHTML = `
        <thead>
            <tr>
                <th>Godz.</th>
                <th>OEE</th>
                <th>KOD</th>
                <th>OK</th>
                <th>NOK</th>
                <th>CC</th>
                <th>CZAS</th>
                <th>DANE1</th>
                <th>DANE2</th>
                <th>DANE3</th>
                <th>DANE4</th>
                <th>DANE5</th>
                <th>DANE6</th>
                <th>DANE7</th>
                <th>DANE8</th>
                <th>DANE9</th>
                <th>DANE10</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");

    productionData.forEach((row, idx) => {
        const tr = document.createElement("tr");
        row.forEach(val => {
            const td = document.createElement("td");
            const input = document.createElement("input");
            input.value = val;
            td.appendChild(input);
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    editTableContainer.appendChild(table);

    // Uzupełnij metadane
    editLine.value = metaData.line;
    editShift.value = metaData.shift;
    editBrigade.value = metaData.brigade;
}

// Dodawanie wiersza
addRowButton.addEventListener("click", () => {
    productionData.push(["","","","","","","","","","","","","","","","",""]);
    renderEditTable();
});

// Zapis danych
saveDataButton.addEventListener("click", () => {
    const rows = editTableContainer.querySelectorAll("tbody tr");
    productionData = [];
    rows.forEach(tr => {
        const values = Array.from(tr.querySelectorAll("input")).map(i => i.value);
        productionData.push(values);
    });
    metaData.line = editLine.value;
    metaData.shift = editShift.value;
    metaData.brigade = editBrigade.value;

    renderReportTable();
    editSection.classList.add("hidden");
});

// Powrót
backButton.addEventListener("click", () => {
    editSection.classList.add("hidden");
});

// ---------------- Raport główny ----------------
function renderReportTable() {
    reportTableBody.innerHTML = "";
    productionData.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(val => {
            const td = document.createElement("td");
            td.textContent = val;
            tr.appendChild(td);
        });
        reportTableBody.appendChild(tr);
    });
}
