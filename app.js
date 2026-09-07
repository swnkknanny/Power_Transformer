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
// 4. Excel Ingestion (Strict Column Order Preservation)
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

            const sortedSheetNames = [...workbook.SheetNames].sort((a, b) => {
                if (a.toLowerCase().includes('summary')) return -1;
                if (b.toLowerCase().includes('summary')) return 1;
                if (a.toLowerCase().includes('damaged')) return -1;
                if (b.toLowerCase().includes('damaged')) return 1;
                return 0;
            });

            sortedSheetNames.forEach(sheetName => {
                const sheet = workbook.Sheets[sheetName];
                
                const rawHeaderRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                const headers = (rawHeaderRows && rawHeaderRows.length > 0) 
                    ? rawHeaderRows[0].filter(h => h !== undefined && h !== null && String(h).trim() !== '') 
                    : [];

                const rows = XLSX.utils.sheet_to_json(sheet, { defval: '-' });
                if (rows && rows.length > 0) {
                    fileSheets[sheetName] = {
                        columns: headers,
                        rows: rows
                    };
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
            alert(`File "${file.name}" imported successfully!`);

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
// 5. RAM Simulation Engine & Bidirectional Calculation
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

function getAvailPercentage(val) {
    if (val === undefined || val === null || val === '-') return null;
    let num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return null;
    if (num <= 1 && num > 0) {
        num = num * 100;
    }
    return num;
}

function getAvailInputClass(percent) {
    if (percent === null) return 'avail-input avail-input-pass';
    return percent >= 96.0 ? 'avail-input avail-input-pass' : 'avail-input avail-input-fail';
}

function checkOverallAvailabilityThreshold() {
    const recBox = document.getElementById('ramImprovementBox');
    if (!recBox) return;

    const activeSheets = allFilesData[currentActiveFile] || {};
    const sheetContent = getSheetContent(activeSheets[currentActiveSheet]);
    const rows = sheetContent.rows || [];

    let hasCriticalAvail = false;
    rows.forEach(r => {
        const cols = Object.keys(r);
        const availKey = cols.find(c => normalizeCol(c) === 'availability');
        if (availKey) {
            const p = getAvailPercentage(r[availKey]);
            if (p !== null && p < 96.0) {
                hasCriticalAvail = true;
            }
        }
    });

    recBox.style.display = hasCriticalAvail ? 'block' : 'none';
}

// คำนวณแบบ 2 ทาง:
// กรณีแก้ MTBF หรือ MTTR -> คำนวณ Availability
function handleRamChange(rowIndex, colName, newValue) {
    const activeSheets = allFilesData[currentActiveFile] || {};
    const sheetContent = getSheetContent(activeSheets[currentActiveSheet]);
    const targetRow = sheetContent.rows[rowIndex];

    if (!targetRow) return;

    targetRow[colName] = parseFloat(newValue) || 0;

    const cols = Object.keys(targetRow);
    const mtbfKey = cols.find(c => normalizeCol(c) === 'mtbf');
    const mttrKey = cols.find(c => normalizeCol(c) === 'mttr');
    const availKey = cols.find(c => normalizeCol(c) === 'availability');

    if (mtbfKey && mttrKey && availKey) {
        const mtbf = parseFloat(targetRow[mtbfKey]) || 0;
        const mttr = parseFloat(targetRow[mttrKey]) || 0;

        if (mtbf + mttr > 0) {
            const calculatedPercent = (mtbf / (mtbf + mttr)) * 100;
            targetRow[availKey] = (calculatedPercent / 100);

            const availInput = document.getElementById(`avail-input-${rowIndex}`);
            if (availInput) {
                availInput.value = calculatedPercent.toFixed(2);
                availInput.className = getAvailInputClass(calculatedPercent);
            }
        }
    }

    checkOverallAvailabilityThreshold();

    if (currentUserRole === 'MasterKey') {
        saveToCloud();
    }
}

// กรณีผู้ใช้พิมพ์กำหนด Availability เองโดยตรง (ล็อก MTTR -> คำนวณ MTBF)
function handleAvailabilityCustomChange(rowIndex, newAvailPercent) {
    const activeSheets = allFilesData[currentActiveFile] || {};
    const sheetContent = getSheetContent(activeSheets[currentActiveSheet]);
    const targetRow = sheetContent.rows[rowIndex];

    if (!targetRow) return;

    const percent = parseFloat(newAvailPercent);
    if (isNaN(percent) || percent <= 0 || percent >= 100) return;

    const cols = Object.keys(targetRow);
    const mtbfKey = cols.find(c => normalizeCol(c) === 'mtbf');
    const mttrKey = cols.find(c => normalizeCol(c) === 'mttr');
    const availKey = cols.find(c => normalizeCol(c) === 'availability');

    if (mtbfKey && mttrKey && availKey) {
        const mttr = parseFloat(targetRow[mttrKey]) || 0;
        const A = percent / 100;

        // สูตรล็อก MTTR: MTBF = (A * MTTR) / (1 - A)
        if (1 - A > 0 && mttr > 0) {
            const calculatedMtbf = Math.round((A * mttr) / (1 - A));
            targetRow[mtbfKey] = calculatedMtbf;
            targetRow[availKey] = A;

            // อัปเดตช่อง MTBF บนหน้าเว็บให้ทันที
            const mtbfInput = document.getElementById(`mtbf-input-${rowIndex}`);
            if (mtbfInput) {
                mtbfInput.value = calculatedMtbf;
            }

            // เปลี่ยนสีช่อง Availability ตามเกณฑ์ 96%
            const availInput = document.getElementById(`avail-input-${rowIndex}`);
            if (availInput) {
                availInput.className = getAvailInputClass(percent);
            }
        }
    }

    checkOverallAvailabilityThreshold();

    if (currentUserRole === 'MasterKey') {
        saveToCloud();
    }
}

function getSheetContent(sheetObj) {
    if (!sheetObj) return { columns: [], rows: [] };
    if (Array.isArray(sheetObj)) {
        const cols = sheetObj.length > 0 ? Object.keys(sheetObj[0]) : [];
        return { columns: cols, rows: sheetObj };
    }
    return {
        columns: sheetObj.columns || (sheetObj.rows && sheetObj.rows.length > 0 ? Object.keys(sheetObj.rows[0]) : []),
        rows: sheetObj.rows || []
    };
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
    
    let sheetNames = Object.keys(activeSheets).sort((a, b) => {
        const aNorm = a.toLowerCase();
        const bNorm = b.toLowerCase();
        if (aNorm.includes('summary')) return -1;
        if (bNorm.includes('summary')) return 1;
        if (aNorm.includes('damaged')) return -1;
        if (bNorm.includes('damaged')) return 1;
        return 0;
    });

    if (sheetNames.length === 0) {
        sheetMenuEl.innerHTML = `<li style="padding: 6px 20px; font-size: 12px; color: var(--text-muted);">Empty file</li>`;
        currentActiveSheet = '';
    } else {
        if (!currentActiveSheet || !activeSheets[currentActiveSheet]) {
            currentActiveSheet = sheetNames[0];
        }

        sheetNames.forEach(sName => {
            const content = getSheetContent(activeSheets[sName]);
            const rowCount = content.rows.length;
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

    const sheetContent = getSheetContent(activeSheets[currentActiveSheet]);
    updateDynamicStats(sheetContent.rows, sheetContent.columns);
    processTableData(sheetContent.rows, sheetContent.columns);
    checkOverallAvailabilityThreshold();
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

function updateDynamicStats(rows, columns) {
    const total = rows ? rows.length : 0;
    document.getElementById('headerRecordCount').innerText = total;

    const metricsPanel = document.querySelector('.metrics-panel');
    const isSummarySheet = currentActiveSheet.toLowerCase().includes('summary');

    if (metricsPanel) {
        if (isSummarySheet) {
            metricsPanel.style.display = 'none';
            return;
        } else {
            metricsPanel.style.display = 'flex';
        }
    }

    document.getElementById('kpiTotal').innerText = total;

    if (!rows || total === 0) {
        document.getElementById('kpiCols').innerText = 0;
        document.getElementById('kpiHighRisk').innerText = 0;
        document.getElementById('kpiMaxRpn').innerText = 0;
        return;
    }

    document.getElementById('kpiCols').innerText = columns ? columns.length : Object.keys(rows[0]).length;

    let highRiskCount = 0;
    let maxRpn = 0;

    rows.forEach(row => {
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

function processTableData(rows, columns) {
    if (!rows || rows.length === 0) {
        renderDynamicTable([], []);
        return;
    }

    const finalColumns = (columns && columns.length > 0) ? columns : Object.keys(rows[0]);
    let processedRows = rows.map((r, idx) => ({ ...r, __realIndex: idx }));

    const rpnKey = finalColumns.find(c => normalizeCol(c) === 'rpn');
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
        } else if (norm === 'availability') {
            th.innerText = 'Availability (%)';
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

        const targetRealIdx = (row.__realIndex !== undefined) ? row.__realIndex : idx;

        columns.forEach(col => {
            const td = document.createElement('td');
            const val = row[col] !== undefined && row[col] !== null ? String(row[col]) : '-';
            const norm = normalizeCol(col);

            // 1. ช่องกรอก MTBF
            if (norm === 'mtbf') {
                const numericVal = parseFloat(val) || 0;
                td.innerHTML = `
                    <input type="number" 
                           id="mtbf-input-${targetRealIdx}"
                           class="table-input" 
                           value="${numericVal}" 
                           step="any"
                           oninput="handleRamChange(${targetRealIdx}, '${col}', this.value)" 
                           title="Change MTBF to recalculate Availability">
                `;
            }
            // 2. ช่องกรอก MTTR
            else if (norm === 'mttr') {
                const numericVal = parseFloat(val) || 0;
                td.innerHTML = `
                    <input type="number" 
                           id="mttr-input-${targetRealIdx}"
                           class="table-input" 
                           value="${numericVal}" 
                           step="any"
                           oninput="handleRamChange(${targetRealIdx}, '${col}', this.value)" 
                           title="Change MTTR to recalculate Availability">
                `;
            }
            // 3. ช่องกรอก Availability (กำหนดเองได้ + เปลี่ยนสีสด + ล็อก MTTR คำนวณ MTBF)
            else if (norm === 'availability') {
                const p = getAvailPercentage(val);
                const displayVal = (p !== null) ? p.toFixed(2) : '';
                const inputClass = getAvailInputClass(p);
                td.innerHTML = `
                    <input type="number" 
                           id="avail-input-${targetRealIdx}"
                           class="${inputClass}" 
                           value="${displayVal}" 
                           step="0.01"
                           min="0"
                           max="99.99"
                           oninput="handleAvailabilityCustomChange(${targetRealIdx}, this.value)" 
                           title="Enter target Availability % (Locks MTTR & recalculates MTBF)">
                `;
            }
            // 4. Risk Level Badge
            else if (norm === 'rpnrisklevel' || norm === 'risklevel') {
                const lower = val.toLowerCase();
                let badgeClass = 'badge-risk-low';
                if (lower.includes('high')) badgeClass = 'badge-risk-high';
                else if (lower.includes('med')) badgeClass = 'badge-risk-med';
                td.innerHTML = `<span class="tag ${badgeClass}">${val}</span>`;
            } 
            // 5. Is Critical (ข้อความเรียบ Yes / No)
            else if (norm === 'iscritical') {
                const lower = val.toLowerCase();
                if (lower === 'yes' || lower === 'true' || lower === 'critical') {
                    td.innerText = 'Yes';
                } else if (lower === 'no' || lower === 'false') {
                    td.innerText = 'No';
                } else {
                    td.innerText = val;
                }
            }
            // 6. Code Badge
            else if (norm === 'code' || norm === 'failurecode') {
                td.innerHTML = `<span class="tag tag-badge">${val}</span>`;
            } 
            // 7. Remedy Badge
            else if (norm === 'remedy' && val !== '-') {
                td.innerHTML = `<span class="tag tag-remedy">${val}</span>`;
            }
            // 8. RPN
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
    const sheetContent = getSheetContent(activeSheets[currentActiveSheet]);
    processTableData(sheetContent.rows, sheetContent.columns);
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
