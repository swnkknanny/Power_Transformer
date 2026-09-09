let currentWorkbook = null;

const fileInput = document.getElementById('excelFile');
const sheetSelect = document.getElementById('sheetSelect');
const fileDetails = document.getElementById('fileDetails');
const fileNameSpan = document.getElementById('fileName');
const fileSizeSpan = document.getElementById('fileSize');

const rowCountElem = document.getElementById('rowCount');
const colCountElem = document.getElementById('colCount');
const totalSheetsElem = document.getElementById('totalSheets');
const currentSheetTitle = document.getElementById('currentSheetTitle');
const tableContainer = document.getElementById('tableContainer');
const searchInput = document.getElementById('searchInput');

// Event: อัปโหลดไฟล์
fileInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  // แสดงข้อมูลไฟล์เบื้องต้น
  fileNameSpan.textContent = file.name;
  fileSizeSpan.textContent = (file.size / 1024).toFixed(1) + ' KB';
  fileDetails.style.display = 'block';

  const reader = new FileReader();
  reader.onload = function(evt) {
    const data = new Uint8Array(evt.target.result);
    currentWorkbook = XLSX.read(data, { type: 'array' });

    // สรุปจำนวน Sheet
    totalSheetsElem.textContent = currentWorkbook.SheetNames.length;

    // เคลียร์และสร้างตัวเลือก Sheet
    sheetSelect.innerHTML = '';
    currentWorkbook.SheetNames.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      sheetSelect.appendChild(option);
    });

    // แสดงชีตแรกเริ่มต้น
    loadSheetData(currentWorkbook.SheetNames[0]);
  };
  reader.readAsArrayBuffer(file);
});

// Event: สลับเลือก Sheet
sheetSelect.addEventListener('change', function(e) {
  if (currentWorkbook) {
    loadSheetData(e.target.value);
  }
});

// ฟังก์ชันแปลงข้อมูล Sheet และสรุปตัวเลข
function loadSheetData(sheetName) {
  currentSheetTitle.textContent = `ตารางข้อมูล: ${sheetName}`;
  const sheet = currentWorkbook.Sheets[sheetName];

  // แปลงเป็น Array เพื่อคำนวณจำนวนแถว/คอลัมน์
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  if (jsonData.length === 0) {
    tableContainer.innerHTML = '<p style="padding: 20px; text-align: center;">ไม่มีข้อมูลใน Sheet นี้</p>';
    rowCountElem.textContent = '0';
    colCountElem.textContent = '0';
    return;
  }

  // อัปเดตตัวเลขแถว และคอลัมน์สูงสุด
  rowCountElem.textContent = (jsonData.length - 1).toLocaleString();
  const maxCols = Math.max(...jsonData.map(row => row.length));
  colCountElem.textContent = maxCols.toLocaleString();

  // แปลงเป็น Table แสดงผล
  const htmlTable = XLSX.utils.sheet_to_html(sheet, { id: 'dataTable' });
  tableContainer.innerHTML = htmlTable;
}

// Event: ระบบ Search ค้นหาคำในตารางแบบ Real-time
searchInput.addEventListener('input', function(e) {
  const filter = e.target.value.toLowerCase();
  const rows = document.querySelectorAll('#dataTable tr');

  rows.forEach((row, index) => {
    // ข้ามหัวตาราง (index 0 หรือ row ที่มี <th>)
    if (index === 0 || row.querySelector('th')) return;

    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(filter) ? '' : 'none';
  });
});
