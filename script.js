let currentWorkbook = null;
let currentChart = null;
let currentActiveFilter = 'all';

const fileInput = document.getElementById('excelFile');
const sheetSelect = document.getElementById('sheetSelect');
const subsystemControl = document.getElementById('subsystemControl');
const tableContainer = document.getElementById('tableContainer');
const currentSheetTitle = document.getElementById('currentSheetTitle');
const searchInput = document.getElementById('searchInput');

const avgAvailElem = document.getElementById('avgAvail');
const avgMtbfElem = document.getElementById('avgMtbf');
const avgMttrElem = document.getElementById('avgMttr');
const totalModesElem = document.getElementById('totalModes');
const worstAvailElem = document.getElementById('worstAvail');
const worstMttrElem = document.getElementById('worstMttr');

// Modal Elements
const exportModal = document.getElementById('exportModal');
const openExportModalBtn = document.getElementById('openExportModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const confirmPrintBtn = document.getElementById('confirmPrintBtn');
const sheetOptionsList = document.getElementById('sheetOptionsList');
const printContainer = document.getElementById('printContainer');

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

    subsystemControl.style.display = 'block';

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

    const compName = r[compKey] || 'Unknown';

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
        const cleanCause = c.trim();
        if (cleanCause) {
          causeCounts[cleanCause] = (causeCounts[cleanCause] || 0) + 1;
        }
      });
    }
  });

  const avgAvail = countAvail > 0 ? (totalAvail / countAvail) : 0;
  const avgMtbf = countMtbf > 0 ? Math.round(totalMtbf / countMtbf) : 0;
  const avgMttr = countMttr > 0 ? (totalMttr / countMttr).toFixed(1) : 0;

  return {
    totalModes: rows.length,
    avgAvail: countAvail > 0 ? avgAvail.toFixed(2) : '-',
    avgMtbf: countMtbf > 0 ? avgMtbf.toLocaleString() : '-',
    avgMttr: countMttr > 0 ? avgMttr : '-',
    minAvailItem: minAvail !== Infinity ? minAvailItem : '-',
    maxMttrItem: maxMttr !== -Infinity ? maxMttrItem : '-',
    causeCounts
  };
}

function loadRamSheet(sheetName) {
  currentSheetTitle.textContent = `รายการวิเคราะห์ RAM: ระบบ ${sheetName}`;
  const sheet = currentWorkbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet);

  if (rows.length === 0) {
    tableContainer.innerHTML = '<p style="padding: 24px; text-align: center; color: #787774;">ไม่มีข้อมูลในระบบนี้</p>';
    resetMetrics();
    return;
  }

  const metrics = calculateSheetMetrics(rows);

  avgAvailElem.textContent = metrics.avgAvail !== '-' ? metrics.avgAvail + '%' : '-';
  avgAvailElem.classList.remove('status-green', 'status-red');
  
  if (metrics.avgAvail !== '-') {
    if (parseFloat(metrics.avgAvail) >= 96) {
      avgAvailElem.classList.add('status-green');
    } else {
      avgAvailElem.classList.add('status-red');
    }
  }

  totalModesElem.textContent = metrics.totalModes.toLocaleString();
  avgMtbfElem.textContent = metrics.avgMtbf;
  avgMttrElem.textContent = metrics.avgMttr;
  worstAvailElem.textContent = metrics.minAvailItem;
  worstMttrElem.textContent = metrics.maxMttrItem;

  renderCauseChart(metrics.causeCounts);
  renderFormattedTable(sheet);
}

function renderCauseChart(causeCounts) {
  const ctx = document.getElementById('causeChart').getContext('2d');
  const sorted = Object.entries(causeCounts).sort((a, b) => b[1] - a[1]);
  const top4 = sorted.slice(0, 4);
  const others = sorted.slice(4).reduce((sum, item) => sum + item[1], 0);

  const labels = top4.map(i => i[0]);
  const data = top4.map(i => i[1]);
  if (others > 0) {
    labels.push('อื่นๆ');
    data.push(others);
  }

  if (currentChart) {
    currentChart.destroy();
  }

  currentChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: ['#2b825b', '#3568a8', '#b57a22', '#b84a39', '#a8a29e'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { boxWidth: 10, font: { size: 10, family: 'Plus Jakarta Sans, Sarabun' } }
        }
      },
      cutout: '68%'
    }
  });
}

function renderFormattedTable(sheet) {
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
    let rowAvail = 100;
    let rowMttr = 0;

    if (availColIndex !== -1 && row[availColIndex] !== undefined) {
      let v = Number(row[availColIndex]);
      rowAvail = v <= 1 ? v * 100 : v;
    }
    if (mttrColIndex !== -1 && row[mttrColIndex] !== undefined) {
      rowMttr = Number(row[mttrColIndex]);
    }

    tableHtml += `<tr data-avail="${rowAvail}" data-mttr="${rowMttr}">`;
    for (let j = 0; j < headers.length; j++) {
      let cellValue = row[j] !== undefined ? row[j] : '';
      const colClass = colTypes[j];

      if (j === availColIndex && !isNaN(cellValue) && cellValue !== '') {
        const valNum = Number(cellValue);
        const percentVal = valNum <= 1 ? valNum * 100 : valNum;
        const badgeClass = percentVal >= 96 ? 'badge-pass' : 'badge-fail';
        tableHtml += `<td class="${colClass}"><span class="${badgeClass}">${percentVal.toFixed(4)}%</span></td>`;
      } else {
        tableHtml += `<td class="${colClass}">${cellValue}</td>`;
      }
    }
    tableHtml += '</tr>';
  }

  tableHtml += '</tbody></table>';
  tableContainer.innerHTML = tableHtml;
  applyTableFilter();
}

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

    if (currentActiveFilter === 'critical') {
      matchesFilter = avail < 96;
    } else if (currentActiveFilter === 'high-mttr') {
      matchesFilter = mttr > 10;
    }

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
   LOGIC MODAL & PRINT SPECIFIC SHEET
   ============================================================ */
openExportModalBtn.addEventListener('click', function() {
  if (!currentWorkbook) {
    alert('กรุณาเลือกไฟล์ Excel ก่อนทำการพิมพ์');
    return;
  }

  const currentSheet = sheetSelect.value;
  sheetOptionsList.innerHTML = '';

  // ตัวเลือกชีตปัจจุบัน
  const currentOption = `
    <label class="sheet-radio-item">
      <input type="radio" name="printSheetTarget" value="${currentSheet}" checked />
      <span><strong>ระบบที่กำลังเปิดดูอยู่ (${currentSheet})</strong></span>
    </label>
  `;
  sheetOptionsList.insertAdjacentHTML('beforeend', currentOption);

  // ตัวเลือกชีตอื่นๆ
  currentWorkbook.SheetNames.forEach(name => {
    if (name !== currentSheet) {
      const item = `
        <label class="sheet-radio-item">
          <input type="radio" name="printSheetTarget" value="${name}" />
          <span>ระบบ ${name}</span>
        </label>
      `;
      sheetOptionsList.insertAdjacentHTML('beforeend', item);
    }
  });

  // ตัวเลือกพิมพ์ทั้งหมด
  const allOption = `
    <label class="sheet-radio-item" style="border-top: 1.5px dashed #d4d2cb; margin-top: 6px; padding-top: 12px;">
      <input type="radio" name="printSheetTarget" value="__ALL__" />
      <span><strong>ทุกระบบพร้อมกัน (All Subsystems)</strong></span>
    </label>
  `;
  sheetOptionsList.insertAdjacentHTML('beforeend', allOption);

  exportModal.classList.add('show');
});

function closeModal() {
  exportModal.classList.remove('show');
}
closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);

// เมื่อกดยืนยันการพิมพ์
confirmPrintBtn.addEventListener('click', function() {
  const selectedRadio = document.querySelector('input[name="printSheetTarget"]:checked');
  if (!selectedRadio) return;

  const targetSheet = selectedRadio.value;
  closeModal();

  // สร้าง HTML สำหรับหน้าพิมพ์โดยเฉพาะ
  buildPrintView(targetSheet);

  // สั่งเปิดหน้าต่าง Print
  setTimeout(() => {
    window.print();
  }, 300);
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
            <h2>รายงานการวิเคราะห์ RAM: ระบบ ${sName}</h2>
            <span style="font-size: 0.75rem; color: #787774;">Substation Reliability & Maintenance Analysis</span>
          </div>
          <div class="meta">
            <div>ผู้จัดทำ: <strong>Suwanan K. (Reliability Engineer)</strong></div>
            <div>วันที่ออกรายงาน: ${new Date().toLocaleDateString('th-TH')}</div>
          </div>
        </div>

        <div class="print-kpi-grid">
          <div class="print-kpi-item">
            <span>Avg. Availability (≥ 96%)</span>
            <strong>${metrics.avgAvail !== '-' ? metrics.avgAvail + '%' : '-'}</strong>
          </div>
          <div class="print-kpi-item">
            <span>Avg. MTBF</span>
            <strong>${metrics.avgMtbf} ชม.</strong>
          </div>
          <div class="print-kpi-item">
            <span>Avg. MTTR</span>
            <strong>${metrics.avgMttr} ชม.</strong>
          </div>
          <div class="print-kpi-item">
            <span>Total Failure Modes</span>
            <strong>${metrics.totalModes} รายการ</strong>
          </div>
        </div>

        <table class="print-table">
          <thead>
            <tr>
    `;

    headers.forEach(h => {
      pageHtml += `<th>${h || ''}</th>`;
    });
    pageHtml += `</tr></thead><tbody>`;

    for (let i = 1; i < jsonData.length; i++) {
      const r = jsonData[i];
      pageHtml += `<tr>`;
      for (let j = 0; j < headers.length; j++) {
        let val = r[j] !== undefined ? r[j] : '';
        if (j === availColIndex && !isNaN(val) && val !== '') {
          const num = Number(val);
          const pVal = num <= 1 ? num * 100 : num;
          const color = pVal >= 96 ? '#2b825b' : '#c84444';
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
