// ฟังก์ชันปรับปรุงการจับคู่คอลัมน์ให้ยืดหยุ่นทั้งแบบมีช่องว่างและ underscore
function normalizeColName(col) {
    return String(col || '').toLowerCase().replace(/[\s_]/g, '');
}

function processTableData(data) {
    if (!data || data.length === 0) {
        renderDynamicTable([], []);
        return;
    }

    // ลำดับคอลัมน์มาตรฐาน FMEA ที่ต้องการ
    const fmeaTargetOrder = [
        'Code', 'Sub System', 'Component', 'Description', 'Cause', 
        'Severity S', 'Occurrence O', 'Detection D', 'RPN', 
        'RPNRisk Level', 'Remedy', 'Department', 'Is Critical'
    ];

    const sourceColumns = Object.keys(data[0]);
    let finalColumns = [];

    // ตรวจสอบว่ามีคอลัมน์ FMEA หรือไม่ (เทียบแบบ normalize)
    const normalizedSource = sourceColumns.map(c => ({ original: c, norm: normalizeColName(c) }));
    const hasFmeaMarkers = normalizedSource.some(c => c.norm === 'rpn' || c.norm === 'severitys' || c.norm === 'rpnrisklevel');

    if (hasFmeaMarkers) {
        // จัดลำดับคอลัมน์ตาม FMEA Target
        fmeaTargetOrder.forEach(target => {
            const targetNorm = normalizeColName(target);
            const found = normalizedSource.find(s => s.norm === targetNorm);
            if (found && !finalColumns.includes(found.original)) {
                finalColumns.push(found.original);
            }
        });
        // ใส่คอลัมน์ที่เหลือ
        sourceColumns.forEach(col => {
            if (!finalColumns.includes(col)) {
                finalColumns.push(col);
            }
        });
    } else {
        finalColumns = sourceColumns;
    }

    // เรียงลำดับแถวตาม RPN จากมากไปน้อย
    let processedRows = [...data];
    const rpnColObj = normalizedSource.find(s => s.norm === 'rpn');
    if (rpnColObj) {
        processedRows.sort((a, b) => {
            const valA = parseRpnValue(a[rpnColObj.original]);
            const valB = parseRpnValue(b[rpnColObj.original]);
            return valB - valA;
        });
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
        const norm = normalizeColName(col);
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
            const norm = normalizeColName(col);

            // Risk Level Badge
            if (norm === 'rpnrisklevel' || norm === 'risklevel') {
                const lower = val.toLowerCase();
                let badgeClass = 'badge-risk-low';
                if (lower.includes('high')) {
                    badgeClass = 'badge-risk-high';
                } else if (lower.includes('medium') || lower.includes('med')) {
                    badgeClass = 'badge-risk-med';
                }
                td.innerHTML = `<span class="tag ${badgeClass}">${val}</span>`;
            } 
            // Code Column Badge
            else if (norm === 'code' && val !== '-') {
                td.innerHTML = `<span class="tag tag-badge">${val}</span>`;
            } 
            // Remedy Column Badge
            else if (norm === 'remedy' && val !== '-') {
                td.innerHTML = `<span class="tag tag-remedy">${val}</span>`;
            }
            // Is Critical Column Badge
            else if (norm === 'iscritical' && (val.toLowerCase() === 'yes' || val.toLowerCase() === 'true')) {
                td.innerHTML = `<span class="tag badge-critical">Critical</span>`;
            }
            // RPN Column
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
