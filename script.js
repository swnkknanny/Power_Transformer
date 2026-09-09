let currentWorkbook = null;
let currentChart = null;
let currentActiveFilter = 'all';

// รหัสผ่านแอดมิน
const ADMIN_PASSWORD = '13102547'; 
let isAdmin = false;

// การตั้งค่า IndexedDB (พื้นที่เก็บไฟล์ขนาดใหญ่ ไม่จำกัด 5MB แบบ localStorage)
const DB_NAME = 'RAM_DASHBOARD_DB';
const DB_VERSION = 1;
const STORE_NAME = 'excel_files';
const DEFAULT_EXCEL_FILE = 'ALL_RAM.xlsx';

// DOM Elements
const fileInput = document.getElementById('excelFile');
const sheetSelect = document.getElementById('sheetSelect');
const tableContainer = document.getElementById('tableContainer');
const currentSheetTitle = document.getElementById('currentSheetTitle');
const searchInput = document.getElementById('searchInput');
const editNotice = document.getElementById('editNotice');
const modeBadge = document.getElementById('modeBadge');

const adminUploadWidget = document.getElementById('adminUploadWidget');
const saveExcelBtn = document.getElementById('saveExcelBtn');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userProfile = document.getElementById('userProfile');

const loginModal = document.getElementById('loginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const cancelLoginModal = document.getElementById('cancelLoginModal');
const submitLoginBtn = document.getElementById('submitLoginBtn');
const adminPasswordInput = document.getElementById('adminPassword');
const loginError = document.getElementById('loginError');

const exportModal = document.getElementById('exportModal');
const openExportModalBtn = document.getElementById('openExportModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const confirmPrintBtn = document.getElementById('confirmPrintBtn');
const sheetOptionsList = document.getElementById('sheetOptionsList');
const printContainer = document.getElementById('printContainer');

const avgAvailElem = document.getElementById('avgAvail');
const avgMtbfElem = document.getElementById('avgMtbf');
const avgMttrElem = document.getElementById('avgMttr');
const totalModesElem = document.getElementById('totalModes');
const worstAvailElem = document.getElementById('worstAvail');
const worstMttrElem = document.getElementById('worstMttr');

/* ============================================================
   ระบบจัดเก็บข้อมูลถาวรด้วย IndexedDB
   ============================================================ */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = function(e) {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveWorkbookToDB(arrayBuffer) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(arrayBuffer, 'current_workbook');
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('บันทึกลง IndexedDB ไม่สำเร็จ:', err);
  }
}

async function loadWorkbookFromDB() {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get('current_workbook');
    return new Promise((resolve) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}

// 1. ตรวจสอบไฟล์เมื่อเปิดหน้าเว็บ: IndexedDB -> ALL_RAM.xlsx เริ่มต้น
async function initDashboardData() {
  // ลองดึงจาก IndexedDB ก่อน
  const savedData = await loadWorkbookFromDB();
  if (savedData) {
    handleWorkbookData(savedData, false);
    return;
  }

  // ถ้าไม่มี ให้ลองดึง ALL_RAM.xlsx จาก GitHub
  try {
    const response = await fetch(DEFAULT_EXCEL_FILE);
    if (!response.ok) throw new Error('File not detected');
    const arrayBuffer = await response.arrayBuffer();
    handleWorkbookData(arrayBuffer, true); // บันทึกลง DB เลยเพื่อความรวดเร็วครั้งต่อไป
  } catch (err) {
    showManualUploadPrompt();
  }
}

function showManualUploadPrompt() {
  tableContainer.innerHTML = `
    <div class="empty-state" style="cursor: pointer;" onclick="document.getElementById('excelFile').click()">
      <i class="fa-solid fa-cloud-arrow-up" style="font-size: 2.4rem; color: #8E7C93; margin-bottom: 12px;"></i>
      <p style="font-weight: 600; color: #343A40; margin-bottom: 4px;">เลือกไฟล์ข้อมูล (ALL_RAM.xlsx)</p>
      <span style="font-size: 0.75rem; color: #888E94;">คลิกที่นี่เพื่อนำเข้าไฟล์ข้อมูลสำหรับเริ่มประมวลผล</span>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', initDashboardData);

function handleWorkbookData(data, shouldSave = true) {
  currentWorkbook = XLSX.read(data, { type: 'array' });

  if (shouldSave) {
    saveWorkbookToDB(data);
  }

  sheetSelect.innerHTML = '';
  currentWorkbook.SheetNames.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = `ระบบ: ${name}`;
    sheetSelect.appendChild(option);
  });

  const defaultSheet = currentWorkbook.SheetNames.includes('TR') ? 'TR' : currentWorkbook.SheetNames[0];
  sheetSelect.value = defaultSheet;
  loadRamSheet(defaultSheet);
}

// เมื่อมีการเลือกไฟล์ใหม่
fileInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    handleWorkbookData(evt.target.result, true); // บันทึกลง IndexedDB ทันที
  };
  reader.readAsArrayBuffer(file);
});

sheetSelect.addEventListener('change', function(e) {
  if (currentWorkbook) {
    loadRamSheet(e.target.value);
  }
});

/* ============================================================
   ระบบตรวจสอบสิทธิ์แอดมิน (Admin Authentication)
   ============================================================ */
loginBtn.addEventListener('click', () => {
  loginModal.classList.add('show');
  adminPasswordInput.value = '';
  loginError.style.display = 'none';
  adminPasswordInput.focus();
});

function closeLogin() {
  loginModal.classList.remove('show');
}
closeLoginModal.addEventListener('click', closeLogin);
cancelLoginModal.addEventListener('click', closeLogin);

submitLoginBtn.addEventListener('click', checkAdminPassword);
adminPasswordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkAdminPassword();
});

function checkAdminPassword() {
  if (adminPasswordInput.value === ADMIN_PASSWORD) {
    isAdmin = true;
    updateAuthUI();
    closeLogin();
    if (currentWorkbook) loadRamSheet(sheetSelect.value);
  } else {
    loginError.style.display = 'block';
  }
}

logoutBtn.addEventListener('click', () => {
  isAdmin = false;
  updateAuthUI();
  if (currentWorkbook) loadRamSheet(sheetSelect.value);
});

function updateAuthUI() {
  if (isAdmin) {
    loginBtn.style.display = 'none';
    userProfile.style.display = 'flex';
    adminUploadWidget.style.display = 'block';
    saveExcelBtn.style.display = 'flex';
    modeBadge.textContent = 'ADMIN MODE (เปิดแก้ไขข้อมูล)';
    modeBadge.classList.add('admin');
    editNotice.textContent = '✏️ โหมดแอดมิน: แก้ไขข้อมูลได้โดยตรง ระบบจะจำค่าอัตโนมัติ';
    editNotice.style.color = '#8E7C93';
  } else {
    loginBtn.style.display = 'flex';
    userProfile.style.display = 'none';
    adminUploadWidget.style.display = 'none';
    saveExcelBtn.style.display = 'none';
    modeBadge.textContent = 'VIEWER MODE (โหมดดูข้อมูล)';
    modeBadge.classList.remove('admin');
    editNotice.textContent = 'โหมดอ่านอย่างเดียว (Viewer Mode)';
    editNotice.style.color = 'var(--text-secondary)';
  }
}

/* ============================================================
   การคำนวณและสรุปผลข้อมูลตัวชี้วัด (Metrics Engine)
   ============================================================ */
function calculateSheetMetrics(rows) {
  let totalMtbf = 0, countMtbf = 0;
  let totalMttr = 0, countMttr = 0;
  let totalAvail = 0, countAvail = 0;
  let minAvail = Infinity, minAvailItem = '-';
  let maxMttr = -Infinity, maxMttrItem = '-';
  const causeCounts = {};

  rows.forEach(r => {
    const compKey = Object.keys(r).find(k => k.trim().toUpperCase() === 'COMPONENT');
    const mtbfKey = Object.keys(r).find(k => k.trim().toUpperCase() === 'MTBF');
    const mttrKey = Object.keys(r).find(k => k.trim().toUpperCase() === 'MTTR');
    const availKey = Object.keys(r).find(k => k.trim().toUpperCase() === 'AVAILABILITY');
    const causeKey = Object.keys(r).find(k => k.trim().toUpperCase().includes('CAUSE'));

    const compName = r[compKey] || 'ไม่ระบุอุปกรณ์';

    if (mtbfKey && !isNaN(r[mtbfKey])) {
      totalMtbf += Number(r[mtbfKey]);
      countMtbf++;
    }
    if (mttrKey && !isNaN(r[mttrKey])) {
      const mttrVal = Number(r[mttrKey]);
      totalMttr += mttrVal;
      countMttr++;
      if (mttrVal > maxMttr) {
        maxMttr = mttrVal;
        maxMttrItem = `${compName} (${mttrVal} ชม.)`;
      }
    }
    if (availKey && !isNaN(r[availKey])) {
      let availVal = Number(r[availKey]);
      if (availVal <= 1) availVal = availVal * 100;
      totalAvail += availVal;
      countAvail++;
      if (availVal < minAvail) {
        minAvail = availVal;
        minAvailItem = `${compName} (${availVal.toFixed(4)}%)`;
      }
    }

    if (causeKey && r[causeKey]) {
      const rawCauses = r[causeKey].toString().split(/[,、]/);
      rawCauses.forEach(c => {
        const clean = c.trim();
        if (clean) causeCounts[clean] = (causeCounts[clean] || 0) + 1;
      });
    }
  });

  return {
    totalModes: rows.length,
    avgAvail: countAvail > 0 ? (totalAvail / countAvail).toFixed(2) : '-',
    avgMtbf: countMtbf > 0 ? Math.round(totalMtbf / countMtbf).toLocaleString() : '-',
    avgMttr: countMttr > 0 ? (totalMttr / countMttr).toFixed(1) : '-',
    minAvailItem: minAvail !== Infinity ? minAvailItem : '-',
    maxMttrItem: maxMttr !== -Infinity ? maxMttrItem : '-',
    causeCounts
  };
}

function loadRamSheet(sheetName) {
  currentSheetTitle.textContent = `ตารางวิเคราะห์การบำรุงรักษาและ RAM: ระบบ ${sheetName}`;
  const sheet = currentWorkbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet);

  if (rows.length === 0) {
    tableContainer.innerHTML = '<p style="padding: 24px; text-align: center; color: var(--text-muted);">ไม่มีรายการข้อมูลในระบบนี้</p>';
    resetMetrics();
    return;
  }

  const metrics = calculateSheetMetrics(rows);

  avgAvailElem.textContent = metrics.avgAvail !== '-' ? metrics.avgAvail + '%' : '-';
  avgAvailElem.classList.remove('status-green', 'status-red');
  if (metrics.avgAvail !== '-') {
    avgAvailElem.classList.add(parseFloat(metrics.avgAvail) >= 96 ? 'status-green' : 'status-red');
  }

  totalModesElem.textContent = metrics.totalModes.toLocaleString();
  avgMtbfElem.textContent = metrics.avgMtbf;
  avgMttrElem.textContent = metrics.avgMttr;
  worstAvailElem.textContent = metrics.minAvailItem;
  worstMttrElem.textContent = metrics.maxMttrItem;

  renderCauseChart(metrics.causeCounts);
  renderFormattedTable(sheet, sheetName);
}

/* ============================================================
   กราฟวงกลมสรุปสาเหตุ (Donut Chart)
   ============================================================ */
function renderCauseChart(causeCounts) {
  const ctx = document.getElementById('causeChart').getContext('2d');
  const sorted = Object.entries(causeCounts).sort((a, b) => b[1] - a[1]);
  const top4 = sorted.slice(0, 4);
  const others = sorted.slice(4).reduce((sum, item) => sum + item[1], 0);

  const labels = top4.map(i => i[0]);
  const data = top4.map(i => i[1]);
  if (others > 0) {
    labels.push('สาเหตุอื่นๆ');
    data.push(others);
  }

  if (currentChart) currentChart.destroy();

  currentChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          '#8E7C93',
          '#66756B',
          '#B7A58A',
          '#5F666D',
          '#C5C2BA'
        ],
        borderWidth: 2,
        borderColor: '#FFFFFF'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true,
            pointStyle: 'circle',
            font: { size: 11, family: 'Plus Jakarta Sans, Sarabun', weight: '500' },
            color: '#5F666D',
            padding: 14
          }
        },
        tooltip: {
          backgroundColor: '#343A40',
          titleFont: { size: 11, family: 'Plus Jakarta Sans, Sarabun' },
          bodyFont: { size: 11, family: 'Plus Jakarta Sans, Sarabun' },
          padding: 10,
          cornerRadius: 6
        }
      },
      cutout: '72%'
    }
  });
}

/* ============================================================
   การสร้างตารางและระบบบันทึกค่าแก้ไขถาวร
   ============================================================ */
function renderFormattedTable(sheet, sheetName) {
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  if (jsonData.length === 0) return;

  const headers = jsonData[0];
  const sampleRows = jsonData.slice(1, 15);

  const colTypes = headers.map((header, colIndex) => {
    const title = (header || '').toString().trim().toUpperCase();
    let totalLen = 0, count = 0;
    sampleRows.forEach(row => {
      const val = row[colIndex];
      if (val !== undefined && val !== null) {
        totalLen += val.toString().length;
        count++;
      }
    });
    const avgLen = count > 0 ? totalLen / count : 0;
    const isShortMetric = ['CODE', 'MTBF', 'MTTR', 'AVAILABILITY', 'ID', 'NO'].some(k => title.includes(k));
    if (isShortMetric || avgLen < 12) return 'col-compact';
    return 'col-expand';
  });

  const availColIndex = headers.findIndex(h => h && h.toString().trim().toUpperCase() === 'AVAILABILITY');
  const mttrColIndex = headers.findIndex(h => h && h.toString().trim().toUpperCase() === 'MTTR');

  let tableHtml = '<table id="ramTable"><thead><tr>';
  headers.forEach((h, idx) => {
    tableHtml += `<th class="${colTypes[idx]}">${h || ''}</th>`;
  });
  tableHtml += '</tr></thead><tbody>';

  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    let rowAvail = 100, rowMttr = 0;

    if (availColIndex !== -1 && row[availColIndex] !== undefined) {
      let v = Number(row[availColIndex]);
      rowAvail = v <= 1 ? v * 100 : v;
    }
    if (mttrColIndex !== -1 && row[mttrColIndex] !== undefined) {
      rowMttr = Number(row[mttrColIndex]);
    }

    tableHtml += `<tr data-row="${i}" data-avail="${rowAvail}" data-mttr="${rowMttr}">`;
    for (let j = 0; j < headers.length; j++) {
      let cellValue = row[j] !== undefined ? row[j] : '';
      const colClass = colTypes[j];
      const editableAttr = isAdmin ? 'contenteditable="true"' : '';

      if (j === availColIndex && !isNaN(cellValue) && cellValue !== '') {
        const valNum = Number(cellValue);
        const percentVal = valNum <= 1 ? valNum * 100 : valNum;
        const badgeClass = percentVal >= 96 ? 'badge-pass' : 'badge-fail';
        tableHtml += `<td class="${colClass}" data-col="${j}"><span class="${badgeClass}">${percentVal.toFixed(4)}%</span></td>`;
      } else {
        tableHtml += `<td class="${colClass}" data-col="${j}" ${editableAttr}>${cellValue}</td>`;
      }
    }
    tableHtml += '</tr>';
  }

  tableHtml += '</tbody></table>';
  tableContainer.innerHTML = tableHtml;

  if (isAdmin) {
    bindCellEditEvents(sheetName);
  }

  applyTableFilter();
}

function bindCellEditEvents(sheetName) {
  const editableCells = document.querySelectorAll('#ramTable td[contenteditable="true"]');
  editableCells.forEach(cell => {
    cell.addEventListener('blur', function() {
      const rowIdx = parseInt(this.parentElement.getAttribute('data-row'));
      const colIdx = parseInt(this.getAttribute('data-col'));
      const newVal = this.textContent.trim();

      const sheet = currentWorkbook.Sheets[sheetName];
      const cellAddress = XLSX.utils.encode_cell({ r: rowIdx, c: colIdx });

      if (!sheet[cellAddress]) sheet[cellAddress] = {};
      sheet[cellAddress].v = !isNaN(newVal) && newVal !== '' ? Number(newVal) : newVal;
      sheet[cellAddress].t = !isNaN(newVal) && newVal !== '' ? 'n' : 's';

      // บันทึกลง IndexedDB ถาวร
      const updatedArray = XLSX.write(currentWorkbook, { bookType: 'xlsx', type: 'array' });
      saveWorkbookToDB(updatedArray);

      // คำนวณ KPI ใหม่ทันที
      const updatedRows = XLSX.utils.sheet_to_json(sheet);
      const metrics = calculateSheetMetrics(updatedRows);
      avgAvailElem.textContent = metrics.avgAvail !== '-' ? metrics.avgAvail + '%' : '-';
      avgMtbfElem.textContent = metrics.avgMtbf;
      avgMttrElem.textContent = metrics.avgMttr;
    });
  });
}

saveExcelBtn.addEventListener('click', function() {
  if (!currentWorkbook) return;
  XLSX.writeFile(currentWorkbook, 'Substation_RAM_Intelligence_Export.xlsx');
});

function resetMetrics() {
  avgAvailElem.textContent = '-%';
  avgAvailElem.classList.remove('status-green', 'status-red');
  avgMtbfElem.textContent = '-';
  avgMttrElem.textContent = '-';
  totalModesElem.textContent = '0';
  worstAvailElem.textContent = '-';
  worstMttrElem.textContent = '-';
  if (currentChart) currentChart.destroy();
}

function applyTableFilter() {
  const query = searchInput.value.toLowerCase();
  const trs = document.querySelectorAll('#ramTable tbody tr');

  trs.forEach(tr => {
    const text = tr.textContent.toLowerCase();
    const avail = parseFloat(tr.getAttribute('data-avail'));
    const mttr = parseFloat(tr.getAttribute('data-mttr'));

    const matchesSearch = text.includes(query);
    let matchesFilter = true;

    if (currentActiveFilter === 'critical') matchesFilter = avail < 96;
    else if (currentActiveFilter === 'high-mttr') matchesFilter = mttr > 10;

    tr.style.display = (matchesSearch && matchesFilter) ? '' : 'none';
  });
}

searchInput.addEventListener('input', applyTableFilter);

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentActiveFilter = this.getAttribute('data-filter');
    applyTableFilter();
  });
});

/* ============================================================
   การสร้างหน้าสำหรับ Export PDF / สั่งพิมพ์
   ============================================================ */
openExportModalBtn.addEventListener('click', function() {
  if (!currentWorkbook) {
    alert('กรุณารอโหลดข้อมูลให้สมบูรณ์ก่อนสร้างรายงาน');
    return;
  }

  const currentSheet = sheetSelect.value;
  sheetOptionsList.innerHTML = '';

  const currentOption = `
    <label class="sheet-radio-item">
      <input type="radio" name="printSheetTarget" value="${currentSheet}" checked />
      <span><strong>ระบบที่กำลังเปิดดูอยู่ (${currentSheet})</strong></span>
    </label>
  `;
  sheetOptionsList.insertAdjacentHTML('beforeend', currentOption);

  currentWorkbook.SheetNames.forEach(name => {
    if (name !== currentSheet) {
      const item = `
        <label class="sheet-radio-item">
          <input type="radio" name="printSheetTarget" value="${name}" />
          <span>ระบบ: ${name}</span>
        </label>
      `;
      sheetOptionsList.insertAdjacentHTML('beforeend', item);
    }
  });

  const allOption = `
    <label class="sheet-radio-item" style="border-top: 1px dashed var(--border-divider); margin-top: 8px; padding-top: 12px;">
      <input type="radio" name="printSheetTarget" value="__ALL__" />
      <span><strong>ทุกระบบพร้อมกัน (All Subsystems)</strong></span>
    </label>
  `;
  sheetOptionsList.insertAdjacentHTML('beforeend', allOption);

  exportModal.classList.add('show');
});

function closeModal() { exportModal.classList.remove('show'); }
closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);

confirmPrintBtn.addEventListener('click', function() {
  const selectedRadio = document.querySelector('input[name="printSheetTarget"]:checked');
  if (!selectedRadio) return;

  const targetSheet = selectedRadio.value;
  closeModal();
  buildPrintView(targetSheet);

  setTimeout(() => { window.print(); }, 300);
});

function buildPrintView(targetSheet) {
  printContainer.innerHTML = '';
  const sheetsToPrint = targetSheet === '__ALL__' ? currentWorkbook.SheetNames : [targetSheet];

  sheetsToPrint.forEach(sName => {
    const sheet = currentWorkbook.Sheets[sName];
    const rows = XLSX.utils.sheet_to_json(sheet);
    const metrics = calculateSheetMetrics(rows);

    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    if (jsonData.length === 0) return;

    const headers = jsonData[0];
    const availColIndex = headers.findIndex(h => h && h.toString().trim().toUpperCase() === 'AVAILABILITY');

    let pageHtml = `
      <div class="print-page">
        <div class="print-header">
          <div>
            <h2>รายงานการวิเคราะห์การบำรุงรักษาและ RAM: ระบบ ${sName}</h2>
            <span style="font-size: 0.72rem; color: #666;">Substation Reliability, Availability & Maintenance Performance Data</span>
          </div>
          <div class="meta">
            <div>ผู้จัดทำ: <strong>Suwanan K. (วิศวกรความน่าเชื่อถือ)</strong></div>
            <div>วันที่ออกรายงาน: ${new Date().toLocaleDateString('th-TH')}</div>
          </div>
        </div>

        <div class="print-kpi-grid">
          <div class="print-kpi-item">
            <span>ความพร้อมใช้งานเฉลี่ย (เป้าหมาย ≥ 96%)</span>
            <strong>${metrics.avgAvail !== '-' ? metrics.avgAvail + '%' : '-'}</strong>
          </div>
          <div class="print-kpi-item">
            <span>ระยะเวลาเฉลี่ยก่อนเกิดความเสียหาย (MTBF)</span>
            <strong>${metrics.avgMtbf} ชม.</strong>
          </div>
          <div class="print-kpi-item">
            <span>ระยะเวลาเฉลี่ยในการบำรุงรักษา (MTTR)</span>
            <strong>${metrics.avgMttr} ชม.</strong>
          </div>
          <div class="print-kpi-item">
            <span>จำนวนลักษณะข้อบกพร่องทั้งหมด</span>
            <strong>${metrics.totalModes} รายการ</strong>
          </div>
        </div>

        <table class="print-table">
          <thead><tr>
    `;

    headers.forEach(h => { pageHtml += `<th>${h || ''}</th>`; });
    pageHtml += `</tr></thead><tbody>`;

    for (let i = 1; i < jsonData.length; i++) {
      const r = jsonData[i];
      pageHtml += `<tr>`;
      for (let j = 0; j < headers.length; j++) {
        let val = r[j] !== undefined ? r[j] : '';
        if (j === availColIndex && !isNaN(val) && val !== '') {
          const num = Number(val);
          const pVal = num <= 1 ? num * 100 : num;
          const color = pVal >= 96 ? '#66756B' : '#A65D57';
          pageHtml += `<td style="color: ${color}; font-weight: bold; text-align: center;">${pVal.toFixed(4)}%</td>`;
        } else {
          pageHtml += `<td>${val}</td>`;
        }
      }
      pageHtml += `</tr>`;
    }

    pageHtml += `</tbody></table></div>`;
    printContainer.insertAdjacentHTML('beforeend', pageHtml);
  });
}
