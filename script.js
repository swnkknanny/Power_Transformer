let currentWorkbook = null;

const fileInput = document.getElementById('excelFile');
const sheetSelect = document.getElementById('sheetSelect');
const fileControls = document.getElementById('fileControls');
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

    fileControls.style.display = 'block';

    // เลือกชีต TR เป็นค่าเริ่มต้น ถ้าไม่มีให้เลือกชีตแรก
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
  const rows = XLSX.utils.sheet_to_json(sheet);

  if (rows.length === 0) {
    tableContainer.innerHTML = '<p style="padding: 20px; text-align: center;">ไม่มีข้อมูลในระบบนี้</p>';
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

  // คำนวณเปอร์เซ็นต์ Availability
  const avgAvailPercent = countAvail > 0 ? (totalAvail / countAvail) * 100 : 0;
  
  // อัปเดตการ์ด Availability: >= 96% ขึ้นเขียว, < 96% ขึ้นแดง
  avgAvailElem.textContent = countAvail > 0 ? avgAvailPercent.toFixed(2) + '%' : '-';
  avgAvailElem.classList.remove('status-green', 'status-red');
  
  if (countAvail > 0) {
    if (avgAvailPercent >= 96) {
      avgAvailElem.classList.add('status-green');
    } else {
      avgAvailElem.classList.add('status-red');
    }
  }

  // อัปเดต Metric อื่นๆ
  totalModesElem.textContent = rows.length.toLocaleString();
  avgMtbfElem.textContent = countMtbf > 0 ? Math.round(totalMtbf / countMtbf).toLocaleString() : '-';
  avgMttrElem.textContent = countMttr > 0 ? (totalMttr / countMttr).toFixed(1) : '-';

  renderFormattedTable(sheet);
}

function renderFormattedTable(sheet) {
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  if (jsonData.length === 0) return;

  const headers = jsonData[0];
  const availColIndex = headers.findIndex(h => h && h.toString().trim().toUpperCase() === 'AVAILABILITY');

  let tableHtml = '<table id="ramTable"><thead><tr>';
  headers.forEach(h => {
    tableHtml += `<th>${h || ''}</th>`;
  });
  tableHtml += '</tr></thead><tbody>';

  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    tableHtml += '<tr>';
    for (let j = 0; j < headers.length; j++) {
      let cellValue = row[j] !== undefined ? row[j] : '';
      
      // ตรวจสอบค่าในคอลัมน์ Availability เพื่อใส่ badge สี
      if (j === availColIndex && !isNaN(cellValue) && cellValue !== '') {
        const valNum = Number(cellValue);
        const percentVal = valNum <= 1 ? valNum * 100 : valNum;
        const badgeClass = percentVal >= 96 ? 'badge-pass' : 'badge-fail';
        
        tableHtml += `<td><span class="${badgeClass}">${percentVal.toFixed(4)}%</span></td>`;
      } else {
        tableHtml += `<td>${cellValue}</td>`;
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
