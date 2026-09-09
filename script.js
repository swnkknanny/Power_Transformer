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

function loadRamSheet(sheetName) {
  currentSheetTitle.textContent = `รายการวิเคราะห์ RAM: ระบบ ${sheetName}`;
  const sheet = currentWorkbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet);

  if (rows.length === 0) {
    tableContainer.innerHTML = '<p style="padding: 24px; text-align: center; color: #787774;">ไม่มีข้อมูลในระบบนี้</p>';
    resetMetrics();
    return;
  }

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

    // นับสถิติสาเหตุ
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

  const avgAvailPercent = countAvail > 0 ? (totalAvail / countAvail) : 0;
  
  avgAvailElem.textContent = countAvail > 0 ? avgAvailPercent.toFixed(2) + '%' : '-';
  avgAvailElem.classList.remove('status-green', 'status-red');
  
  if (countAvail > 0) {
    if (avgAvailPercent >= 96) {
      avgAvailElem.classList.add('status-green');
    } else {
      avgAvailElem.classList.add('status-red');
    }
  }

  totalModesElem.textContent = rows.length.toLocaleString();
  avgMtbfElem.textContent = countMtbf > 0 ? Math.round(totalMtbf / countMtbf).toLocaleString() : '-';
  avgMttrElem.textContent = countMttr > 0 ? (totalMttr / countMttr).toFixed(1) : '-';

  worstAvailElem.textContent = minAvail !== Infinity ? minAvailItem : '-';
  worstMttrElem.textContent = maxMttr !== -Infinity ? maxMttrItem : '-';

  renderCauseChart(causeCounts);
  renderFormattedTable(sheet);
}

// วาดกราฟ Donut
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
          labels: {
            boxWidth: 10,
            font: { size: 10, family: 'Plus Jakarta Sans, Sarabun' }
          }
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
    
    // คำนวณค่าสำหรับ Filter
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

// ฟังก์ชันกรองตาราง (Search + Quick Filter Buttons)
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

// Event Listener ปุ่ม Quick Filter
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentActiveFilter = this.getAttribute('data-filter');
    applyTableFilter();
  });
});
