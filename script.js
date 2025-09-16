// Dane początkowe
let database = [
    { linia: "MP4", kod: "36000296mxx", cc: "55", osob: 24 },
    { linia: "MP4", kod: "36000297mxx", cc: "60", osob: 24 },
];

const lineSelect = document.getElementById('lineSelect');
const productionTable = document.getElementById('productionTable');
const databaseModal = document.getElementById('databaseModal');
const menuButton = document.getElementById('menuButton');
const closeModal = document.querySelector('.close');
const databaseTableBody = document.querySelector('#databaseTable tbody');

function refreshLineSelect() {
    lineSelect.innerHTML = "";
    [...new Set(database.map(d => d.linia))].forEach(l => {
        let opt = document.createElement("option");
        opt.value = l;
        opt.textContent = l;
        lineSelect.appendChild(opt);
    });
    refreshKodSelect();
}

function refreshKodSelect() {
    const selectedLine = lineSelect.value;
    const kodSelects = document.querySelectorAll(".kodSelect");
    kodSelects.forEach(select => {
        select.innerHTML = "";
        database.filter(d => d.linia === selectedLine).forEach(item => {
            let opt = document.createElement("option");
            opt.value = item.kod;
            opt.textContent = item.kod;
            select.appendChild(opt);
        });
        if (select.options.length > 0) {
            select.value = select.options[0].value;
            updateCC(select);
        }
    });
}

function updateCC(selectElement) {
    const selectedLine = lineSelect.value;
    const selectedKod = selectElement.value;
    const ccInput = selectElement.closest("tr").querySelector(".ccInput");
    const record = database.find(d => d.linia === selectedLine && d.kod === selectedKod);
    if (record) ccInput.value = record.cc;
}

document.querySelectorAll(".kodSelect").forEach(select => {
    select.addEventListener("change", () => updateCC(select));
});

menuButton.addEventListener("click", () => {
    databaseModal.style.display = "flex";
    renderDatabaseTable();
});

closeModal.addEventListener("click", () => databaseModal.style.display = "none");

function renderDatabaseTable() {
    databaseTableBody.innerHTML = "";
    database.forEach((row, index) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td contenteditable="true">${row.linia}</td>
            <td contenteditable="true">${row.kod}</td>
            <td contenteditable="true">${row.cc}</td>
            <td contenteditable="true">${row.osob}</td>
            <td><button onclick="deleteRow(${index})">🗑</button></td>`;
        databaseTableBody.appendChild(tr);
    });
}

document.getElementById("addRow").addEventListener("click", () => {
    database.push({ linia: "", kod: "", cc: "", osob: "" });
    renderDatabaseTable();
});

document.getElementById("saveDatabase").addEventListener("click", () => {
    const rows = databaseTableBody.querySelectorAll("tr");
    database = [...rows].map(r => {
        const cells = r.querySelectorAll("td");
        return {
            linia: cells[0].textContent.trim(),
            kod: cells[1].textContent.trim(),
            cc: cells[2].textContent.trim(),
            osob: cells[3].textContent.trim()
        };
    });
    refreshLineSelect();
    databaseModal.style.display = "none";
});

function deleteRow(index) {
    database.splice(index, 1);
    renderDatabaseTable();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString();
    refreshLineSelect();
});
