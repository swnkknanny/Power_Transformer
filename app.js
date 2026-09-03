// ==========================================
// 1. Firebase Configuration
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyADet4LDE5kwcgVk1-VXgLDB2RprewvYgU",
    authDomain: "power-transformer-db.firebaseapp.com",
    databaseURL: "https://power-transformer-db-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "power-transformer-db",
    storageBucket: "power-transformer-db.firebasestorage.app",
    messagingSenderId: "752096858741",
    appId: "1:752096858741:web:2a047c764e317c830f5e3c"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const filesRef = db.ref('shared_datasets');

// Core Variables
let allFilesData = {};
let currentActiveFile = '';
let currentActiveSheet = '';
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
        currentActiveSheet = '';
    }
    
    renderSidebar();
});

function saveToCloud() {
    if (currentUserRole !== 'MasterKey') return;
    filesRef.set(allFilesData).catch((err) => {
        alert('Cloud sync failed: ' + err.message);
    });
}

function clearCloud() {
    if (currentUserRole !== 'MasterKey') return;
    filesRef.remove().catch((err) => {
        alert('Purge failed: ' + err.message);
    });
}

// ==========================================
// 3. Authentication System
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
// 4. Excel Ingestion
// ==========================================
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
            const fileSheets = {};

            workbook.SheetNames.forEach(sheetName => {
                const sheet = workbook.Sheets[sheetName];
                const rows = XLSX.utils.sheet_to_json(sheet, { defval: '-' });
                if (rows && rows.length > 0) {
                    fileSheets[sheetName] = rows;
                }
            });

            if (Object.keys(fileSheets).length === 0) {
                alert('No readable data rows found in this file.');
                return;
            }

            const safeFileName = file.name.replace(/[\.\#\$\[\]\/]/g, '_');
            allFilesData[safeFileName] = fileSheets;
            currentActiveFile = safeFileName;
            currentActiveSheet = Object.keys(fileSheets)[0];
            
            saveToCloud();
            alert(`File "${file.name}" imported with ${Object.keys(fileSheets).length} worksheets!`);

        } catch (err) {
            alert('Excel parse exception: ' + err.message);
        }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
});

function deleteFile(fileName, event) {
    event.stopPropagation();
    if (currentUserRole !== 'MasterKey') return;

    if (confirm(`Purge dataset "${fileName}"?`)) {
        delete allFilesData[fileName];
        if (currentActiveFile === fileName) {
            const remaining = Object.keys(allFilesData);
            currentActiveFile = remaining.length > 0 ? remaining[0] : '';
            currentActiveSheet = '';
        }
        saveToCloud();
    }
}

function clearAllFiles() {
    if (currentUserRole !== 'MasterKey') return;
    if (Object.keys(allFilesData).length === 0) return alert('Storage empty.');
    if (confirm('Purge all datasets?')) {
        allFilesData = {};
        currentActiveFile = '';
        currentActiveSheet = '';
        clearCloud();
    }
}

// ==========================================
// 5. Layout, FMEA Sorting & Table Rendering
// ==========================================
function normalizeCol(col) {
    return String(col || '').toLowerCase().replace(/[\s_\-]/g, '');
}

function parseRpnValue(val) {
    if (val === undefined || val === null) return 0;
    const cleaned = String(val).replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
}

function renderSidebar() {
    const fileListEl = document.getElementById('fileListContainer');
    const sheetMenuEl = document.getElementById('sheetMenuContainer');
    const fileNames = Object.keys(allFilesData);

    document.getElementById('fileCount').innerText = fileNames.length;
    fileListEl.innerHTML = '';
    sheetMenuEl.innerHTML = '';

    if (fileNames.length === 0) {
        fileListEl.innerHTML = `<li style="padding: 6px 20px; font-size: 12px; color: var(--text-muted);">No datasets loaded</li>`;
        sheetMenuEl.innerHTML = `<li style="padding: 6px 20px; font-size: 12px; color: var(--text-muted);">No sheets available</li>`;
        document.getElementById('pageTitle').innerText = 'No Worksheet Selected';
        document.getElementById('headerRecordCount').innerText = '0';
        updateDynamicStats([]);
        renderDynamicTable([], []);
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
                <i class="fa-regular fa-file-lines"></i>
                <span>${fName}</span>
            </div>
            ${deleteBtnHtml}
        `;
        fileListEl.appendChild(li);
    });

    const activeSheets = allFilesData[currentActiveFile] || {};
    const sheetNames = Object.keys(activeSheets);

    if (sheetNames.length === 0) {
        sheetMenuEl.innerHTML = `<li style="padding: 6px 20px; font-size: 12px; color: var(--text-muted);">Empty file</li>`;
        currentActiveSheet = '';
    } else {
        if (!currentActiveSheet || !activeSheets[currentActiveSheet]) {
            currentActiveSheet = sheetNames[0];
        }

        sheetNames.forEach(sName => {
            const rowCount = activeSheets[sName].length;
            const li = document.createElement('li');
            li.className = 'category-item';
            li.innerHTML = `
                <a href="javascript:void(0)" class="${sName === currentActiveSheet ? 'active' : ''}" onclick="selectSheet('${sName}')">
                    <span>${sName}</span>
                    <span class="badge-count">${rowCount}</span>
                </a>
            `;
            sheetMenuEl.appendChild(li);
        });
    }

    document.getElementById('pageTitle').innerHTML = `
        ${currentActiveSheet || 'Select Sheet'}
        <span class="dataset-source">/ ${currentActiveFile}</span>
    `;

    const sheetData = (activeSheets[currentActiveSheet]) || [];
    updateDynamicStats(sheetData);
    processTableData(sheetData);
}

function selectFile(fileName) {
    currentActiveFile = fileName;
    currentActiveSheet = '';
    renderSidebar();
}

function selectSheet(sheetName) {
    currentActiveSheet = sheetName;
    searchQuery = '';
    document.getElementById('searchInput').value = '';
    renderSidebar();
}

function updateDynamicStats(data) {
    const total = data ? data.length : 0;
    document.getElementById('headerRecordCount').innerText = total;
    document.getElementById('kpiTotal').innerText = total;

    if (!data || total === 0) {
        document.getElementById('kpiCols').innerText = 0;
        document.getElementById('kpiHighRisk').innerText = 0;
        document.getElementById('kpiMaxRpn').innerText = 0;
        return;
    }

    const columns = Object.keys(data[0]);
    document.getElementById('kpiCols').innerText = columns.length;

    let highRiskCount = 0;
    let maxRpn = 0;

    data.forEach(row => {
        let rpnVal = 0;
        let riskLevelStr = '';

        Object.keys(row).forEach(k => {
            const norm = normalizeCol(k);
            if (norm === 'rpn') rpnVal = parseRpnValue(row[k]);
            if (norm === 'rpnrisklevel' || norm === 'risklevel') riskLevelStr = String(row[k]).toLowerCase();
        });

        if (rpnVal > maxRpn) maxRpn = rpnVal;
        if (riskLevelStr.includes('high') || rpnVal >= 100) highRiskCount++;
    });

    document.getElementById('kpiHighRisk').innerText = highRiskCount;
    document.getElementById('kpiMaxRpn').innerText = maxRpn;
}

function processTableData(data) {
    if (!data || data.length === 0) {
        renderDynamicTable([], []);
        return;
    }

    // กำหนดลำดับเป้าหมายแบบ normalized
    const desiredOrder = [
        'code', 'subsystem', 'component', 'description', 'cause',
        'severitys', 'occurrenceo', 'detectiond', 'rpn',
        'rpnrisklevel', 'remedy', 'department', 'iscritical'
    ];

    const sourceColumns = Object.keys(data[0]);
    let finalColumns = [];

    // ดึงคอลัมน์ตามลำดับ FMEA
    desiredOrder.forEach(target => {
        const found = sourceColumns.find(c => normalizeCol(c) === target);
        if (found && !finalColumns.includes(found)) {
            finalColumns.push(found);
        }
    });

    // ใส่คอลัมน์อื่นๆ ที่เหลือต่อท้าย
    sourceColumns.forEach(c => {
        if (!finalColumns.includes(c)) {
            finalColumns.push(c);
        }
    });

    // เรียงแถวตาม RPN มากไปน้อย
    let processedRows = [...data];
    const rpnKey = sourceColumns.find(c => normalizeCol(c) === 'rpn');
    if (rpnKey) {
        processedRows.sort((a, b) => parseRpnValue(b[rpnKey]) - parseRpnValue(a[rpnKey]));
    }

    if (searchQuery) {
        processedRows = processedRows.filter(row => {
            return finalColumns.some(col => 
                String(row[col]).toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    }

    renderDynamicTable(finalColumns, processedRows);
}

function renderDynamicTable(columns, rows) {
    const thead = document.getElementById('dynamicTableHead');
    const tbody = document.getElementById('dynamicTableBody');

    thead.innerHTML = '';
    tbody.innerHTML = '';

    if (columns.length === 0 || rows.length === 0) {
        thead.innerHTML = `<tr><th>#</th><th>Data Attribute</th></tr>`;
        tbody.innerHTML = `<tr><td colspan="2" class="empty-state"><p>No records found in this worksheet.</p></td></tr>`;
        return;
    }

    const headerTr = document.createElement('tr');
    const thIdx = document.createElement('th');
    thIdx.style.width = '48px';
    thIdx.innerText = '#';
    headerTr.appendChild(thIdx);

    columns.forEach(col => {
        const th = document.createElement('th');
        const norm = normalizeCol(col);
        if (norm === 'rpnrisklevel' || norm === 'risklevel') {
            th.innerText = 'Risk Level';
        } else {
            th.innerText = col.replace(/_/g, ' ');
        }
        headerTr.appendChild(th);
    });
    thead.appendChild(headerTr);

    rows.forEach((row, idx) => {
        const tr = document.createElement('tr');
        const tdIdx = document.createElement('td');
        tdIdx.style.color = 'var(--text-muted)';
        tdIdx.innerText = idx + 1;
        tr.appendChild(tdIdx);

        columns.forEach(col => {
            const td = document.createElement('td');
            const val = row[col] !== undefined && row[col] !== null ? String(row[col]) : '-';
            const norm = normalizeCol(col);

            // Risk Level Badge
            if (norm === 'rpnrisklevel' || norm === 'risklevel') {
                const lower = val.toLowerCase();
                let badgeClass = 'badge-risk-low';
                if (lower.includes('high')) badgeClass = 'badge-risk-high';
                else if (lower.includes('med')) badgeClass = 'badge-risk-med';
                td.innerHTML = `<span class="tag ${badgeClass}">${val}</span>`;
            } 
            // Is Critical Column: เปลี่ยนทุกค่า Yes / Critical ให้เป็นป้าย Yes สีแดง
            else if (norm === 'iscritical') {
                const lower = val.toLowerCase();
                if (lower === 'yes' || lower === 'true' || lower === 'critical') {
                    td.innerHTML = `<span class="tag badge-critical">Yes</span>`;
                } else {
                    td.innerText = val;
                }
            }
            // Code Badge
            else if (norm === 'code' && val !== '-') {
                td.innerHTML = `<span class="tag tag-badge">${val}</span>`;
            } 
            // Remedy Badge
            else if (norm === 'remedy' && val !== '-') {
                td.innerHTML = `<span class="tag tag-remedy">${val}</span>`;
            }
            // RPN เน้นตัวเลขหนา
            else if (norm === 'rpn') {
                td.innerHTML = `<strong style="color: var(--text-primary);">${val}</strong>`;
            } 
            else {
                td.innerText = val;
            }

            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    const activeSheets = allFilesData[currentActiveFile] || {};
    const sheetData = activeSheets[currentActiveSheet] || [];
    processTableData(sheetData);
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
