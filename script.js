// Stałe hasło
const EDIT_PASSWORD = "haslo123";

// Domyślne dane
const defaultProductionData = {
  MP4: [
    { kod: "37000057487MXX", cc: 50, dane1: 0, dane2: 0 },
    { kod: "KOD-A2", cc: 65, dane1: 0, dane2: 0 }
  ],
  liniaB: [
    { kod: "KOD-B1", cc: 40, dane1: 0, dane2: 0 },
    { kod: "KOD-B2", cc: 70, dane1: 0, dane2: 0 }
  ]
};

function getProductionData() {
  const stored = localStorage.getItem("productionData");
  return stored ? JSON.parse(stored) : defaultProductionData;
}

function saveProductionData(data) {
  localStorage.setItem("productionData", JSON.stringify(data));
}

let productionData = getProductionData();

document.addEventListener("DOMContentLoaded", () => {
  const lineSelect = document.getElementById("line-select");
  const tableBody = document.querySelector("#report-table tbody");
  const menuButton = document.getElementById("menu-button");
  const menuModal = document.getElementById("menu-modal");
  const closeModalButton = document.querySelector(".close-button");
  const editDataButton = document.getElementById("edit-data-button");
  const editSection = document.getElementById("edit-section");
  const reportTable = document.getElementById("report-table");
  const saveDataButton = document.getElementById("save-data-button");
  const backButton = document.getElementById("back-button");
  const editTableContainer = document.getElementById("edit-table-container");

  // Proste generowanie tabeli
  function generateTable() {
    tableBody.innerHTML = "";
    const selectedLine = lineSelect.value;
    const codes = productionData[selectedLine] || [];
    codes.forEach((c, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${i + 1}</td>
        <td>-</td>
        <td>${c.kod}</td>
        <td>0</td>
        <td>0</td>
        <td>${c.cc}</td>
        <td>0</td>
        <td>${c.dane1}</td>
        <td>${c.dane2}</td>
        <td></td><td></td><td></td><td></td>
        <td></td><td></td><td></td><td></td>
      `;
      tableBody.appendChild(row);
    });
  }

  lineSelect.addEventListener("change", generateTable);

  // Modal
  menuButton.addEventListener("click", () => {
    menuModal.classList.remove("hidden");
  });

  closeModalButton.addEventListener("click", () => {
    menuModal.classList.add("hidden");
  });

  window.addEventListener("click", (e) => {
    if (e.target === menuModal) {
      menuModal.classList.add("hidden");
    }
  });

  // Edycja danych
  editDataButton.addEventListener("click", () => {
    menuModal.classList.add("hidden");
    const password = prompt("Podaj hasło do edycji:");
    if (password === EDIT_PASSWORD) {
      reportTable.classList.add("hidden");
      editSection.classList.remove("hidden");
      generateEditTable();
    } else {
      alert("Błędne hasło!");
    }
  });

  function generateEditTable() {
    editTableContainer.innerHTML = "";
    const table = document.createElement("table");
    table.innerHTML = `<tr><th>Linia</th><th>KOD</th><th>CC</th><th>DANE1</th><th>DANE2</th></tr>`;
    for (const line in productionData) {
      productionData[line].forEach(d => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${line}</td>
          <td><input type="text" value="${d.kod}"></td>
          <td><input type="number" value="${d.cc}"></td>
          <td><input type="number" value="${d.dane1}"></td>
          <td><input type="number" value="${d.dane2}"></td>
        `;
        table.appendChild(row);
      });
    }
    editTableContainer.appendChild(table);
  }

  saveDataButton.addEventListener("click", () => {
    const rows = editTableContainer.querySelectorAll("tr");
    const newData = {};
    rows.forEach((row, i) => {
      if (i === 0) return; // pomiń nagłówek
      const cells = row.querySelectorAll("td");
      const line = cells[0].textContent;
      const kod = cells[1].querySelector("input").value;
      const cc = parseInt(cells[2].querySelector("input").value) || 0;
      const dane1 = parseInt(cells[3].querySelector("input").value) || 0;
      const dane2 = parseInt(cells[4].querySelector("input").value) || 0;
      if (!newData[line]) newData[line] = [];
      newData[line].push({ kod, cc, dane1, dane2 });
    });
    productionData = newData;
    saveProductionData(productionData);
    alert("Dane zapisane!");
  });

  backButton.addEventListener("click", () => {
    editSection.classList.add("hidden");
    reportTable.classList.remove("hidden");
    generateTable();
  });

  // Start
  generateTable();
});
