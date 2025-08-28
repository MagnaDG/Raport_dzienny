let dane = {};

async function loadData() {
  const response = await fetch("data.json");
  dane = await response.json();
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadData();

  const liniaSelect = document.getElementById("linia");
  const tableBody = document.querySelector("table tbody");

  // tworzymy wiersze i komórki edytowalne
  tableBody.querySelectorAll("tr").forEach(row => {
    for (let i = 0; i < 27; i++) {
      const cell = document.createElement("td");
      // domyślnie wszystkie komórki mają input
      const input = document.createElement("input");
      input.type = "text";
      cell.appendChild(input);
      row.appendChild(cell);
    }
  });

  function aktualizujKody() {
    const linia = liniaSelect.value;
    const kody = dane[linia]?.KODY || [];

    tableBody.querySelectorAll("tr").forEach(row => {
      const komorki = row.querySelectorAll("td");
      const kodCell = komorki[11]; // KOD
      const ttNomCell = komorki[8]; // Tt NOM

      // reset komórki kodu
      kodCell.innerHTML = "";
      const select = document.createElement("select");
      select.innerHTML = `<option value="">--</option>`;
      kody.forEach(k => {
        const opt = document.createElement("option");
        opt.value = k.kod;
        opt.textContent = k.kod;
        select.appendChild(opt);
      });

      // event na wybór kodu
      select.addEventListener("change", () => {
        const kodWybrany = select.value;
        const znaleziony = kody.find(k => k.kod === kodWybrany);
        ttNomCell.querySelector("input").value = znaleziony ? znaleziony.tt_nom : "";
      });

      kodCell.appendChild(select);
    });
  }

  liniaSelect.addEventListener("change", aktualizujKody);
  aktualizujKody();
});
