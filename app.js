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
            else if (norm === 'code' && val !== '-') {
                td.innerHTML = `<span class="tag tag-badge">${val}</span>`;
            } 
            else if (norm === 'remedy' && val !== '-') {
                td.innerHTML = `<span class="tag tag-remedy">${val}</span>`;
            }
            // Is Critical Column: ถ้าเป็น Yes/True แสดงป้ายสีแดง ถ้าเป็น No แสดงตัวหนังสือปกติ
            else if (norm === 'iscritical') {
                const lower = val.toLowerCase();
                if (lower === 'yes' || lower === 'true') {
                    td.innerHTML = `<span class="tag badge-critical">Yes</span>`;
                } else {
                    td.innerText = val;
                }
            }
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
