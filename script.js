document.getElementById('excelFile').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    // ดึงข้อมูล Sheet แรก
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // แปลงข้อมูลเป็น HTML Table แล้วนำไปแสดงผล
    const htmlTable = XLSX.utils.sheet_to_html(worksheet);
    document.getElementById('tableContainer').innerHTML = htmlTable;
  };

  reader.readAsArrayBuffer(file);
});
