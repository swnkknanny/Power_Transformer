let currentWorkbook = null;

const fileInput = document.getElementById('excelFile');
const sheetSelect = document.getElementById('sheetSelect');
const fileControls = document.getElementById('fileControls');
const tableContainer = document.getElementById('tableContainer');
const currentSheetTitle = document.getElementById('currentSheetTitle');
const searchInput = document.getElementById('searchInput');

// Metric Elements
const avgAvailElem = document.getElementById('avgAvail');
const avgMtbfElem = document.getElementById('avgMtbf');
const avgMttrElem = document.getElementById('avgMttr');
const totalModesElem = document.getElementById('totalModes');

fileInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const data = new Uint8Array(evt.target.result);
    currentWorkbook = XLSX.read(data, { type: 'array' });

    sheetSelect.innerHTML = '';
    currentWorkbook.SheetNames.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      sheetSelect.appendChild(option);
    });

    fileControls.style.display = 'block';

    // ถ้ามี Sheet TR ให้เปิด TR ก่อน ถ้าไม่มีให้เปิด Sheet แรก
    const defaultSheet = currentWorkbook.SheetNames.includes('TR') ? 'TR' : currentWorkbook.SheetNames[0];
    sheetSelect.value = defaultSheet;
    loadRamSheet(defaultSheet);
  };
  reader.readAsArrayBuffer(file);
});

sheetSelect.addEventListener('change', function(e) {
  if (currentWorkbook) {
    loadRamSheet(e.target.value);
  }
});

function loadRamSheet(sheetName) {
  currentSheetTitle.textContent = `ตารางวิเคราะห์ RAM: ระบบ ${sheetName}`;
  const sheet = currentWorkbook.Sheets[sheetName];
  
  // แปลงข้อมูลเป็น JSON Object
  const rows = XLSX.utils.sheet_to_json(sheet);

  if (rows.length === 0) {
    tableContainer.innerHTML = '<p style="padding: 20px; text-align: center;">ไม่มีข้อมูลในระบบนี้</p>';
    resetMetrics();
    return;
  }

  // คำนวณค่า RAM Metrics
  let totalMtbf = 0, countMtbf = 0;
  let totalMttr = 0, countMttr = 0;
  let totalAvail = 0, countAvail = 0;

  rows.forEach(r => {
    // ดึงค่า MTBF, MTTR, Availability (ป้องกัน whitespace ในชื่อคอลัมน์)
    const mtbfKey = Object.keys(r).find(k => k.trim().toUpperCase() === 'MTBF');
    const mttrKey = Object.keys(r).find(k => k.trim().toUpperCase() === 'MTTR');
    const availKey = Object.keys(r).find(k => k.trim().toUpperCase() === 'AVAILABILITY');

    if (mtbfKey && !isNaN(r[mtbfKey])) {
      totalMtbf += Number(r[mtbfKey]);
      countMtbf++;
    }
    if (mttrKey && !isNaN(r[mttrKey])) {
      totalMttr += Number(r[mttrKey]);
      countMttr++;
    }
    if (availKey && !isNaN(r[availKey])) {
      totalAvail += Number(r[availKey]);
      countAvail++;
    }
  });

  // อัปเดตตัวเลขแสดงผลบน Dashboard
  totalModesElem.textContent = rows.length.toLocaleString();
  avgMtbfElem.textContent = countMtbf > 0 ? Math.round(totalMtbf / countMtbf).toLocaleString() : '-';
  avgMttrElem.textContent = countMttr > 0 ? (totalMttr / countMttr).toFixed(1) : '-';
  avgAvailElem.textContent = countAvail > 0 ? ((totalAvail / countAvail) * 100).toFixed(4) + '%' : '-';

  // แปลงและแสดงผล HTML Table
  const htmlTable = XLSX.utils.sheet_to_html(sheet, { id: 'ramTable' });
  tableContainer.innerHTML = htmlTable;
}

function resetMetrics() {
  avgAvailElem.textContent = '-%';
  avgMtbfElem.textContent = '-';
  avgMttrElem.textContent = '-';
  totalModesElem.textContent = '0';
}

// ระบบค้นหา Real-time
searchInput.addEventListener('input', function(e) {
  const query = e.target.value.toLowerCase();
  const trs = document.querySelectorAll('#ramTable tr');

  trs.forEach((tr, idx) => {
    if (idx === 0 || tr.querySelector('th')) return;
    const text = tr.textContent.toLowerCase();
    tr.style.display = text.includes(query) ? '' : 'none';
  });
});
