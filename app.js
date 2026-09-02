let allFilesData = {};
let currentActiveFile = '';
let currentActiveCategory = '';
let currentFilter = 'ALL';
let searchQuery = '';

// --- ระบบบันทึกฐานข้อมูลถาวร IndexedDB ---
const DB_NAME = 'TransformerDashboardDB';
const DB_VERSION = 1;
const STORE_NAME = 'filesData';

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function saveToDB() {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(allFilesData, 'allFiles');
    } catch (err) {
        console.error('Save DB error:', err);
    }
}

async function loadFromDB() {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).get('allFiles');
        req.onsuccess = () => {
            if (req.result && Object.keys(req.result).length > 0) {
                allFilesData = req.result;
                renderSidebar();
            }
        };
    } catch (err) {
        console.error('Load DB error:', err);
    }
}

async function clearDB() {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).clear();
    } catch (err) {}
}

function extractDeviceCode(desc) {
    if (!desc) return '';
    const match = String(desc).match(/^([TLH]\d+)/);
    return match ? match[1] : '';
}

function categorizeRawText(codeText) {
    const text = String(codeText).toUpperCase();
    if (text.includes("น้ำมัน") || text.includes("รั่ว") || text.includes("ซึม") || text.includes("OIL")) return "OIL LEAK";
    if (text.includes("SILICAGEL") || text.includes("อุดตัน")) return "EXHAUSTION";
    if (text.includes("ไม่ทำงาน") || text.includes("TRIP") || text.includes("ผิดปกติ") || text.includes("ค้าง") || text.includes("กลไก")) return "EQUIPMENT ERROR";
    if (text.includes("ชำรุด") || text.includes("แตก") || text.includes("ขาด") || text.includes("เสื่อมสภาพ")) return "DAMAGED";
    return "OTHERS";
}

document.getElementById('excelFileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (typeof XLSX === 'undefined') {
        alert('ไลบรารีกำลังโหลด กรุณารีเฟรช 1 ครั้ง');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(evt) {
        try {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const fileCategories = {};

            if (workbook.SheetNames.length > 1) {
                workbook.SheetNames.forEach(sheetName => {
                    const sheet = workbook.Sheets[sheetName];
                    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                    if (rows && rows.length > 0) {
                        const parsedRows = [];
                        for (let i = 0; i < rows.length; i++) {
                            const row = rows[i];
                            if (row && (row[0] || row[1])) {
                                if (i === 0 && String(row[0]).toLowerCase().includes('failure')) continue;
                                parsedRows.push({
                                    code: row[0] ? String(row[0]).trim() : '-',
                                    desc: row[1] ? String(row[1]).trim() : '-'
                                });
                            }
                        }
                        if (parsedRows.length > 0) fileCategories[sheetName] = parsedRows;
                    }
                });
            } else {
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
                
                if (rows && rows.length > 0) {
                    for (let i = 0; i < rows.length; i++) {
                        const row = rows[i];
                        if (row && (row[0] || row[1])) {
                            if (i === 0 && String(row[0]).toLowerCase().includes('failure')) continue;
                            const code = row[0] ? String(row[0]).trim() : '-';
                            const desc = row[1] ? String(row[1]).trim() : '-';
                            const category = categorizeRawText(code);

                            if (!fileCategories[category]) fileCategories[category] = [];
                            fileCategories[category].push({ code, desc });
                        }
                    }
                }
            }

            if (Object.keys(fileCategories).length === 0) {
                alert('ไม่พบข้อมูลที่อ่านได้ในตาราง');
                return;
            }

            allFilesData[file.name] = fileCategories;
            currentActiveFile = file.name;
            currentActiveCategory = '';
            
            await saveToDB();
            renderSidebar();
            alert(`เพิ่มไฟล์ "${file.name}" เรียบร้อยแล้ว!`);

        } catch (err) {
            alert('เกิดข้อผิดพลาดในการอ่านไฟล์: ' + err.message);
        }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
});

async function deleteFile(fileName, event) {
    event.stopPropagation();
    if (confirm(`คุณต้องการนำไฟล์ "${fileName}" ออกจากระบบใช่หรือไม่?`)) {
        delete allFilesData[fileName];
        await saveToDB();
        const fileNames = Object.keys(allFilesData);
        if (currentActiveFile === fileName) {
            currentActiveFile = fileNames.length > 0 ? fileNames[0] : '';
            currentActiveCategory = '';
        }
        renderSidebar();
    }
}

async function clearAllFiles() {
    if (Object.keys(allFilesData).length === 0) return alert('ไม่มีไฟล์ในระบบ');
    if (confirm('คุณต้องการล้างข้อมูลทั้งหมดใช่หรือไม่?')) {
        allFilesData = {};
        currentActiveFile = '';
        currentActiveCategory = '';
        await clearDB();
        renderSidebar();
    }
}

function renderSidebar() {
    const fileListEl = document.getElementById('fileListContainer');
    const categoryMenuEl = document.getElementById('categoryMenu');
    const fileNames = Object.keys(allFilesData);

    document.getElementById('fileCount').innerText = fileNames.length;
    fileListEl.innerHTML = '';
    categoryMenuEl.innerHTML = '';

    if (fileNames.length === 0) {
        fileListEl.innerHTML = `<li style="padding: 10px 22px; font-size: 0.78rem; color: var(--text-muted);">ไม่มีไฟล์</li>`;
        categoryMenuEl.innerHTML = `<li style="padding: 10px 22px; font-size: 0.78rem; color: var(--text-muted);">ไม่มีหมวดหมู่</li>`;
        document.getElementById('pageTitle').innerHTML = `<i class="fa-regular fa-folder-open" style="color: var(--accent-primary);"></i><span>ยังไม่ได้เลือกหมวดหมู่</span>`;
        updateStats();
        renderTable();
        return;
    }

    if (!currentActiveFile || !allFilesData[currentActiveFile]) {
        currentActiveFile = fileNames[0];
    }

    fileNames.forEach(fName => {
        const li = document.createElement('li');
        li.className = `file-item ${fName === currentActiveFile ? 'active' : ''}`;
        li.innerHTML = `
            <div class="file-name-click" onclick="selectFile('${fName}')" title="${fName}">
                <i class="fa-regular fa-file-excel"></i>
                <span>${fName}</span>
            </div>
            <i class="fa-regular fa-trash-can btn-delete-file" onclick="deleteFile('${fName}', event)" title="ลบไฟล์นี้"></i>
        `;
        fileListEl.appendChild(li);
    });

    const activeFileCategories = allFilesData[currentActiveFile] || {};
    const categories = Object.keys(activeFileCategories);

    if (categories.length === 0) {
        categoryMenuEl.innerHTML = `<li style="padding: 10px 22px; font-size: 0.78rem; color: var(--text-muted);">ไม่พบข้อมูล</li>`;
        currentActiveCategory = '';
    } else {
        if (!currentActiveCategory || !activeFileCategories[currentActiveCategory]) {
            currentActiveCategory = categories[0];
        }

        categories.forEach(catName => {
            const count = activeFileCategories[catName].length;
            const li = document.createElement('li');
            li.className = 'category-item';
            li.innerHTML = `
                <a href="javascript:void(0)" class="${catName === currentActiveCategory ? 'active' : ''}" onclick="selectCategory('${catName}')">
                    <i class="fa-regular fa-circle-dot"></i>
                    <span>${catName}</span>
                    <span class="badge-count">${count}</span>
                </a>
            `;
            categoryMenuEl.appendChild(li);
        });
    }

    if (currentActiveCategory) {
        document.getElementById('pageTitle').innerHTML = `
            <i class="fa-regular fa-folder-open" style="color: var(--accent-primary);"></i>
            <span>${currentActiveCategory}</span>
            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: normal; margin-left: 8px;">(${currentActiveFile})</span>
        `;
    }

    updateStats();
    renderTable();
}

function selectFile(fileName) {
    currentActiveFile = fileName;
    currentActiveCategory = '';
    renderSidebar();
}

function selectCategory(catName) {
    currentActiveCategory = catName;
    currentFilter = 'ALL';
    searchQuery = '';
    document.getElementById('searchInput').value = '';

    document.querySelectorAll('.category-item a').forEach(a => {
        const span = a.querySelector('span');
        a.classList.toggle('active', span && span.innerText === catName);
    });

    document.getElementById('pageTitle').innerHTML = `
        <i class="fa-regular fa-folder-open" style="color: var(--accent-primary);"></i>
        <span>${catName}</span>
        <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: normal; margin-left: 8px;">(${currentActiveFile})</span>
    `;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.includes('ทั้งหมด'));
    });

    updateStats();
    renderTable();
}

function getCurrentData() {
    if (!currentActiveFile || !currentActiveCategory) return [];
    return (allFilesData[currentActiveFile] && allFilesData[currentActiveFile][currentActiveCategory]) || [];
}

function updateStats() {
    const data = getCurrentData();
    let countT = 0, countL = 0, countH = 0;

    data.forEach(item => {
        const code = extractDeviceCode(item.desc);
        const prefix = code ? code.charAt(0) : '';
        if (prefix === 'T') countT++;
        else if (prefix === 'L') countL++;
        else if (prefix === 'H') countH++;
    });

    document.getElementById('totalRecords').innerText = data.length;
    document.getElementById('totalT').innerText = countT;
    document.getElementById('totalL').innerText = countL;
    document.getElementById('totalH').innerText = countH;
}

function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    const data = getCurrentData();

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="empty-state"><i class="fa-regular fa-folder" style="font-size: 2rem; margin-bottom: 8px; color: #cbd5e1;"></i><p>ไม่มีข้อมูล</p></td></tr>`;
        return;
    }

    const filtered = data.filter(item => {
        const devCode = extractDeviceCode(item.desc);
        const prefix = devCode ? devCode.charAt(0) : '';

        const matchesCategory = (currentFilter === 'ALL') || 
                              (currentFilter === 'T' && prefix === 'T') ||
                              (currentFilter === 'L' && prefix === 'L') ||
                              (currentFilter === 'H' && (prefix === 'H' || prefix === ''));

        const matchesSearch = item.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.desc.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="empty-state">ไม่พบข้อมูลที่ค้นหา</td></tr>`;
        return;
    }

    filtered.forEach((item, index) => {
        const devCode = extractDeviceCode(item.desc);
        const descText = devCode ? item.desc.replace(devCode, '').trim() : item.desc;
        const prefix = devCode ? devCode.charAt(0) : '';

        let tagHtml = '';
        if (devCode) {
            let tagClass = 'tag-h';
            if (prefix === 'T') tagClass = 'tag-t';
            else if (prefix === 'L') tagClass = 'tag-l';
            tagHtml = `<span class="tag ${tagClass}">${devCode}</span>`;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="text-align: center; color: var(--text-muted); font-size: 0.8rem;">${index + 1}</td>
            <td class="failure-text">${item.code}</td>
            <td>
                ${tagHtml}
                <span class="desc-text">${descText}</span>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterData(category) {
    currentFilter = category;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.includes(category === 'ALL' ? 'ทั้งหมด' : category)) {
            btn.classList.add('active');
        }
    });
    renderTable();
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderTable();
});

window.addEventListener('DOMContentLoaded', () => {
    loadFromDB();
});
// ฟังก์ชันเปิด/ปิดแถบเมนูในมือถือและแท็บเล็ต
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}
