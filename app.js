// ==========================================
// 1. Firebase Configuration (คงเดิม 100%)
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyADet4LDE5kwcgVk1-VXgLDB2RprewvYgU",
    authDomain: "power-transformer-db.firebaseapp.com",
    databaseURL: "https://power-transformer-db-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "power-transformer-db",
    storageStorageBucket: "power-transformer-db.firebasestorage.app",
    messagingSenderId: "752096858741",
    appId: "1:752096858741:web:2a047c764e317c830f5e3c"
};

// Initialize Firebase Realtime Database
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const filesRef = db.ref('shared_datasets');

// Core Variables & Data Store
let allFilesData = {};
let currentActiveFile = '';
let currentActiveCategory = '';
let currentFilter = 'ALL';
let searchQuery = '';
let selectedLoginRole = 'MasterKey';
let currentUserRole = sessionStorage.getItem('user_role') || null;

// ==========================================
// 2. Realtime Synchronization
// ==========================================
filesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    allFilesData = data || {};
    
    const fileNames = Object.keys(allFilesData);
    if (!allFilesData[currentActiveFile]) {
        currentActiveFile = fileNames.length > 0 ? fileNames[0] : '';
        currentActiveCategory = '';
    }
    
    renderSidebar();
});

function saveToCloud() {
    if (currentUserRole !== 'MasterKey') return;
    filesRef.set(allFilesData).catch((err) => {
        alert('Cloud synchronization error: ' + err.message);
    });
}

function clearCloud() {
    if (currentUserRole !== 'MasterKey') return;
    filesRef.remove().catch((err) => {
        alert('Purge operation failed: ' + err.message);
    });
}

// ==========================================
// 3. Authentication & Access Control
// ==========================================
function selectLoginRole(role) {
    selectedLoginRole = role;
    const btnMaster = document.getElementById('btnRoleMaster');
    const btnVisitor = document.getElementById('btnRoleVisitor');
    const hint = document.getElementById('roleHintText');
    const passInput = document.getElementById('accessPass');

    if (role === 'MasterKey') {
        btnMaster.classList.add('active');
        btnVisitor.classList.remove('active');
        hint.innerText = 'MasterKey: Administrative & modification privilege';
        passInput.placeholder = 'Enter MasterKey Code...';
    } else {
        btnVisitor.classList.add('active');
        btnMaster.classList.remove('active');
        hint.innerText = 'Visitor: Read-only telemetry inspection';
        passInput.placeholder = 'Enter Visitor Passcode...';
    }
    document.getElementById('loginError').innerText = '';
    passInput.focus();
}

function checkAuth() {
    const modal = document.getElementById('loginModal');
    const badge = document.getElementById('roleBadge');
    const adminControls = document.getElementById('adminActionButtons');

    if (!currentUserRole) {
        modal.style.display = 'flex';
    } else {
        modal.style.display = 'none';

        if (currentUserRole === 'MasterKey') {
            badge.innerText = 'MasterKey (Admin)';
            badge.className = 'user-role-badge role-master';
            adminControls.style.display = 'flex';
        } else if (currentUserRole === 'Visitor') {
            badge.innerText = 'Visitor (View Only)';
            badge.className = 'user-role-badge role-visitor';
            adminControls.style.display = 'none';
        }
        renderSidebar();
    }
}

function handleLogin(e) {
    e.preventDefault();
    const passInput = document.getElementById('accessPass');
    const errorEl = document.getElementById('loginError');
    const pass = passInput.value.trim();

    if (selectedLoginRole === 'MasterKey') {
        if (pass === '13102547') {
            currentUserRole = 'MasterKey';
            sessionStorage.setItem('user_role', 'MasterKey');
            errorEl.innerText = '';
            passInput.value = '';
            checkAuth();
        } else {
            errorEl.innerText = 'Invalid MasterKey authorization code.';
        }
    } else if (selectedLoginRole === 'Visitor') {
        if (pass === '66002288') {
            currentUserRole = 'Visitor';
            sessionStorage.setItem('user_role', 'Visitor');
            errorEl.innerText = '';
            passInput.value = '';
            checkAuth();
        } else {
            errorEl.innerText = 'Invalid Visitor passcode.';
        }
    }
}

function logout() {
    if (confirm('Terminate active session?')) {
        sessionStorage.removeItem('user_role');
        currentUserRole = null;
        document.getElementById('accessPass').value = '';
        document.getElementById('loginError').innerText = '';
        checkAuth();
    }
}

// ==========================================
// 4. Data Processing & Utilities
// ==========================================
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
    if (currentUserRole !== 'MasterKey') {
        alert('Permission Denied: Administrative rights required.');
        return;
    }

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
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

            const safeFileName = file.name.replace(/\./g, '_');
            allFilesData[safeFileName] = fileCategories;
            currentActiveFile = safeFileName;
            currentActiveCategory = '';
            
            saveToCloud();
            alert(`Dataset "${file.name}" imported successfully.`);

        } catch (err) {
            alert('File parse exception: ' + err.message);
        }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
});

function deleteFile(fileName, event) {
    event.stopPropagation();
    if (currentUserRole !== 'MasterKey') {
        alert('Permission Denied: Administrative rights required.');
        return;
    }

    if (confirm(`Purge dataset "${fileName}" from Cloud storage?`)) {
        delete allFilesData[fileName];
        saveToCloud();
    }
}

function clearAllFiles() {
    if (currentUserRole !== 'MasterKey') {
        alert('Permission Denied: Administrative rights required.');
        return;
    }
    if (Object.keys(allFilesData).length === 0) return alert('Storage is currently empty.');
    if (confirm('Execute complete dataset purge across all connected devices?')) {
        allFilesData = {};
        currentActiveFile = '';
        currentActiveCategory = '';
        clearCloud();
    }
}

// ==========================================
// 5. Visual Hierarchy & Rendering Engine
// ==========================================
function renderSidebar() {
    const fileListEl = document.getElementById('fileListContainer');
    const categoryMenuEl = document.getElementById('categoryMenu');
    const fileNames = Object.keys(allFilesData);

    document.getElementById('fileCount').innerText = fileNames.length;
    fileListEl.innerHTML = '';
    categoryMenuEl.innerHTML = '';

    if (fileNames.length === 0) {
        fileListEl.innerHTML = `<li style="padding: 6px 20px; font-size: 12px; color: var(--text-muted);">No active sets</li>`;
        categoryMenuEl.innerHTML = `<li style="padding: 6px 20px; font-size: 12px; color: var(--text-muted);">No categories</li>`;
        document.getElementById('pageTitle').innerHTML = `No Classification Selected`;
        document.getElementById('headerRecordCount').innerText = '0';
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
        
        const deleteBtnHtml = (currentUserRole === 'MasterKey') 
            ? `<i class="fa-regular fa-trash-can btn-delete-file" onclick="deleteFile('${fName}', event)" title="Purge dataset"></i>`
            : '';

        li.innerHTML = `
            <div class="file-name-click" onclick="selectFile('${fName}')" title="${fName}">
                <i class="fa-regular fa-file"></i>
                <span>${fName}</span>
            </div>
            ${deleteBtnHtml}
        `;
        fileListEl.appendChild(li);
    });

    const activeFileCategories = allFilesData[currentActiveFile] || {};
    const categories = Object.keys(activeFileCategories);

    if (categories.length === 0) {
        categoryMenuEl.innerHTML = `<li style="padding: 6px 20px; font-size: 12px; color: var(--text-muted);">Empty category set</li>`;
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
                    <span>${catName}</span>
                    <span class="badge-count">${count}</span>
                </a>
            `;
            categoryMenuEl.appendChild(li);
        });
    }

    if (currentActiveCategory) {
        document.getElementById('pageTitle').innerHTML = `
            ${currentActiveCategory}
            <span class="dataset-source">/ ${currentActiveFile}</span>
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
        ${catName}
        <span class="dataset-source">/ ${currentActiveFile}</span>
    `;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.includes('All'));
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
    document.getElementById('headerRecordCount').innerText = data.length;
    document.getElementById('totalT').innerText = countT;
    document.getElementById('totalL').innerText = countL;
    document.getElementById('totalH').innerText = countH;
}

function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    const data = getCurrentData();

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="empty-state"><p>No telemetry records found.</p></td></tr>`;
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
        tbody.innerHTML = `<tr><td colspan="3" class="empty-state"><p>No matching units found.</p></td></tr>`;
        return;
    }

    filtered.forEach((item, index) => {
        const devCode = extractDeviceCode(item.desc);
        const descText = devCode ? item.desc.replace(devCode, '').trim() : item.desc;

        let tagHtml = '';
        if (devCode) {
            tagHtml = `<span class="tag tag-badge">${devCode}</span>`;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="color: var(--text-muted); font-size: 12px;">${index + 1}</td>
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
        if(category === 'ALL' && btn.innerText.includes('All')) btn.classList.add('active');
        if(category !== 'ALL' && btn.innerText.includes(category)) btn.classList.add('active');
    });
    renderTable();
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderTable();
});

function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});
