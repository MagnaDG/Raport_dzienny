/* Production table + DB logic */
/* Keys in localStorage:
   - "prod_db" : array of {linia,kod,cc,osob}
   - "prod_rows": saved production rows (optional)
*/

const DB_KEY = "prod_db_v1";
const ROWS_KEY = "prod_rows_v1";

const sampleDb = [
  { linia: "MP4", kod: "36000296mxx", cc: "55", osob: "24" },
  { linia: "MP4", kod: "36000297mxx", cc: "36", osob: "24" },
  { linia: "MP4", kod: "36000298mxx", cc: "60", osob: "24" },
  { linia: "MP3", kod: "36001000abc", cc: "40", osob: "20" }
];

const hours = [
  "6-7","7-8","8-9","9-10","10-11","11-12","12-13","13-14"
];

const tbody = document.getElementById("tbodyRows");
const globalLine = document.getElementById("globalLine");
const menuPlaque = document.getElementById("menuPlaque");
const dbModal = document.getElementById("dbModal");
const dbTableBody = document.querySelector("#dbTable tbody");
const addDbRowBtn = document.getElementById("addDbRow");
const saveDbBtn = document.getElementById("saveDb");
const closeDbBtn = document.getElementById("closeDb");
const resetDbBtn = document.getElementById("resetDb");
const saveAllBtn = document.getElementById("saveAll");
const saveStatus = document.getElementById("saveStatus");

let db = loadDb();
let prodRows = loadProdRows();

// initialize
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("currentDate").textContent = new Date().toLocaleDateString();
  renderMainTable();
  refreshLineSelect();
  renderDbTable();
});

/* DB load/save */
function loadDb(){
  try {
    const s = localStorage.getItem(DB_KEY);
    if (!s) { localStorage.setItem(DB_KEY, JSON.stringify(sampleDb)); return sampleDb.slice(); }
    return JSON.parse(s);
  } catch(e){ return sampleDb.slice(); }
}
function saveDb(){
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

/* Prod rows load/save (optional) */
function loadProdRows(){
  try{
    const s = localStorage.getItem(ROWS_KEY);
    if (!s) return null;
    return JSON.parse(s);
  }catch(e){ return null; }
}
function saveProdRows(rows){
  localStorage.setItem(ROWS_KEY, JSON.stringify(rows));
}

/* RENDER MAIN TABLE */
function renderMainTable(){
  tbody.innerHTML = "";
  // if saved rows exist, use them; otherwise generate with sample data for first 3 rows
  const saved = prodRows;
  for(let i=0;i<hours.length;i++){
    const tr = document.createElement("tr");
    // build many columns per spec
    tr.innerHTML = `
      <td class="col-hours">${hours[i]}</td>
      <td><input type="text" class="cell oee" /></td>
      <td><input type="text" class="cell ftt" /></td>
      <td><input type="text" class="cell dost" /></td>
      <td><input type="text" class="cell wydaj" /></td>
      <td><input type="number" class="cell osob_nom" /></td>
      <td><input type="number" class="cell osob_real" /></td>
      <td><input type="number" class="cell ilosc_tl" /></td>
      <td><input type="text" class="cell tt_nom" /></td>
      <td><input type="text" class="cell tt_real" /></td>
      <td><input type="number" class="cell ilosc_plan" /></td>
      <td><input type="number" class="cell ilosc_max" /></td>
      <td><input type="number" class="cell ilosc_ok" /></td>
      <td><input type="number" class="cell ilosc_nok" /></td>
      <td><input type="text" class="cell czas_dost" /></td>
      <td><input type="text" class="cell czas_pracy" /></td>
      <td><input type="text" class="cell postoje" /></td>
      <td><input type="text" class="cell mikro" /></td>
      <td><input type="text" class="cell brak_wyd" /></td>
      <td><input type="text" class="cell rozlicz_czasu" /></td>
      <td><input type="text" class="cell powod" /></td>
      <td><input type="text" class="cell op_flat" /></td>
      <td><input type="text" class="cell czas_extra" /></td>
      <td><input type="text" class="cell lz" /></td>
      <td>
        <div class="kod-stack">
          <select class="kod1"></select>
        </div>
      </td>
      <td>
        <div class="kod-stack">
          <select class="kod2"></select>
        </div>
      </td>
      <td><input type="text" class="cell cc" readonly /></td>
      <td><textarea class="cell comment" rows="1"></textarea></td>
    `;
    tbody.appendChild(tr);

    // if saved data exist fill
    if (saved && saved[i]) fillRowFromData(tr, saved[i]);
  }

  // if no saved data, put example sample in first 3 rows (like screenshot)
  if(!saved){
    const rows = tbody.querySelectorAll("tr");
    // row0
    fillRowValues(rows[0], {
      oee:"64%", ftt:"100%", dost:"71%", wydaj:"97%", osob_nom:24, osob_real:25,
      ilosc_tl:2, tt_nom:"13,6", tt_real:"13,9",
      ilosc_plan:243, ilosc_max:159, ilosc_ok:155,
      czas_dost:"", czas_pracy:"55", postoje:"36", mikro:"3",
      kod1:"36000296mxx", kod2:"36000297mxx", cc:"55",
      comment:"ZEBRANIE\nMIKROPRZESTOJE: LOGISTYKA"
    });
    // row1
    fillRowValues(rows[1], {
      oee:"84%", ftt:"100%", dost:"100%", wydaj:"91%", osob_nom:24, osob_real:25,
      ilosc_tl:2, tt_nom:"13,6", tt_real:"14,9",
      ilosc_plan:243, ilosc_max:159, ilosc_ok:200,
      czas_pracy:"55", postoje:"51", mikro:"0",
      kod1:"36000296mxx", kod2:"36000297mxx", cc:"55",
      comment:"MIKROPRZESTOJE"
    });
    // row2
    fillRowValues(rows[2], {
      oee:"80%", ftt:"100%", dost:"100%", wydaj:"91%", osob_nom:24, osob_real:25,
      ilosc_tl:2, tt_nom:"13,6", tt_real:"15,0",
      ilosc_plan:265, ilosc_max:234, ilosc_ok:214,
      czas_pracy:"60", postoje:"53", mikro:"0",
      kod1:"36000296mxx", kod2:"36000297mxx", cc:"60",
      comment:"MIKROPRZESTOJE - zablokowany separator"
    });
  }

  // populate kod selects for current global line
  refreshAllKodSelects();

  // attach change listeners to kod1 selects to update CC
  document.querySelectorAll(".kod1").forEach(s => {
    s.addEventListener("change", e => {
      const tr = e.target.closest("tr");
      updateCCforRow(tr);
    });
  });

  // when global line changes refresh kod lists
  globalLine.addEventListener("change", () => {
    refreshAllKodSelects();
  });
}

/* helper: fill a tr with data object */
function fillRowValues(tr, data){
  if(!tr) return;
  const map = {
    oee:".oee", ftt:".ftt", dost:".dost", wydaj:".wydaj",
    osob_nom:".osob_nom", osob_real:".osob_real", ilosc_tl:".ilosc_tl",
    tt_nom:".tt_nom", tt_real:".tt_real", ilosc_plan:".ilosc_plan",
    ilosc_max:".ilosc_max", ilosc_ok:".ilosc_ok", ilosc_nok:".ilosc_nok",
    czas_dost:".czas_dost", czas_pracy:".czas_pracy", postoje:".postoje",
    mikro:".mikro", brak_wyd:".brak_wyd", rozlicz_czasu:".rozlicz_czasu",
    powod:".powod", op_flat:".op_flat", czas_extra:".czas_extra", lz:".lz",
    comment:".comment"
  };
  Object.keys(map).forEach(k=>{
    if(data[k] !== undefined){
      const el = tr.querySelector(map[k]);
      if(el){
        if(el.tagName === "INPUT" || el.tagName==="TEXTAREA") el.value = data[k];
        else el.textContent = data[k];
      }
    }
  });
  // Kody + CC
  if(data.kod1) {
    const s1 = tr.querySelector(".kod1");
    if(s1){
      // if value available in options set it later after refreshAllKodSelects
      s1.dataset.force = data.kod1;
    }
  }
  if(data.kod2) {
    const s2 = tr.querySelector(".kod2");
    if(s2) s2.dataset.force = data.kod2;
  }
  if(data.cc){
    const cc = tr.querySelector(".cc");
    if(cc) cc.value = data.cc;
  }
}

/* fill from saved row object */
function fillRowFromData(tr, rowData){
  fillRowValues(tr, rowData);
}

/* Refresh line select (global header) */
function refreshLineSelect(){
  const lines = [...new Set(db.map(d=>d.linia).filter(Boolean))];
  globalLine.innerHTML = "";
  const opt0 = document.createElement("option");
  opt0.value = ""; opt0.textContent = "-- wybierz --";
  globalLine.appendChild(opt0);
  lines.forEach(l=>{
    const o = document.createElement("option"); o.value = l; o.textContent = l;
    globalLine.appendChild(o);
  });
  // default to first if exists
  if(lines.length && !globalLine.value) globalLine.value = lines[0];
}

/* Refresh kod options for every row based on chosen line */
function refreshAllKodSelects(){
  const selectedLine = globalLine.value;
  const kodOptions = db.filter(d=>d.linia===selectedLine).map(d=>({kod:d.kod,cc:d.cc}));
  document.querySelectorAll(".kod1, .kod2").forEach(sel=>{
    // clear
    sel.innerHTML = "";
    const defaultOpt = document.createElement("option");
    defaultOpt.value=""; defaultOpt.textContent="-- wybierz kod --";
    sel.appendChild(defaultOpt);
    kodOptions.forEach(k=>{
      const o = document.createElement("option");
      o.value = k.kod; o.textContent = k.kod;
      sel.appendChild(o);
    });
    // if previous forced value (from sample) set it
    if(sel.dataset.force){
      const f = sel.dataset.force;
      if([...sel.options].some(o=>o.value===f)) sel.value = f;
      delete sel.dataset.force;
    }
  });
  // after repopulating, update CC for each row according to kod1
  document.querySelectorAll("#tbodyRows tr").forEach(tr=> updateCCforRow(tr));
}

/* update CC in a given row based on kod1 and DB */
function updateCCforRow(tr){
  const kod = tr.querySelector(".kod1")?.value;
  const ccInput = tr.querySelector(".cc");
  const line = globalLine.value;
  if(kod && line){
    const rec = db.find(d=>d.linia===line && d.kod===kod);
    ccInput.value = rec ? rec.cc : "";
  } else {
    ccInput.value = "";
  }
}

/* MENU plaque open DB modal */
menuPlaque.addEventListener("click", ()=>{
  dbModal.style.display = "flex";
  dbModal.setAttribute("aria-hidden","false");
  renderDbTable();
});
closeDbBtn.addEventListener("click", ()=> { dbModal.style.display="none"; dbModal.setAttribute("aria-hidden","true"); });
window.addEventListener("click", (e)=>{
  if(e.target === dbModal) { dbModal.style.display="none"; dbModal.setAttribute("aria-hidden","true"); }
});

/* render DB table rows (contenteditable) */
function renderDbTable(){
  dbTableBody.innerHTML = "";
  db.forEach((r, idx)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td contenteditable="true">${r.linia}</td>
      <td contenteditable="true">${r.kod}</td>
      <td contenteditable="true">${r.cc}</td>
      <td contenteditable="true">${r.osob}</td>
      <td><button data-idx="${idx}" class="del-db">🗑</button></td>
    `;
    dbTableBody.appendChild(tr);
  });
}

/* add DB row */
addDbRowBtn.addEventListener("click", ()=>{
  db.push({linia:"",kod:"",cc:"",osob:""});
  renderDbTable();
});

/* delete DB row */
dbTableBody.addEventListener("click", (e)=>{
  if(e.target.classList.contains("del-db")){
    const idx = Number(e.target.dataset.idx);
    db.splice(idx,1);
    renderDbTable();
  }
});

/* save DB from table editable cells */
saveDbBtn.addEventListener("click", ()=>{
  const newDb = [];
  const rows = dbTableBody.querySelectorAll("tr");
  rows.forEach(r=>{
    const cells = r.querySelectorAll("td");
    const linia = cells[0].textContent.trim();
    const kod = cells[1].textContent.trim();
    const cc = cells[2].textContent.trim();
    const osob = cells[3].textContent.trim();
    if(linia || kod || cc || osob) newDb.push({linia,kod,cc,osob});
  });
  db = newDb;
  saveDb();
  refreshLineSelect();
  refreshAllKodSelects();
  renderDbTable();
  // give feedback
  saveStatus.textContent = "Baza zapisana";
  setTimeout(()=>saveStatus.textContent="",1500);
});

/* reset DB to sample */
resetDbBtn.addEventListener("click", ()=>{
  if(!confirm("Przywrócić przykładowe dane bazy?")) return;
  db = sampleDb.slice();
  saveDb();
  refreshLineSelect();
  refreshAllKodSelects();
  renderDbTable();
});

/* Save all production rows to localStorage */
saveAllBtn.addEventListener("click", ()=>{
  const rows = [];
  document.querySelectorAll("#tbodyRows tr").forEach(tr=>{
    const obj = {
      godz: tr.querySelector(".col-hours")?.textContent || "",
      oee: tr.querySelector(".oee")?.value || "",
      ftt: tr.querySelector(".ftt")?.value || "",
      dost: tr.querySelector(".dost")?.value || "",
      wydaj: tr.querySelector(".wydaj")?.value || "",
      osob_nom: tr.querySelector(".osob_nom")?.value || "",
      osob_real: tr.querySelector(".osob_real")?.value || "",
      ilosc_tl: tr.querySelector(".ilosc_tl")?.value || "",
      tt_nom: tr.querySelector(".tt_nom")?.value || "",
      tt_real: tr.querySelector(".tt_real")?.value || "",
      ilosc_plan: tr.querySelector(".ilosc_plan")?.value || "",
      ilosc_max: tr.querySelector(".ilosc_max")?.value || "",
      ilosc_ok: tr.querySelector(".ilosc_ok")?.value || "",
      ilosc_nok: tr.querySelector(".ilosc_nok")?.value || "",
      czas_dost: tr.querySelector(".czas_dost")?.value || "",
      czas_pracy: tr.querySelector(".czas_pracy")?.value || "",
      postoje: tr.querySelector(".postoje")?.value || "",
      mikro: tr.querySelector(".mikro")?.value || "",
      brak_wyd: tr.querySelector(".brak_wyd")?.value || "",
      rozlicz_czasu: tr.querySelector(".rozlicz_czasu")?.value || "",
      powod: tr.querySelector(".powod")?.value || "",
      op_flat: tr.querySelector(".op_flat")?.value || "",
      czas_extra: tr.querySelector(".czas_extra")?.value || "",
      lz: tr.querySelector(".lz")?.value || "",
      kod1: tr.querySelector(".kod1")?.value || "",
      kod2: tr.querySelector(".kod2")?.value || "",
      cc: tr.querySelector(".cc")?.value || "",
      comment: tr.querySelector(".comment")?.value || ""
    };
    rows.push(obj);
  });
  saveProdRows(rows);
  saveStatus.textContent = "Dane godzin zapisane";
  setTimeout(()=>saveStatus.textContent="",1500);
});

/* On-disk DB initial load done at top; expose db variable to script scope */
window.db = db;
