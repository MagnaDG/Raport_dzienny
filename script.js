const tableBody = document.querySelector("#report-table tbody");
const addRowButton = document.getElementById("add-row-button");

const menuButton = document.getElementById("menu-button");
const menuModal = document.getElementById("menu-modal");
const closeModalButton = document.querySelector(".close-button");

// Modal logika
menuButton.addEventListener("click", () => {
  menuModal.classList.add("active");
});

closeModalButton.addEventListener("click", () => {
  menuModal.classList.remove("active");
});

window.addEventListener("click", (e) => {
  if (e.target === menuModal) {
    menuModal.classList.remove("active");
  }
});

// Funkcja do tworzenia nowego wiersza
function createRow(data = {}) {
  const tr = document.createElement("tr");

  const cols = [
    "Godz", "OEE", "KOD", "OK", "NOK",
    "CC", "CZAS", "DANE1", "DANE2", "DANE3", "LINIA"
  ];

  cols.forEach(col => {
    const td = document.createElement("td");
    const input = document.createElement("input");
    input.type = "text";
    input.value = data[col] || "";
    td.appendChild(input);
    tr.appendChild(td);
  });

  // kolumna "Akcje"
  const actionsTd = document.createElement("td");
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑 Usuń";
  deleteBtn.addEventListener("click", () => {
    tr.remove();
  });
  actionsTd.appendChild(deleteBtn);
  tr.appendChild(actionsTd);

  tableBody.appendChild(tr);
}

// Obsługa dodawania wiersza
addRowButton.addEventListener("click", () => {
  createRow();
});
