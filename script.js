let currentWorkbook = null;

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

    // เริ่มต้นที่ชีต TR หรือชีตแรก
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

  rows.forEach(r => {
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

  const avgAvailPercent = countAvail > 0 ? (totalAvail / countAvail) * 100 : 0;
  
  // เช็คเงื่อนไขสี Availability (>= 96% เขียว, < 96% แดง)
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

  renderFormattedTable(sheet);
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
    if (isShortMetric || avgLen < 12) {
      return 'col-compact';
    }
    return 'col-expand';
  });

  const availColIndex = headers.findIndex(h => h && h.toString().trim().toUpperCase() === 'AVAILABILITY');

  let tableHtml = '<table id="ramTable"><thead><tr>';
  headers.forEach((h, idx) => {
    tableHtml += `<th class="${colTypes[idx]}">${h || ''}</th>`;
  });
  tableHtml += '</tr></thead><tbody>';

  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    tableHtml += '<tr>';
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
}

function resetMetrics() {
  avgAvailElem.textContent = '-%';
  avgAvailElem.classList.remove('status-green', 'status-red');
  avgMtbfElem.textContent = '-';
  avgMttrElem.textContent = '-';
  totalModesElem.textContent = '0';
}

searchInput.addEventListener('input', function(e) {
  const query = e.target.value.toLowerCase();
  const trs = document.querySelectorAll('#ramTable tr');

  trs.forEach((tr, idx) => {
    if (idx === 0 || tr.querySelector('th')) return;
    const text = tr.textContent.toLowerCase();
    tr.style.display = text.includes(query) ? '' : 'none';
  });
});
