// ============================================================
// FIREBASE CONFIGURATION & INITIALIZATION
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyBqx1bOZmefAAftxirrlEjwWR8_-6gB0sQ",
  authDomain: "ram-substation.firebaseapp.com",
  projectId: "ram-substation",
  storageBucket: "ram-substation.firebasestorage.app",
  messagingSenderId: "937237145244",
  appId: "1:937237145244:web:8f554a10a8dcbba2306f59",
  measurementId: "G-NCSL5VJNYM"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const RAM_DOC_REF = db.collection('substation_data').doc('active_workbook');

let currentWorkbook = null;
let currentChart = null;
let currentActiveFilter = 'all';

// Admin Gateway Credentials
const ADMIN_PASSWORD = '13102547'; 
let isAdmin = false;

const DEFAULT_EXCEL_FILE = 'ALL_RAM.xlsx';

// Drill-Down Navigation State
const drillHistory = [];
let activeSegmentIndex = null;

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

// Drawer Elements
const detailDrawer = document.getElementById('detailDrawer');
const drawerBackdrop = document.getElementById('drawerBackdrop');
const drawerCloseBtn = document.getElementById('drawerCloseBtn');
const drawerBackBtn = document.getElementById('drawerBackBtn');
const drawerContent = document.getElementById('drawerContent');
const drawerLevelTag = document.getElementById('drawerLevelTag');

// ============================================================
// REALTIME FIREBASE SYNC ENGINE
// ============================================================
function initRealtimeCloudSync() {
  RAM_DOC_REF.onSnapshot((doc) => {
    if (doc.exists && doc.data().fileData) {
      const base64Data = doc.data().fileData;
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      handleWorkbookData(byteArray, false);
    } else {
      fetchDefaultRepoFile();
    }
  }, (error) => {
    console.warn('Firestore snapshot error, falling back to local file:', error);
    fetchDefaultRepoFile();
  });
}

async function fetchDefaultRepoFile() {
  try {
    const response = await fetch(DEFAULT_EXCEL_FILE);
    if (!response.ok) throw new Error('Default file missing');
    const arrayBuffer = await response.arrayBuffer();
    handleWorkbookData(new Uint8Array(arrayBuffer), true);
  } catch (err) {
    showManualUploadPrompt();
  }
}

async function syncWorkbookToCloud() {
  if (!currentWorkbook) return;
  try {
    const base64Data = XLSX.write(currentWorkbook, { bookType: 'xlsx', type: 'base64' });
    await RAM_DOC_REF.set({
      fileData: base64Data,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy: 'Suwanan K.'
    });
  } catch (err) {
    console.error('Error syncing dataset to Firebase:', err);
  }
}

function showManualUploadPrompt() {
  tableContainer.innerHTML = `
    <div class="empty-state" style="cursor: pointer;" onclick="document.getElementById('excelFile').click()">
      <i class="fa-solid fa-cloud-arrow-up" style="font-size: 2.4rem; color: #8E7C93; margin-bottom: 12px;"></i>
      <p style="font-weight: 600; color: #343A40; margin-bottom: 4px;">Initialize Substation Dataset (ALL_RAM.xlsx)</p>
      <span style="font-size: 0.75rem; color: #888E94;">Click here to upload and publish data live to all connected devices</span>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', initRealtimeCloudSync);

function handleWorkbookData(data, shouldPublishToCloud = false) {
  currentWorkbook = XLSX.read(data, { type: 'array' });

  if (shouldPublishToCloud) {
    syncWorkbookToCloud();
  }

  const prevSelected = sheetSelect.value;
  sheetSelect.innerHTML = '';
  currentWorkbook.SheetNames.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = `Subsystem: ${name}`;
    sheetSelect.appendChild(option);
  });

  const targetSheet = (prevSelected && currentWorkbook.SheetNames.includes(prevSelected))
    ? prevSelected
    : (currentWorkbook.SheetNames.includes('TR') ? 'TR' : currentWorkbook.SheetNames[0]);

  sheetSelect.value = targetSheet;
  loadRamSheet(targetSheet);

  if (detailDrawer.classList.contains('open') && drillHistory.length > 0) {
    const currentView = drillHistory[drillHistory.length - 1];
    renderDrillView(currentView, false);
  }
}

fileInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    handleWorkbookData(new Uint8Array(evt.target.result), true);
  };
  reader.readAsArrayBuffer(file);
});

sheetSelect.addEventListener('change', function(e) {
  if (currentWorkbook) {
    loadRamSheet(e.target.value);
    closeDrawer();
  }
});

/* ============================================================
   ADMIN AUTHENTICATION
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
    modeBadge.textContent = 'ADMIN CONSOLE (LIVE CLOUD EDIT)';
    modeBadge.classList.add('admin');
    editNotice.textContent = 'Active Cloud Edit Mode: MTBF/MTTR edits auto-calculate Availability';
    editNotice.style.color = '#8E7C93';
  } else {
    loginBtn.style.display = 'flex';
    userProfile.style.display = 'none';
    adminUploadWidget.style.display = 'none';
    saveExcelBtn.style.display = 'none';
    modeBadge.textContent = 'VIEWER CONSOLE';
    modeBadge.classList.remove('admin');
    editNotice.textContent = 'Read-Only Observation Mode';
    editNotice.style.color = 'var(--text-secondary)';
  }
}

/* ============================================================
   CORE METRICS ENGINE & AUTO-CALCULATE RAM FORMULA
   ============================================================ */
function calculateAvailabilityFormula(mtbf, mttr) {
  if (mtbf + mttr === 0) return 100;
  // Availability = MTBF / (MTBF + MTTR) * 100%
  return (mtbf / (mtbf + mttr)) * 100;
}

function getNormalizedRows(sheetName) {
  if (!currentWorkbook || !currentWorkbook.Sheets[sheetName]) return [];
  const sheet = currentWorkbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json(sheet);

  return rawRows.map((r, index) => {
    const compKey = Object.keys(r).find(k => k.trim().toUpperCase() === 'COMPONENT');
    const idKey = Object.keys(r).find(k => ['ID', 'CODE', 'EQUIPMENT ID', 'NO'].some(token => k.trim().toUpperCase().includes(token)));
    const mtbfKey = Object.keys(r).find(k => k.trim().toUpperCase() === 'MTBF');
    const mttrKey = Object.keys(r).find(k => k.trim().toUpperCase() === 'MTTR');
    const availKey = Object.keys(r).find(k => k.trim().toUpperCase() === 'AVAILABILITY');
    const causeKey = Object.keys(r).find(k => k.trim().toUpperCase().includes('CAUSE'));
    const modeKey = Object.keys(r).find(k => k.trim().toUpperCase().includes('MODE'));

    const mtbfVal = mtbfKey && !isNaN(r[mtbfKey]) ? Number(r[mtbfKey]) : 0;
    const mttrVal = mttrKey && !isNaN(r[mttrKey]) ? Number(r[mttrKey]) : 0;

    // คำนวณ Availability อัตโนมัติจาก MTBF และ MTTR ถ้ามีค่า หรืออ่านจาก Sheet
    let availVal = 100;
    if (mtbfVal > 0 || mttrVal > 0) {
      availVal = calculateAvailabilityFormula(mtbfVal, mttrVal);
    } else if (availKey && !isNaN(r[availKey])) {
      const parsed = Number(r[availKey]);
      availVal = parsed <= 1 ? parsed * 100 : parsed;
    }

    const compName = compKey && r[compKey] ? String(r[compKey]).trim() : 'Unassigned Equipment';
    const compId = idKey && r[idKey] ? String(r[idKey]).trim() : `EQ-${index + 1}`;
    const failureCause = causeKey && r[causeKey] ? String(r[causeKey]).trim() : 'General Aging / Operational Stress';
    const failureMode = modeKey && r[modeKey] ? String(r[modeKey]).trim() : 'Functional Failure';

    return {
      rowIndex: index + 1,
      id: compId,
      component: compName,
      mtbf: Number(mtbfVal.toFixed(2)),
      mttr: Number(mttrVal.toFixed(2)),
      availability: Number(availVal.toFixed(2)),
      cause: failureCause,
      mode: failureMode,
      subsystem: sheetName,
      isAttention: availVal < 96 || mttrVal > 10
    };
  });
}

function calculateSheetMetrics(rows) {
  let totalMtbf = 0, countMtbf = 0;
  let totalMttr = 0, countMttr = 0;
  let totalAvail = 0, countAvail = 0;
  let minAvail = Infinity, minAvailItem = '-';
  let maxMttr = -Infinity, maxMttrItem = '-';
  const causeCounts = {};

  rows.forEach(r => {
    if (r.mtbf > 0) {
      totalMtbf += r.mtbf;
      countMtbf++;
    }
    if (r.mttr > 0) {
      totalMttr += r.mttr;
      countMttr++;
      if (r.mttr > maxMttr) {
        maxMttr = r.mttr;
        maxMttrItem = `${r.component} (${r.mttr.toFixed(2)} hrs)`;
      }
    }
    if (r.availability > 0) {
      totalAvail += r.availability;
      countAvail++;
      if (r.availability < minAvail) {
        minAvail = r.availability;
        minAvailItem = `${r.component} (${r.availability.toFixed(2)}%)`;
      }
    }

    if (r.cause) {
      const rawCauses = r.cause.split(/[,、]/);
      rawCauses.forEach(c => {
        const clean = c.trim();
        if (clean) causeCounts[clean] = (causeCounts[clean] || 0) + 1;
      });
    }
  });

  return {
    totalModes: rows.length,
    avgAvail: countAvail > 0 ? (totalAvail / countAvail).toFixed(2) : '-',
    avgMtbf: countMtbf > 0 ? (totalMtbf / countMtbf).toFixed(2) : '-',
    avgMttr: countMttr > 0 ? (totalMttr / countMttr).toFixed(2) : '-',
    minAvailItem: minAvail !== Infinity ? minAvailItem : '-',
    maxMttrItem: maxMttr !== -Infinity ? maxMttrItem : '-',
    causeCounts
  };
}

function loadRamSheet(sheetName) {
  currentSheetTitle.textContent = `Diagnostic Matrix: Subsystem ${sheetName}`;
  const rows = getNormalizedRows(sheetName);

  if (rows.length === 0) {
    tableContainer.innerHTML = '<p style="padding: 24px; text-align: center; color: var(--text-muted);">No records registered for this subsystem domain.</p>';
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
  renderFormattedTable(currentWorkbook.Sheets[sheetName], sheetName);
}

/* ============================================================
   CHART.JS ROOT CAUSE DONUT
   ============================================================ */
function renderCauseChart(causeCounts) {
  const ctx = document.getElementById('causeChart').getContext('2d');
  const sorted = Object.entries(causeCounts).sort((a, b) => b[1] - a[1]);
  const top4 = sorted.slice(0, 4);
  const others = sorted.slice(4).reduce((sum, item) => sum + item[1], 0);

  const labels = top4.map(i => i[0]);
  const data = top4.map(i => i[1]);
  if (others > 0) {
    labels.push('Other Determinants');
    data.push(others);
  }

  if (currentChart) currentChart.destroy();

  const chartColors = ['#8E7C93', '#66756B', '#B7A58A', '#5F666D', '#C5C2BA'];

  currentChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: chartColors,
        hoverOffset: 6,
        borderWidth: 2,
        borderColor: '#FFFFFF'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      onClick: (event, elements) => {
        if (elements && elements.length > 0) {
          const index = elements[0].index;
          activeSegmentIndex = index;
          const clickedCategory = labels[index];
          openDrillCategory(clickedCategory);
        }
      },
      onHover: (event, chartElement) => {
        event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
      },
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
          titleFont: { size: 11, family: 'Plus Jakarta Sans' },
          bodyFont: { size: 11, family: 'Plus Jakarta Sans' },
          padding: 10,
          cornerRadius: 6,
          callbacks: {
            afterLabel: () => 'Click to drill down'
          }
        }
      },
      cutout: '72%'
    }
  });
}

/* ============================================================
   TABLE RENDERING & LIVE AUTO-CALCULATION
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
  const mtbfColIndex = headers.findIndex(h => h && h.toString().trim().toUpperCase() === 'MTBF');
  const mttrColIndex = headers.findIndex(h => h && h.toString().trim().toUpperCase() === 'MTTR');
  const compColIndex = headers.findIndex(h => h && h.toString().trim().toUpperCase() === 'COMPONENT');

  let tableHtml = '<table id="ramTable"><thead><tr>';
  headers.forEach((h, idx) => {
    tableHtml += `<th class="${colTypes[idx]}">${h || ''}</th>`;
  });
  tableHtml += '</tr></thead><tbody>';

  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    let rowMtbf = mtbfColIndex !== -1 && !isNaN(row[mtbfColIndex]) ? Number(row[mtbfColIndex]) : 0;
    let rowMttr = mttrColIndex !== -1 && !isNaN(row[mttrColIndex]) ? Number(row[mttrColIndex]) : 0;
    
    // คำนวณ Availability 2 ตำแหน่ง
    let rowAvail = (rowMtbf > 0 || rowMttr > 0) 
      ? calculateAvailabilityFormula(rowMtbf, rowMttr)
      : (availColIndex !== -1 && !isNaN(row[availColIndex]) ? (Number(row[availColIndex]) <= 1 ? Number(row[availColIndex]) * 100 : Number(row[availColIndex])) : 100);

    const componentName = compColIndex !== -1 && row[compColIndex] ? String(row[compColIndex]) : `Equipment #${i}`;

    tableHtml += `<tr data-row="${i}" data-component="${encodeURIComponent(componentName)}" data-avail="${rowAvail.toFixed(2)}" data-mttr="${rowMttr.toFixed(2)}">`;
    for (let j = 0; j < headers.length; j++) {
      let cellValue = row[j] !== undefined ? row[j] : '';
      const colClass = colTypes[j];
      
      // ช่อง Availability จะเป็น Auto-calculated ห้ามพิมพ์เอง
      const isCalculatedCol = (j === availColIndex);
      const editableAttr = (isAdmin && !isCalculatedCol) ? 'contenteditable="true"' : '';

      if (j === availColIndex) {
        const badgeClass = rowAvail >= 96 ? 'badge-pass' : 'badge-fail';
        tableHtml += `<td class="${colClass} cell-avail" data-col="${j}"><span class="${badgeClass}">${rowAvail.toFixed(2)}%</span></td>`;
      } else if (j === mtbfColIndex || j === mttrColIndex) {
        const numVal = !isNaN(cellValue) && cellValue !== '' ? Number(cellValue).toFixed(2) : cellValue;
        tableHtml += `<td class="${colClass}" data-col="${j}" ${editableAttr}>${numVal}</td>`;
      } else {
        tableHtml += `<td class="${colClass}" data-col="${j}" ${editableAttr}>${cellValue}</td>`;
      }
    }
    tableHtml += '</tr>';
  }

  tableHtml += '</tbody></table>';
  tableContainer.innerHTML = tableHtml;

  // Row click listener for Level 3 Equipment Drill
  document.querySelectorAll('#ramTable tbody tr').forEach(tr => {
    tr.addEventListener('click', function(e) {
      if (isAdmin && e.target.hasAttribute('contenteditable')) return;
      const compName = decodeURIComponent(this.getAttribute('data-component'));
      openDrillEquipment(compName);
    });
  });

  if (isAdmin) {
    bindCellEditEvents(sheetName, headers, mtbfColIndex, mttrColIndex, availColIndex);
  }

  applyTableFilter();
}

function bindCellEditEvents(sheetName, headers, mtbfColIndex, mttrColIndex, availColIndex) {
  const editableCells = document.querySelectorAll('#ramTable td[contenteditable="true"]');
  editableCells.forEach(cell => {
    cell.addEventListener('blur', function() {
      const rowIdx = parseInt(this.parentElement.getAttribute('data-row'));
      const colIdx = parseInt(this.getAttribute('data-col'));
      const newVal = this.textContent.trim();

      const sheet = currentWorkbook.Sheets[sheetName];
      const cellAddress = XLSX.utils.encode_cell({ r: rowIdx, c: colIdx });

      if (!sheet[cellAddress]) sheet[cellAddress] = {};
      sheet[cellAddress].v = !isNaN(newVal) && newVal !== '' ? Number(Number(newVal).toFixed(2)) : newVal;
      sheet[cellAddress].t = !isNaN(newVal) && newVal !== '' ? 'n' : 's';

      // ============================================================
      // LIVE AUTO-CALCULATION: เมื่อแก้ MTBF หรือ MTTR
      // ============================================================
      if (colIdx === mtbfColIndex || colIdx === mttrColIndex) {
        const mtbfAddr = XLSX.utils.encode_cell({ r: rowIdx, c: mtbfColIndex });
        const mttrAddr = XLSX.utils.encode_cell({ r: rowIdx, c: mttrColIndex });
        const currentMtbf = sheet[mtbfAddr] && !isNaN(sheet[mtbfAddr].v) ? Number(sheet[mtbfAddr].v) : 0;
        const currentMttr = sheet[mttrAddr] && !isNaN(sheet[mttrAddr].v) ? Number(sheet[mttrAddr].v) : 0;

        const newAvail = calculateAvailabilityFormula(currentMtbf, currentMttr);

        // บันทึก Availability กลับลง Sheet เพื่อซิงค์ขึ้น Cloud
        if (availColIndex !== -1) {
          const availAddr = XLSX.utils.encode_cell({ r: rowIdx, c: availColIndex });
          if (!sheet[availAddr]) sheet[availAddr] = {};
          sheet[availAddr].v = Number(newAvail.toFixed(2));
          sheet[availAddr].t = 'n';
        }

        // อัปเดตการแสดงผลในแถวปัจจุบันทันที
        const rowElem = this.parentElement;
        rowElem.setAttribute('data-avail', newAvail.toFixed(2));
        rowElem.setAttribute('data-mttr', currentMttr.toFixed(2));

        const availCell = rowElem.querySelector('.cell-avail');
        if (availCell) {
          const badgeClass = newAvail >= 96 ? 'badge-pass' : 'badge-fail';
          availCell.innerHTML = `<span class="${badgeClass}">${newAvail.toFixed(2)}%</span>`;
        }
      }

      // ซิงค์ขึ้น Cloud Firestore
      syncWorkbookToCloud();

      // Recalculate KPIs ด้านบนอัตโนมัติ (ทศนิยม 2 ตำแหน่ง)
      const rows = getNormalizedRows(sheetName);
      const metrics = calculateSheetMetrics(rows);
      avgAvailElem.textContent = metrics.avgAvail !== '-' ? metrics.avgAvail + '%' : '-';
      avgAvailElem.classList.remove('status-green', 'status-red');
      if (metrics.avgAvail !== '-') {
        avgAvailElem.classList.add(parseFloat(metrics.avgAvail) >= 96 ? 'status-green' : 'status-red');
      }
      avgMtbfElem.textContent = metrics.avgMtbf;
      avgMttrElem.textContent = metrics.avgMttr;
      worstAvailElem.textContent = metrics.minAvailItem;
      worstMttrElem.textContent = metrics.maxMttrItem;
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
   DRILL-DOWN ENGINE (ALL 2 DECIMAL PLACES)
   ============================================================ */

function openDrawer() {
  detailDrawer.classList.add('open');
  drawerBackdrop.classList.add('show');
  detailDrawer.setAttribute('aria-hidden', 'false');
}

function closeDrawer() {
  detailDrawer.classList.remove('open');
  drawerBackdrop.classList.remove('show');
  detailDrawer.setAttribute('aria-hidden', 'true');
  drillHistory.length = 0;
  activeSegmentIndex = null;
}

drawerCloseBtn.addEventListener('click', closeDrawer);
drawerBackdrop.addEventListener('click', closeDrawer);

drawerBackBtn.addEventListener('click', () => {
  if (drillHistory.length > 1) {
    drillHistory.pop();
    const prevView = drillHistory[drillHistory.length - 1];
    renderDrillView(prevView, false);
  } else {
    closeDrawer();
  }
});

function pushDrillView(viewState) {
  drillHistory.push(viewState);
  renderDrillView(viewState, true);
}

function renderDrillView(viewState, shouldOpen = true) {
  drawerBackBtn.style.display = drillHistory.length > 1 ? 'inline-flex' : 'none';
  drawerLevelTag.textContent = viewState.level === 3 ? 'LEVEL 3 • EQUIPMENT DEEP-DIVE' : 'LEVEL 2 • ANALYTICAL DETAIL';

  if (viewState.type === 'category') {
    renderCategoryDetail(viewState.category);
  } else if (viewState.type === 'kpi') {
    renderKpiDetail(viewState.metric);
  } else if (viewState.type === 'equipment') {
    renderEquipmentDetail(viewState.equipmentName);
  }

  if (shouldOpen) openDrawer();
}

function openDrillCategory(categoryName) {
  pushDrillView({ type: 'category', category: categoryName, level: 2 });
}

function renderCategoryDetail(categoryName) {
  const currentSheet = sheetSelect.value;
  const allRows = getNormalizedRows(currentSheet);
  
  const isOther = categoryName === 'Other Determinants';
  const categoryRows = allRows.filter(r => {
    if (isOther) {
      return !['Electrical', 'Mechanical', 'Protection', 'Human Error'].some(top => r.cause.toLowerCase().includes(top.toLowerCase()));
    }
    return r.cause.toLowerCase().includes(categoryName.toLowerCase());
  });

  const totalFailures = categoryRows.length;
  const totalSubsystemFailures = allRows.length;
  const sharePct = totalSubsystemFailures > 0 ? ((totalFailures / totalSubsystemFailures) * 100).toFixed(2) : '0.00';
  
  const avgDowntime = totalFailures > 0
    ? (categoryRows.reduce((acc, r) => acc + r.mttr, 0) / totalFailures).toFixed(2)
    : '0.00';

  const eqMap = {};
  categoryRows.forEach(r => {
    eqMap[r.component] = (eqMap[r.component] || 0) + 1;
  });
  const sortedEq = Object.entries(eqMap).sort((a, b) => b[1] - a[1]);
  const maxEqCount = sortedEq.length > 0 ? sortedEq[0][1] : 1;

  const causeBreakdown = {};
  categoryRows.forEach(r => {
    causeBreakdown[r.cause] = (causeBreakdown[r.cause] || 0) + 1;
  });
  const sortedCauses = Object.entries(causeBreakdown).sort((a, b) => b[1] - a[1]);

  let html = `
    <div class="drawer-title-group">
      <h2>${categoryName.toUpperCase()} FAILURES</h2>
      <div class="drawer-subtitle">
        <span>${sharePct}% of Total Subsystem Incidents</span>
        <span>•</span>
        <span>Scope: Subsystem ${currentSheet}</span>
      </div>
    </div>

    <div class="drawer-kpi-strip">
      <div class="drawer-mini-kpi">
        <span>Failure Events</span>
        <strong>${totalFailures}</strong>
      </div>
      <div class="drawer-mini-kpi">
        <span>Avg Repair Downtime</span>
        <strong>${avgDowntime} hrs</strong>
      </div>
      <div class="drawer-mini-kpi">
        <span>Affected Equipment</span>
        <strong>${sortedEq.length} units</strong>
      </div>
      <div class="drawer-mini-kpi">
        <span>Subsystem Share</span>
        <strong>${sharePct}%</strong>
      </div>
    </div>

    <div class="drawer-section">
      <span class="drawer-section-title">Failures by Equipment</span>
      <div class="horizontal-bars">
  `;

  sortedEq.slice(0, 5).forEach(([comp, count]) => {
    const widthPct = Math.round((count / maxEqCount) * 100);
    html += `
      <div class="bar-row" onclick="openDrillEquipment('${encodeURIComponent(comp)}')">
        <div class="bar-row-info">
          <span>${comp}</span>
          <span>${count} event${count > 1 ? 's' : ''}</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${widthPct}%;"></div>
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>

    <div class="drawer-section">
      <span class="drawer-section-title">Top Failure Modes / Causes</span>
      <div class="horizontal-bars">
  `;

  sortedCauses.slice(0, 4).forEach(([cause, count]) => {
    html += `
      <div class="bar-row">
        <div class="bar-row-info">
          <span style="font-weight: 500;">${cause}</span>
          <span>${count}</span>
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>

    <div class="drawer-section">
      <span class="drawer-section-title">Recent Registered Events</span>
      <table class="drawer-table">
        <thead>
          <tr>
            <th>Equipment</th>
            <th>Mode</th>
            <th>MTTR</th>
          </tr>
        </thead>
        <tbody>
  `;

  categoryRows.slice(0, 6).forEach(r => {
    html += `
      <tr class="clickable" onclick="openDrillEquipment('${encodeURIComponent(r.component)}')">
        <td><strong>${r.component}</strong></td>
        <td>${r.mode}</td>
        <td>${r.mttr.toFixed(2)} hrs</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
      <button class="drawer-btn-viewall" onclick="applyCategoryFilterToMatrix('${categoryName}')">
        Filter Matrix to ${categoryName} Failures →
      </button>
    </div>
  `;

  drawerContent.innerHTML = html;
}

document.getElementById('kpiCardAvail').addEventListener('click', () => openDrillKpi('availability'));
document.getElementById('kpiCardMtbf').addEventListener('click', () => openDrillKpi('mtbf'));
document.getElementById('kpiCardMttr').addEventListener('click', () => openDrillKpi('mttr'));
document.getElementById('kpiCardModes').addEventListener('click', () => openDrillKpi('modes'));

function openDrillKpi(metric) {
  pushDrillView({ type: 'kpi', metric: metric, level: 2 });
}

function renderKpiDetail(metric) {
  const currentSheet = sheetSelect.value;
  const allRows = getNormalizedRows(currentSheet);

  let title = '';
  let sub = '';
  let sorted = [];

  if (metric === 'availability') {
    title = 'FLEET AVAILABILITY RANKING';
    sub = 'Ranked from lowest availability to highest (Target ≥ 96.00%)';
    sorted = [...allRows].sort((a, b) => a.availability - b.availability);
  } else if (metric === 'mtbf') {
    title = 'MTBF RELIABILITY SPECTRUM';
    sub = 'Ranked from lowest MTBF (highest failure rate) to highest';
    sorted = [...allRows].sort((a, b) => a.mtbf - b.mtbf);
  } else if (metric === 'mttr') {
    title = 'REPAIR LATENCY (MTTR) RANKING';
    sub = 'Ranked from highest repair duration to lowest (Limit &le; 10h)';
    sorted = [...allRows].sort((a, b) => b.mttr - a.mttr);
  } else {
    title = 'FAILURE MODE FREQUENCY';
    sub = 'Most prevalent cataloged mechanisms within current subsystem';
    sorted = [...allRows];
  }

  let html = `
    <div class="drawer-title-group">
      <h2>${title}</h2>
      <div class="drawer-subtitle">${sub}</div>
    </div>

    <div class="drawer-section">
      <span class="drawer-section-title">Equipment Diagnostic Ranks</span>
      <table class="drawer-table">
        <thead>
          <tr>
            <th>Equipment</th>
            <th>Avail</th>
            <th>MTBF</th>
            <th>MTTR</th>
          </tr>
        </thead>
        <tbody>
  `;

  sorted.forEach(r => {
    const availColor = r.availability >= 96 ? '#66756B' : '#A65D57';
    const mttrColor = r.mttr <= 10 ? 'inherit' : '#A65D57';

    html += `
      <tr class="clickable" onclick="openDrillEquipment('${encodeURIComponent(r.component)}')">
        <td><strong>${r.component}</strong><br><span style="font-size:0.65rem; color:var(--text-muted);">${r.id}</span></td>
        <td style="color:${availColor}; font-weight:700;">${r.availability.toFixed(2)}%</td>
        <td>${r.mtbf.toFixed(2)}h</td>
        <td style="color:${mttrColor}; font-weight:${r.mttr > 10 ? '700' : '500'};">${r.mttr.toFixed(2)}h</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  drawerContent.innerHTML = html;
}

document.getElementById('insightWorstAvail').addEventListener('click', () => {
  const currentSheet = sheetSelect.value;
  const rows = getNormalizedRows(currentSheet);
  if (rows.length === 0) return;
  const worst = [...rows].sort((a, b) => a.availability - b.availability)[0];
  if (worst) openDrillEquipment(worst.component);
});

document.getElementById('insightWorstMttr').addEventListener('click', () => {
  const currentSheet = sheetSelect.value;
  const rows = getNormalizedRows(currentSheet);
  if (rows.length === 0) return;
  const worst = [...rows].sort((a, b) => b.mttr - a.mttr)[0];
  if (worst) openDrillEquipment(worst.component);
});

function openDrillEquipment(rawCompName) {
  const compName = decodeURIComponent(rawCompName);
  pushDrillView({ type: 'equipment', equipmentName: compName, level: 3 });
}

function renderEquipmentDetail(compName) {
  const currentSheet = sheetSelect.value;
  const allRows = getNormalizedRows(currentSheet);
  const matchedRows = allRows.filter(r => r.component.toLowerCase() === compName.toLowerCase());
  
  if (matchedRows.length === 0) {
    drawerContent.innerHTML = `<p>Equipment details unavailable.</p>`;
    return;
  }

  const primary = matchedRows[0];
  const isAttention = primary.availability < 96 || primary.mttr > 10;
  const statusBadge = isAttention
    ? `<span class="badge-status-attention"><i class="fa-solid fa-triangle-exclamation"></i> ATTENTION REQUIRED</span>`
    : `<span class="badge-status-normal"><i class="fa-solid fa-check"></i> NORMAL OPERATIONAL</span>`;

  let html = `
    <div class="drawer-title-group">
      <h2>${primary.component}</h2>
      <div class="drawer-subtitle">
        <span>${primary.id}</span>
        <span>•</span>
        <span>Subsystem: ${currentSheet}</span>
        <span>•</span>
        ${statusBadge}
      </div>
    </div>

    <div class="drawer-kpi-strip">
      <div class="drawer-mini-kpi">
        <span>Availability</span>
        <strong style="color: ${primary.availability >= 96 ? '#66756B' : '#A65D57'};">${primary.availability.toFixed(2)}%</strong>
      </div>
      <div class="drawer-mini-kpi">
        <span>MTBF</span>
        <strong>${primary.mtbf.toFixed(2)} hrs</strong>
      </div>
      <div class="drawer-mini-kpi">
        <span>MTTR</span>
        <strong style="color: ${primary.mttr > 10 ? '#A65D57' : 'inherit'};">${primary.mttr.toFixed(2)} hrs</strong>
      </div>
      <div class="drawer-mini-kpi">
        <span>Failure Modes</span>
        <strong>${matchedRows.length}</strong>
      </div>
    </div>

    <div class="drawer-section">
      <span class="drawer-section-title">Equipment Diagnostic Details</span>
      <div style="font-size:0.78rem; line-height:1.6; color:var(--text-secondary); background:var(--surface-base); padding:14px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
        <div><strong>Primary Cause:</strong> ${primary.cause}</div>
        <div><strong>Dominant Failure Mode:</strong> ${primary.mode}</div>
        <div style="margin-top:6px; font-size:0.72rem; color:var(--text-muted);">
          ${isAttention
            ? 'Root Cause Advisory: This unit triggers an availability or MTTR breach. Recommended action: inspect insulation, contacts, and mechanical linkages.'
            : 'Performance metrics operate within designated ISO 14224 & IEEE reliability thresholds.'}
        </div>
      </div>
    </div>

    <div class="drawer-section">
      <span class="drawer-section-title">Registered Subsystem Events</span>
      <table class="drawer-table">
        <thead>
          <tr>
            <th>Mode</th>
            <th>Reported Cause</th>
            <th>Downtime</th>
          </tr>
        </thead>
        <tbody>
  `;

  matchedRows.forEach(r => {
    html += `
      <tr>
        <td><strong>${r.mode}</strong></td>
        <td>${r.cause}</td>
        <td>${r.mttr.toFixed(2)}h</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  drawerContent.innerHTML = html;
}

function applyCategoryFilterToMatrix(categoryName) {
  searchInput.value = categoryName === 'Other Determinants' ? '' : categoryName;
  applyTableFilter();
  closeDrawer();
  document.getElementById('ramTable').scrollIntoView({ behavior: 'smooth' });
}

/* ============================================================
   EXECUTIVE BRIEF PRINT ENGINE (A4 Landscape - 2 Decimals)
   ============================================================ */
openExportModalBtn.addEventListener('click', function() {
  if (!currentWorkbook) {
    alert('Please wait for system data to complete loading before generating the brief.');
    return;
  }

  const currentSheet = sheetSelect.value;
  sheetOptionsList.innerHTML = '';

  const currentOption = `
    <label class="sheet-radio-item">
      <input type="radio" name="printSheetTarget" value="${currentSheet}" checked />
      <span><strong>Active Workspace Subsystem (${currentSheet})</strong></span>
    </label>
  `;
  sheetOptionsList.insertAdjacentHTML('beforeend', currentOption);

  currentWorkbook.SheetNames.forEach(name => {
    if (name !== currentSheet) {
      const item = `
        <label class="sheet-radio-item">
          <input type="radio" name="printSheetTarget" value="${name}" />
          <span>Subsystem Scope: ${name}</span>
        </label>
      `;
      sheetOptionsList.insertAdjacentHTML('beforeend', item);
    }
  });

  const allOption = `
    <label class="sheet-radio-item" style="border-top: 1px dashed var(--border-divider); margin-top: 8px; padding-top: 12px;">
      <input type="radio" name="printSheetTarget" value="__ALL__" />
      <span><strong>Consolidated Fleet Brief (All Subsystems)</strong></span>
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
    const rows = getNormalizedRows(sName);
    const metrics = calculateSheetMetrics(rows);

    const sheet = currentWorkbook.Sheets[sName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    if (jsonData.length === 0) return;

    const headers = jsonData[0];
    const availColIndex = headers.findIndex(h => h && h.toString().trim().toUpperCase() === 'AVAILABILITY');
    const mtbfColIndex = headers.findIndex(h => h && h.toString().trim().toUpperCase() === 'MTBF');
    const mttrColIndex = headers.findIndex(h => h && h.toString().trim().toUpperCase() === 'MTTR');

    let pageHtml = `
      <div class="print-page">
        <div class="print-header">
          <div>
            <h2>RAM Analytics Operational Brief: Subsystem ${sName}</h2>
            <span style="font-size: 0.72rem; color: #666;">Substation Reliability, Availability & Maintenance Performance Data</span>
          </div>
          <div class="meta">
            <div>Lead Analyst: <strong>Suwanan K. (Reliability Engineer)</strong></div>
            <div>Documentation Timestamp: ${new Date().toLocaleDateString('en-GB')}</div>
          </div>
        </div>

        <div class="print-kpi-grid">
          <div class="print-kpi-item">
            <span>Fleet Availability (Target ≥ 96%)</span>
            <strong>${metrics.avgAvail !== '-' ? metrics.avgAvail + '%' : '-'}</strong>
          </div>
          <div class="print-kpi-item">
            <span>Mean Time Between Failures</span>
            <strong>${metrics.avgMtbf} hrs</strong>
          </div>
          <div class="print-kpi-item">
            <span>Mean Time to Restore</span>
            <strong>${metrics.avgMttr} hrs</strong>
          </div>
          <div class="print-kpi-item">
            <span>Cataloged Failure Modes</span>
            <strong>${metrics.totalModes} Modes</strong>
          </div>
        </div>

        <table class="print-table">
          <thead><tr>
    `;

    headers.forEach(h => { pageHtml += `<th>${h || ''}</th>`; });
    pageHtml += `</tr></thead><tbody>`;

    for (let i = 1; i < jsonData.length; i++) {
      const r = jsonData[i];
      let rowMtbf = mtbfColIndex !== -1 && !isNaN(r[mtbfColIndex]) ? Number(r[mtbfColIndex]) : 0;
      let rowMttr = mttrColIndex !== -1 && !isNaN(r[mttrColIndex]) ? Number(r[mttrColIndex]) : 0;
      let rowAvail = (rowMtbf > 0 || rowMttr > 0) ? calculateAvailabilityFormula(rowMtbf, rowMttr) : 100;

      pageHtml += `<tr>`;
      for (let j = 0; j < headers.length; j++) {
        let val = r[j] !== undefined ? r[j] : '';
        if (j === availColIndex) {
          const color = rowAvail >= 96 ? '#66756B' : '#A65D57';
          pageHtml += `<td style="color: ${color}; font-weight: bold; text-align: center;">${rowAvail.toFixed(2)}%</td>`;
        } else if (j === mtbfColIndex || j === mttrColIndex) {
          pageHtml += `<td>${!isNaN(val) && val !== '' ? Number(val).toFixed(2) : val}</td>`;
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
