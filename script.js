let dane = {};

async function loadData() {
  try {
    const res = await fetch("data.json");
    if (!res.ok) throw new Error("Błąd wczytywania data.json: " + res.status);
    dane = await res.json();
  } catch (err) {
    console.error(err);
    dane = {}; // zabezpieczenie
  }
}

function populateKodSelects(linia) {
  const kodList = (dane[linia] && dane[linia].KODY) ? dane[linia].KODY : [];
  const selects = document.querySelectorAll(".kod-select");

  selects.forEach(sel => {
    const row = sel.closest("tr");
    const ttNomDiv = row.querySelectorAll("td")[8].querySelector(".cell"); // kolumna Tt NOM (index 8)
    const previous = sel.value;

    // odbuduj listę opcji
    sel.innerHTML = "";
    const emptyOpt = document.createElement("option");
    emptyOpt.value = "";
    emptyOpt.textContent = "--";
    sel.appendChild(emptyOpt);

    kodList.forEach(k => {
      const opt = document.createElement("option");
      opt.value = k.kod;
      opt.textContent = k.kod;
      sel.appendChild(opt);
    });

    // jeśli poprzednio wybrany kod jest nadal dostępny - zachowaj i ustaw Tt NOM
    if (previous && Array.from(sel.options).some(o => o.value === previous)) {
      sel.value = previous;
      const found = kodList.find(x => x.kod === previous);
      ttNomDiv.innerText = found ? found.tt_nom : "";
    } else {
      sel.value = "";
      // nie nadpisuj, ale jeśli chcesz czyścić Tt NOM przy zmianie linii, odkomentuj poniższą:
      ttNomDiv.innerText = "";
    }

    // przypisz onchange (nadpisywane przy każdej odbudowie, więc nie narastają handler-y)
    sel.onchange = () => {
      const chosen = sel.value;
      const found = kodList.find(x => x.kod === chosen);
      ttNomDiv.innerText = found ? found.tt_nom : "";
    };
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadData();

  const liniaSelect = document.getElementById("linia");

  // jeśli nie ma .kod-select jeszcze (np. ktoś zmienił HTML), nic się nie stanie
  // inicjalne wypełnienie selectów KOD
  populateKodSelects(liniaSelect.value);

  // zmiana linii -> aktualizacja wszystkich KOD
  liniaSelect.addEventListener("change", (e) => {
    populateKodSelects(e.target.value);
  });
});
