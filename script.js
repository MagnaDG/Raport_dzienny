document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menu-button");
  const menuModal = document.getElementById("menu-modal");
  const closeModalButton = document.querySelector(".close-button");
  const editDataButton = document.getElementById("edit-data-button");
  const editSection = document.getElementById("edit-section");
  const reportTableBody = document.querySelector("#report-table tbody");
  const addRowMain = document.getElementById("add-row-main");
  const addRowEdit = document.getElementById("add-row-edit");
  const editTableContainer = document.getElementById("edit-table-container");
  const backButton = document.getElementById("back-button");
  const saveDataButton = document.getElementById("save-data-button");

  let data = [];

  // --- Modal ---
  menuButton.addEventListener("click", () => menuModal.classList.add("active"));
  closeModalButton.addEventListener("click", () => menuModal.classList.remove("active"));

  // --- Dodawanie wierszy ---
  function addRow(target) {
    const newRow = {
      godz: "",
      oee: "",
      kod: "",
      ok: "",
      nok: "",
      cc: "",
      czas: "",
      linia: "",
      dane: Array(10).fill("")
    };
    data.push(newRow);
    renderTables();
    if (target === "edit") showEditTable();
  }

  addRowMain.addEventListener("click", () => addRow("main"));
  addRowEdit.addEventListener("click", () => addRow("edit"));

  // --- Renderowanie tabeli głównej ---
  function renderMainTable() {
    reportTableBody.innerHTML = "";
    data.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.godz}</td>
        <td>${row.oee}</td>
        <td>${row.kod}</td>
        <td>${row.ok}</td>
        <td>${row.nok}</td>
        <td>${row.cc}</td>
        <td>${row.czas}</td>
        <td>${row.linia}</td>
        ${row.dane.map(v => `<td>${v}</td>`).join("")}
      `;
      reportTableBody.appendChild(tr);
    });
  }

  // --- Renderowanie tabeli edycji ---
  function showEditTable() {
    editTableContainer.innerHTML = `
      <table id="edit-table">
        <thead>
          <tr>
            <th>Godz.</th>
            <th>OEE</th>
            <th>KOD</th>
            <th>OK</th>
            <th>NOK</th>
            <th>CC</th>
            <th>CZAS</th>
            <th>LINIA</th>
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
        <tbody>
          ${data.map((row, i) => `
            <tr>
              <td><input value="${row.godz}"></td>
              <td><input value="${row.oee}"></td>
              <td><input value="${row.kod}"></td>
              <td><input value="${row.ok}"></td>
              <td><input value="${row.nok}"></td>
              <td><input value="${row.cc}"></td>
              <td><input value="${row.czas}"></td>
              <td><input value="${row.linia}"></td>
              ${row.dane.map(v => `<td><input value="${v}"></td>`).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  // --- Zapis danych z edycji ---
  saveDataButton.addEventListener("click", () => {
    const rows = editTableContainer.querySelectorAll("tbody tr");
    data = Array.from(rows).map(row => {
      const inputs = row.querySelectorAll("input");
      return {
        godz: inputs[0].value,
        oee: inputs[1].value,
        kod: inputs[2].value,
        ok: inputs[3].value,
        nok: inputs[4].value,
        cc: inputs[5].value,
        czas: inputs[6].value,
        linia: inputs[7].value,
        dane: Array.from(inputs).slice(8).map(inp => inp.value)
      };
    });
    renderTables();
    editSection.classList.add("hidden");
  });

  // --- Przełączanie widoków ---
  editDataButton.addEventListener("click", () => {
    showEditTable();
    editSection.classList.remove("hidden");
    menuModal.classList.remove("active");
  });

  backButton.addEventListener("click", () => {
    editSection.classList.add("hidden");
  });

  function renderTables() {
    renderMainTable();
  }

  renderTables();
});
