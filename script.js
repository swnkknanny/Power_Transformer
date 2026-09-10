// ============================================================
// 1. MULTI-LANGUAGE SYSTEM (EN / TH)
// ============================================================
let currentLang = localStorage.getItem('RAM_DASHBOARD_LANG') || 'en';

const i18nData = {
  en: {
    brand_sub: "SUBSTATION RELIABILITY",
    nav_heading: "INTELLIGENCE CONSOLE",
    nav_overview: "Overview",
    nav_simulator: "What-If Simulator",
    panel_subsystem: "SUBSYSTEM DOMAIN",
    admin_override: "ADMIN DATA OVERRIDE",
    import_dataset: "Import New Dataset",
    sync_hint: "Syncs instantly to all devices",
    footer_desc: "Substation equipment reliability & maintenance lifecycle management system.",
    search_placeholder: "Search equipment, failure modes, causes...",
    export_brief: "Export Brief",
    commit_excel: "Commit Excel",
    admin_gateway: "Admin Gateway",
    lead_engineer: "Lead Reliability Eng.",
    cloud_sync_active: "CLOUD SYNC ACTIVE",
    mode_viewer: "VIEWER CONSOLE",
    mode_admin: "ADMIN CONSOLE (LIVE CLOUD EDIT)",
    banner_title: "Substation Reliability & Performance Intelligence",
    banner_desc: "Real-time equipment availability benchmarking, failure mode distribution, and maintenance optimization analytics.",
    kpi_avail_title: "Fleet Availability",
    kpi_avail_target: "Target ≥ 96.00%",
    kpi_avail_footer: "Operational uptime benchmark",
    kpi_mtbf_title: "Mean Time Between Failures",
    kpi_mtbf_target: "MTBF Metric",
    kpi_mtbf_footer: "Average operating hours between failures",
    kpi_mttr_title: "Mean Time to Restore",
    kpi_mttr_target: "MTTR Limit ≤ 10h",
    kpi_mttr_footer: "Average corrective maintenance latency",
    kpi_modes_title: "Cataloged Failure Modes",
    kpi_modes_target: "Active Registry",
    kpi_modes_footer: "Total failure mechanisms monitored",
    unit_hrs: "hrs",
    tag_risk_prioritization: "RISK PRIORITIZATION",
    attention_vectors_title: "Subsystem Attention Vectors",
    lowest_avail_label: "Lowest Availability Component",
    inspect_btn: "Inspect",
    lowest_avail_note: "Priority candidate for condition-based maintenance to prevent unplanned outages.",
    peak_mttr_label: "Maximum Repair Latency (Peak MTTR)",
    peak_mttr_note: "Consider stocking specialized spares and optimizing maintenance staging procedures.",
    tag_root_cause: "ROOT CAUSE SPECTRUM",
    chart_cause_title: "Failure Cause Distribution",
    click_segment_hint: "Click segment to drill",
    table_title_prefix: "System Diagnostics & RAM Matrix: Subsystem",
    table_status_viewer: "Read-Only Observation Mode",
    table_status_admin: "Active Cloud Edit Mode: MTBF/MTTR edits auto-calculate Availability",
    table_sub_title: "Click any equipment row to access comprehensive operational analytics.",
    filter_all: "All Items",
    filter_critical: "Avail < 96%",
    filter_high_mttr: "MTTR > 10 hrs",
    connecting_cloud: "Connecting to Realtime Cloud Database...",
    no_records: "No records registered for this subsystem domain.",
    drawer_back: "Back",
    modal_auth_title: "Engineering Gateway",
    modal_auth_sub: "Administrative Access Protocol",
    modal_auth_desc: "Enter authorization credentials to unlock live worksheet modification and cloud synchronization:",
    modal_auth_err: "Invalid credential token. Access rejected.",
    btn_cancel: "Cancel",
    btn_auth: "Authenticate",
    modal_export_title: "Executive Brief Export",
    modal_export_sub: "Documentation Scope",
    modal_export_desc: "Select subsystem domain to compile formatted operational brief:",
    btn_dismiss: "Dismiss",
    btn_gen_brief: "Generate Brief"
  },
  th: {
    brand_sub: "ความน่าเชื่อถือของสถานีไฟฟ้า",
    nav_heading: "คอนโซลข้อมูลอัจฉริยะ",
    nav_overview: "ภาพรวมระบบ (Overview)",
    nav_simulator: "แบบจำลอง What-If",
    panel_subsystem: "เลือกระบบย่อย (SUBSYSTEM)",
    admin_override: "จัดการข้อมูลแอดมิน",
    import_dataset: "นำเข้าชุดข้อมูลใหม่ (Excel)",
    sync_hint: "ซิงค์ข้อมูลเรียลไทม์ทุกอุปกรณ์",
    footer_desc: "ระบบวิเคราะห์ความน่าเชื่อถือและวงจรการบำรุงรักษาอุปกรณ์สถานีไฟฟ้า",
    search_placeholder: "ค้นหาอุปกรณ์, ลักษณะข้อบกพร่อง, สาเหตุ...",
    export_brief: "Export รายงาน",
    commit_excel: "บันทึก Excel",
    admin_gateway: "เข้าสู่ระบบแอดมิน",
    lead_engineer: "วิศวกรความน่าเชื่อถือ",
    cloud_sync_active: "ซิงค์ระบบคลาวด์ทำงานปกติ",
    mode_viewer: "โหมดดูข้อมูล (VIEWER CONSOLE)",
    mode_admin: "โหมดแอดมิน (ADMIN LIVE EDIT)",
    banner_title: "ระบบวิเคราะห์ความน่าเชื่อถือและประสิทธิภาพสถานีไฟฟ้า",
    banner_desc: "ติดตามความพร้อมใช้งาน (Availability) การกระจายตัวของข้อบกพร่อง และเพิ่มประสิทธิภาพการบำรุงรักษาอุปกรณ์สถานีไฟฟ้า",
    kpi_avail_title: "ความพร้อมใช้งานเฉลี่ย (Availability)",
    kpi_avail_target: "เป้าหมาย ≥ 96.00%",
    kpi_avail_footer: "เกณฑ์มาตรฐานความพร้อมใช้งาน",
    kpi_mtbf_title: "ระยะเวลาเฉลี่ยก่อนเสียหาย (MTBF)",
    kpi_mtbf_target: "ดัชนีความน่าเชื่อถือ",
    kpi_mtbf_footer: "ระยะเวลาทำงานเฉลี่ยระหว่างรอบชำรุด",
    kpi_mttr_title: "ระยะเวลาเฉลี่ยในการบำรุงรักษา (MTTR)",
    kpi_mttr_target: "เกณฑ์กำหนด ≤ 10 ชม.",
    kpi_mttr_footer: "เวลาเฉลี่ยที่ใช้ในการแก้ไขบำรุงรักษา",
    kpi_modes_title: "ลักษณะข้อบกพร่องที่พบ (Failure Modes)",
    kpi_modes_target: "รายการที่บันทึก",
    kpi_modes_footer: "จำนวนลักษณะข้อบกพร่องที่ตรวจสอบ",
    unit_hrs: "ชม.",
    tag_risk_prioritization: "การจัดลำดับความเสี่ยงเร่งด่วน",
    attention_vectors_title: "จุดที่ต้องเฝ้าระวังเป็นพิเศษ",
    lowest_avail_label: "อุปกรณ์ที่มีความพร้อมใช้งานต่ำสุด",
    inspect_btn: "ตรวจสอบ",
    lowest_avail_note: "ควรจัดลำดับการตรวจสอบเพื่อลดความเสี่ยงที่ระบบจะหยุดชะงักกะทันหัน",
    peak_mttr_label: "อุปกรณ์ที่ใช้เวลาบำรุงรักษานานที่สุด (Peak MTTR)",
    peak_mttr_note: "ควรเตรียมเครื่องมือพิเศษและสำรองอะไหล่ล่วงหน้าเพื่อลดเวลา Downtime",
    tag_root_cause: "การกระจายตัวของสาเหตุ",
    chart_cause_title: "สัดส่วนสาเหตุข้อบกพร่อง (Failure Cause)",
    click_segment_hint: "คลิกที่กราฟเพื่อเจาะลึกข้อมูล",
    table_title_prefix: "ตารางวิเคราะห์การบำรุงรักษาและ RAM: ระบบ",
    table_status_viewer: "โหมดอ่านอย่างเดียว (Viewer Mode)",
    table_status_admin: "โหมดแอดมิน: แก้ไข MTBF/MTTR แล้วคำนวณ Availability อัตโนมัติ",
    table_sub_title: "คลิกที่แถวอุปกรณ์เพื่อดูประวัติและการวิเคราะห์เชิงลึก",
    filter_all: "ทั้งหมด",
    filter_critical: "วิกฤต (< 96%)",
    filter_high_mttr: "MTTR สูง (> 10 ชม.)",
    connecting_cloud: "กำลังเชื่อมต่อฐานข้อมูลคลาวด์แบบเรียลไทม์...",
    no_records: "ไม่มีรายการข้อมูลในระบบย่อยนี้",
    drawer_back: "ย้อนกลับ",
    modal_auth_title: "ระบบยืนยันสิทธิ์แอดมิน",
    modal_auth_sub: "Engineering Administrative Access",
    modal_auth_desc: "กรุณากรอกรหัสผ่านเพื่อปลดล็อกการแก้ไขข้อมูลและซิงค์คลาวด์:",
    modal_auth_err: "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
    btn_cancel: "ยกเลิก",
    btn_auth: "ยืนยันสิทธิ์",
    modal_export_title: "พิมพ์รายงานสรุปผลผู้บริหาร",
    modal_export_sub: "Executive Brief Export",
    modal_export_desc: "เลือกระบบย่อยที่ต้องการสร้างรายงานสรุป:",
    btn_dismiss: "ปิดหน้าต่าง",
    btn_gen_brief: "พิมพ์รายงาน"
  }
};

function setLanguage(lang) {
  currentLang = lang;
  try {
    localStorage.setItem('RAM_DASHBOARD_LANG', lang);
  } catch (e) {}
  document.documentElement.lang = lang;

  document.querySelectorAll('.btn-lang').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  const dict = i18nData[lang] || i18nData.en;
  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    if (dict[key]) {
      elem.innerHTML = dict[key];
    }
  });

  const searchEl = document.getElementById('searchInput');
  if (searchEl) searchEl.placeholder = dict.search_placeholder;

  const titleEl = document.getElementById('currentSheetTitle');
  const sheetEl = document.getElementById('sheetSelect');
  if (titleEl && sheetEl && sheetEl.value) {
    titleEl.textContent = `${dict.table_title_prefix} ${sheetEl.value}`;
  }
  updateAuthUI();
}

// ============================================================
// 2. CORE VARIABLES & FIREBASE CONFIG
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyBqx1bOZmefAAftxirrlEjwWR8_-6gB0sQ",
  authDomain: "ram-substation.firebaseapp.com",
  projectId: "ram-substation",
  storageBucket: "ram-substation.firebasestorage.app",
  messagingSenderId: "937237145244",
  appId: "1:937237145244:web:8f554a10a8dcbba2306f59",
  measurementId: "G-NCSL5VJNYM"
};

try {
  firebase.initializeApp(firebaseConfig);
} catch (e) {}

const db = firebase.firestore();
const RAM_DOC_REF = db.collection('substation_data').doc('active_workbook');

let currentWorkbook = null;
let currentChart = null;
let currentActiveFilter = 'all';

const ADMIN_PASSWORD = '13102547'; 
let isAdmin = false;

const DEFAULT_EXCEL_FILE = 'ALL_RAM.xlsx';
const drillHistory = [];

// ============================================================
// 3. SECURE DOM EVENT BINDING
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Switch Language
  document.querySelectorAll('.btn-lang').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      setLanguage(this.getAttribute('data-lang'));
    });
  });

  // Admin Gateway Modal
  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const adminPasswordInput = document.getElementById('adminPassword');
  const loginError = document.getElementById('loginError');

  if (loginBtn && loginModal) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loginModal.classList.add('show');
      if (adminPasswordInput) {
        adminPasswordInput.value = '';
        adminPasswordInput.focus();
      }
      if (loginError) loginError.style.display = 'none';
    });
  }

  const closeLoginModal = document.getElementById('closeLoginModal');
  const cancelLoginModal = document.getElementById('cancelLoginModal');
  if (closeLoginModal) closeLoginModal.addEventListener('click', closeLogin);
  if (cancelLoginModal) cancelLoginModal.addEventListener('click', closeLogin);

  const submitLoginBtn = document.getElementById('submitLoginBtn');
  if (submitLoginBtn) submitLoginBtn.addEventListener('click', checkAdminPassword);
  if (adminPasswordInput) {
    adminPasswordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkAdminPassword();
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      isAdmin = false;
      updateAuthUI();
      const sheetSelect = document.getElementById('sheetSelect');
      if (currentWorkbook && sheetSelect) loadRamSheet(sheetSelect.value);
    });
  }

  // Upload Excel
  const fileInput = document.getElementById('excelFile');
  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(evt) {
        handleWorkbookData(new Uint8Array(evt.target.result), true);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  // Subsystem Selector
  const sheetSelect = document.getElementById('sheetSelect');
  if (sheetSelect) {
    sheetSelect.addEventListener('change', function(e) {
      if (currentWorkbook) {
        loadRamSheet(e.target.value);
        closeDrawer();
      }
    });
  }

  // Search & Filter
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.addEventListener('input', applyTableFilter);

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentActiveFilter = this.getAttribute('data-filter');
      applyTableFilter();
    });
  });

  // Drawer
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  const drawerBackBtn = document.getElementById('drawerBackBtn');
  if (drawerBackBtn) {
    drawerBackBtn.addEventListener('click', () => {
      if (drillHistory.length > 1) {
        drillHistory.pop();
        renderDrillView(drillHistory[drillHistory.length - 1], false);
      } else {
        closeDrawer();
      }
    });
  }

  // Export Events
  initExportEvents();

  // Load language & cloud database
  setLanguage(currentLang);
  initRealtimeCloudSync();
  
  // Initialize Upgraded Simulator
  initSimulatorEngine();
});

function closeLogin() {
  const loginModal = document.getElementById('loginModal');
  if (loginModal) loginModal.classList.remove('show');
}

function checkAdminPassword() {
  const adminPasswordInput = document.getElementById('adminPassword');
  const loginError = document.getElementById('loginError');
  const sheetSelect = document.getElementById('sheetSelect');

  if (adminPasswordInput && adminPasswordInput.value === ADMIN_PASSWORD) {
    isAdmin = true;
    updateAuthUI();
    closeLogin();
    if (currentWorkbook && sheetSelect) loadRamSheet(sheetSelect.value);
  } else {
    if (loginError) loginError.style.display = 'block';
  }
}

function updateAuthUI() {
  const dict = i18nData[currentLang] || i18nData.en;
  const loginBtn = document.getElementById('loginBtn');
  const userProfile = document.getElementById('userProfile');
  const adminUploadWidget = document.getElementById('adminUploadWidget');
  const saveExcelBtn = document.getElementById('saveExcelBtn');
  const modeBadge = document.getElementById('modeBadge');
  const editNotice = document.getElementById('editNotice');

  if (isAdmin) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (userProfile) userProfile.style.display = 'flex';
    if (adminUploadWidget) adminUploadWidget.style.display = 'block';
    if (saveExcelBtn) saveExcelBtn.style.display = 'flex';
    if (modeBadge) {
      modeBadge.textContent = dict.mode_admin;
      modeBadge.classList.add('admin');
    }
    if (editNotice) {
      editNotice.textContent = dict.table_status_admin;
      editNotice.style.color = '#8E7C93';
    }
  } else {
    if (loginBtn) loginBtn.style.display = 'flex';
    if (userProfile) userProfile.style.display = 'none';
    if (adminUploadWidget) adminUploadWidget.style.display = 'none';
    if (saveExcelBtn) saveExcelBtn.style.display = 'none';
    if (modeBadge) {
      modeBadge.textContent = dict.mode_viewer;
      modeBadge.classList.remove('admin');
    }
    if (editNotice) {
      editNotice.textContent = dict.table_status_viewer;
      editNotice.style.color = 'var(--text-secondary)';
    }
  }
}

// ============================================================
// 4. REALTIME DATABASE SYNC
// ============================================================
function initRealtimeCloudSync() {
  RAM_DOC_REF.onSnapshot((doc) => {
    if (doc.exists && doc.data().fileData) {
      const base64Data = doc.data().fileData;
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      handleWorkbookData(new Uint8Array(byteNumbers), false);
    } else {
      fetchDefaultRepoFile();
    }
  }, (error) => {
    console.warn('Firestore fallback to local:', error);
    fetchDefaultRepoFile();
  });
}

async function fetchDefaultRepoFile() {
  try {
    const response = await fetch(DEFAULT_EXCEL_FILE);
    if (!response.ok) throw new Error('Default file missing');
    const arrayBuffer = await response.arrayBuffer();
    handleWorkbookData(new Uint8Array(arrayBuffer), true);
  } catch (err) {
    showManualUploadPrompt();
  }
}

async function syncWorkbookToCloud() {
  if (!currentWorkbook) return;
  try {
    const base64Data = XLSX.write(currentWorkbook, { bookType: 'xlsx', type: 'base64' });
    await RAM_DOC_REF.set({
      fileData: base64Data,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy: 'Suwanan K.'
    });
  } catch (err) {
    console.error('Error syncing dataset:', err);
  }
}

function showManualUploadPrompt() {
  const tableContainer = document.getElementById('tableContainer');
  if (!tableContainer) return;
  tableContainer.innerHTML = `
    <div class="empty-state" style="cursor: pointer;" onclick="document.getElementById('excelFile').click()">
      <i class="fa-solid fa-cloud-arrow-up" style="font-size: 2.4rem; color: #8E7C93; margin-bottom: 12px;"></i>
      <p style="font-weight: 600; color: #343A40; margin-bottom: 4px;">Initialize Substation Dataset (ALL_RAM.xlsx)</p>
      <span style="font-size: 0.75rem; color: #888E94;">Click here to upload and publish data live to all connected devices</span>
    </div>
  `;
}

function handleWorkbookData(data, shouldPublishToCloud = false) {
  currentWorkbook = XLSX.read(data, { type: 'array' });

  if (shouldPublishToCloud) {
    syncWorkbookToCloud();
  }

  const sheetSelect = document.getElementById('sheetSelect');
  if (!sheetSelect) return;
  const prevSelected = sheetSelect.value;
  sheetSelect.innerHTML = '';
  currentWorkbook.SheetNames.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = (currentLang === 'th') ? `ระบบย่อย: ${name}` : `Subsystem: ${name}`;
    sheetSelect.appendChild(option);
  });

  const targetSheet = (prevSelected && currentWorkbook.SheetNames.includes(prevSelected))
    ? prevSelected
    : (currentWorkbook.SheetNames.includes('TR') ? 'TR' : currentWorkbook.SheetNames[0]);

  sheetSelect.value = targetSheet;
  loadRamSheet(targetSheet);

  const detailDrawer = document.getElementById('detailDrawer');
  if (detailDrawer && detailDrawer.classList.contains('open') && drillHistory.length > 0) {
    renderDrillView(drillHistory[drillHistory.length - 1], false);
  }

  // Update Simulator Equipment Dropdown
  if (typeof updateSimulatorEquipment === 'function') {
    updateSimulatorEquipment();
  }
}

// ============================================================
// 5. RAM MATRIX & CALCULATIONS
// ============================================================
function calculateAvailabilityFormula(mtbf, mttr) {
  if (mtbf <= 0 || (mtbf + mttr) <= 0) return 0;
  return (mtbf / (mtbf + mttr)) * 100;
}

function getNormalizedRows(sheetName) {
  if (!currentWorkbook || !currentWorkbook.Sheets[sheetName]) return [];
  const sheet = currentWorkbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json(sheet);

  return rawRows.map((r, index) => {
    const compKey = Object.keys(r).find(k => k.trim().toUpperCase() === 'COMPONENT');
    const idKey = Object.keys(r).find(k => ['CODE', 'FAILURE CODE', 'ID', 'EQUIPMENT ID', 'NO'].some(t => k.trim().toUpperCase().includes(t)));
    const mtbfKey = Object.keys(r).find(k => k.trim().toUpperCase() === 'MTBF');
    const mttrKey = Object.keys(r).find(k => k.trim().toUpperCase() === 'MTTR');
    const availKey = Object.keys(r).find(k => k.trim().toUpperCase() === 'AVAILABILITY');
    const causeKey = Object.keys(r).find(k => k.trim().toUpperCase().includes('CAUSE'));
    const modeKey = Object.keys(r).find(k => k.trim().toUpperCase().includes('MODE'));

    const mtbfVal = mtbfKey && !isNaN(r[mtbfKey]) ? Number(r[mtbfKey]) : 0;
    const mttrVal = mttrKey && !isNaN(r[mttrKey]) ? Number(r[mttrKey]) : 0;

    let availVal = 100;
    if (mtbfVal > 0 || mttrVal > 0) {
      availVal = calculateAvailabilityFormula(mtbfVal, mttrVal);
    } else if (availKey && !isNaN(r[availKey])) {
      const parsed = Number(r[availKey]);
      availVal = parsed <= 1 ? parsed * 100 : parsed;
    }

    const compName = compKey && r[compKey] ? String(r[compKey]).trim() : 'Unassigned Equipment';
    const failCode = idKey && r[idKey] ? String(r[idKey]).trim() : `FC-${index + 1}`;
    const failureCause = causeKey && r[causeKey] ? String(r[causeKey]).trim() : 'Aging / Operational Stress';
    const failureMode = modeKey && r[modeKey] ? String(r[modeKey]).trim() : 'Functional Failure';

    return {
      rowIndex: index + 1,
      id: failCode,
      component: compName,
      mtbf: Number(mtbfVal.toFixed(2)),
      mttr: Number(mttrVal.toFixed(2)),
      availability: Number(availVal.toFixed(2)),
      cause: failureCause,
      mode: failureMode,
      subsystem: sheetName
    };
  });
}

function calculateSheetMetrics(rows) {
  let totalMtbf = 0, countMtbf = 0;
  let totalMttr = 0, countMttr = 0;
  let totalAvail = 0, countAvail = 0;
  let minAvail = Infinity, minAvailItem = '-';
  let maxMttr = -Infinity, maxMttrItem = '-';
  const causeCounts = {};

  const dict = i18nData[currentLang] || i18nData.en;

  rows.forEach(r => {
    if (r.mtbf > 0) {
      totalMtbf += r.mtbf;
      countMtbf++;
    }
    if (r.mttr > 0) {
      totalMttr += r.mttr;
      countMttr++;
      if (r.mttr > maxMttr) {
        maxMttr = r.mttr;
        maxMttrItem = `${r.component} (${r.mttr.toFixed(2)} ${dict.unit_hrs})`;
      }
    }
    if (r.availability > 0) {
      totalAvail += r.availability;
      countAvail++;
      if (r.availability < minAvail) {
        minAvail = r.availability;
        minAvailItem = `${r.component} (${r.availability.toFixed(2)}%)`;
      }
    }

    if (r.cause) {
      const rawCauses = r.cause.split(/[,、]/);
      rawCauses.forEach(c => {
        const clean = c.trim();
        if (clean) causeCounts[clean] = (causeCounts[clean] || 0) + 1;
      });
    }
  });

  return {
    totalModes: rows.length,
    avgAvail: countAvail > 0 ? (totalAvail / countAvail).toFixed(2) : '-',
    avgMtbf: countMtbf > 0 ? (totalMtbf / countMtbf).toFixed(2) : '-',
    avgMttr: countMttr > 0 ? (totalMttr / countMttr).toFixed(2) : '-',
    minAvailItem: minAvail !== Infinity ? minAvailItem : '-',
    maxMttrItem: maxMttr !== -Infinity ? maxMttrItem : '-',
    causeCounts
  };
}

function loadRamSheet(sheetName) {
  const dict = i18nData[currentLang] || i18nData.en;
  const currentSheetTitle = document.getElementById('currentSheetTitle');
  const tableContainer = document.getElementById('tableContainer');
  const avgAvailElem = document.getElementById('avgAvail');
  const avgMtbfElem = document.getElementById('avgMtbf');
  const avgMttrElem = document.getElementById('avgMttr');
  const totalModesElem = document.getElementById('totalModes');
  const worstAvailElem = document.getElementById('worstAvail');
  const worstMttrElem = document.getElementById('worstMttr');

  if (currentSheetTitle) currentSheetTitle.textContent = `${dict.table_title_prefix} ${sheetName}`;
  const rows = getNormalizedRows(sheetName);

  if (rows.length === 0) {
    if (tableContainer) tableContainer.innerHTML = `<p style="padding: 24px; text-align: center; color: var(--text-muted);">${dict.no_records}</p>`;
    return;
  }

  const metrics = calculateSheetMetrics(rows);

  if (avgAvailElem) {
    avgAvailElem.textContent = metrics.avgAvail !== '-' ? metrics.avgAvail + '%' : '-';
    avgAvailElem.classList.remove('status-green', 'status-red');
    if (metrics.avgAvail !== '-') {
      avgAvailElem.classList.add(parseFloat(metrics.avgAvail) >= 96 ? 'status-green' : 'status-red');
    }
  }

  if (totalModesElem) totalModesElem.textContent = metrics.totalModes.toLocaleString();
  if (avgMtbfElem) avgMtbfElem.textContent = metrics.avgMtbf;
  if (avgMttrElem) avgMttrElem.textContent = metrics.avgMttr;
  if (worstAvailElem) worstAvailElem.textContent = metrics.minAvailItem;
  if (worstMttrElem) worstMttrElem.textContent = metrics.maxMttrItem;

  renderCauseChart(metrics.causeCounts);
  renderFormattedTable(currentWorkbook.Sheets[sheetName], sheetName);
}

function renderCauseChart(causeCounts) {
  const chartEl = document.getElementById('causeChart');
  if (!chartEl) return;
  const ctx = chartEl.getContext('2d');
  const sorted = Object.entries(causeCounts).sort((a, b) => b[1] - a[1]);
  const top4 = sorted.slice(0, 4);
  const others = sorted.slice(4).reduce((sum, item) => sum + item[1], 0);

  const labels = top4.map(i => i[0]);
  const data = top4.map(i => i[1]);
  if (others > 0) {
    labels.push((currentLang === 'th') ? 'สาเหตุอื่นๆ' : 'Other Determinants');
    data.push(others);
  }

  if (currentChart) currentChart.destroy();

  const chartColors = ['#8E7C93', '#66756B', '#B7A58A', '#5F666D', '#C5C2BA'];

  currentChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: chartColors,
        hoverOffset: 6,
        borderWidth: 2,
        borderColor: '#FFFFFF'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true,
            pointStyle: 'circle',
            font: { size: 11, family: 'Plus Jakarta Sans, Sarabun', weight: '500' },
            color: '#5F666D',
            padding: 10
          }
        }
      },
      cutout: '72%'
    }
  });
}

function renderFormattedTable(sheet, sheetName) {
  const tableContainer = document.getElementById('tableContainer');
  if (!tableContainer) return;
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
    if (isShortMetric || avgLen < 12) return 'col-compact';
    return 'col-expand';
  });

  const availColIndex = headers.findIndex(h => h && h.toString().trim().toUpperCase() === 'AVAILABILITY');
  const mtbfColIndex = headers.findIndex(h => h && h.toString().trim().toUpperCase() === 'MTBF');
  const mttrColIndex = headers.findIndex(h => h && h.toString().trim().toUpperCase() === 'MTTR');
  const compColIndex = headers.findIndex(h => h && h.toString().trim().toUpperCase() === 'COMPONENT');

  let tableHtml = '<table id="ramTable"><thead><tr>';
  headers.forEach((h, idx) => {
    tableHtml += `<th class="${colTypes[idx]}">${h || ''}</th>`;
  });
  tableHtml += '</tr></thead><tbody>';

  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    let rowMtbf = mtbfColIndex !== -1 && !isNaN(row[mtbfColIndex]) ? Number(row[mtbfColIndex]) : 0;
    let rowMttr = mttrColIndex !== -1 && !isNaN(row[mttrColIndex]) ? Number(row[mttrColIndex]) : 0;
    
    let rowAvail = (rowMtbf > 0 || rowMttr > 0) 
      ? calculateAvailabilityFormula(rowMtbf, rowMttr)
      : (availColIndex !== -1 && !isNaN(row[availColIndex]) ? (Number(row[availColIndex]) <= 1 ? Number(row[availColIndex]) * 100 : Number(row[availColIndex])) : 100);

    const componentName = compColIndex !== -1 && row[compColIndex] ? String(row[compColIndex]) : `Equipment #${i}`;

    tableHtml += `<tr data-row="${i}" data-component="${encodeURIComponent(componentName)}" data-avail="${rowAvail.toFixed(2)}" data-mttr="${rowMttr.toFixed(2)}">`;
    for (let j = 0; j < headers.length; j++) {
      let cellValue = row[j] !== undefined ? row[j] : '';
      const colClass = colTypes[j];
      const isCalculatedCol = (j === availColIndex);
      const editableAttr = (isAdmin && !isCalculatedCol) ? 'contenteditable="true"' : '';

      if (j === availColIndex) {
        const badgeClass = rowAvail >= 96 ? 'badge-pass' : 'badge-fail';
        tableHtml += `<td class="${colClass} cell-avail" data-col="${j}"><span class="${badgeClass}">${rowAvail.toFixed(2)}%</span></td>`;
      } else if (j === mtbfColIndex || j === mttrColIndex) {
        const numVal = !isNaN(cellValue) && cellValue !== '' ? Number(cellValue).toFixed(2) : cellValue;
        tableHtml += `<td class="${colClass}" data-col="${j}" ${editableAttr}>${numVal}</td>`;
      } else {
        tableHtml += `<td class="${colClass}" data-col="${j}" ${editableAttr}>${cellValue}</td>`;
      }
    }
    tableHtml += '</tr>';
  }

  tableHtml += '</tbody></table>';
  tableContainer.innerHTML = tableHtml;

  document.querySelectorAll('#ramTable tbody tr').forEach(tr => {
    tr.addEventListener('click', function(e) {
      if (isAdmin && e.target.hasAttribute('contenteditable')) return;
      const compName = decodeURIComponent(this.getAttribute('data-component'));
      openDrillEquipment(compName);
    });
  });

  applyTableFilter();
}

function applyTableFilter() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;
  const query = searchInput.value.toLowerCase();
  const trs = document.querySelectorAll('#ramTable tbody tr');

  trs.forEach(tr => {
    const text = tr.textContent.toLowerCase();
    const avail = parseFloat(tr.getAttribute('data-avail'));
    const mttr = parseFloat(tr.getAttribute('data-mttr'));

    const matchesSearch = text.includes(query);
    let matchesFilter = true;

    if (currentActiveFilter === 'critical') matchesFilter = avail < 96;
    else if (currentActiveFilter === 'high-mttr') matchesFilter = mttr > 10;

    tr.style.display = (matchesSearch && matchesFilter) ? '' : 'none';
  });
}

// ============================================================
// 6. UPGRADED RAM WHAT-IF SIMULATOR ENGINE (COMPLETE)
// ============================================================
let updateSimulatorEquipment = null;

function initSimulatorEngine() {
  // Predefined simulated parameter dictionary based on failure causes
  const simulatedPresetRegistry = {
    "GIS": {
      "Gas System Failure": {
        "Gas Leakage": 18,
        "Moisture Ingress": 24,
        "Density Monitor Trip": 8
      },
      "Insulation Failure": {
        "Insulation Defect": 12,
        "Partial Discharge Breakdown": 36
      },
      "Control System Failure": {
        "Control Circuit Failure": 8,
        "Auxiliary Switch Malfunction": 6
      }
    },
    "TR": {
      "Winding Failure": {
        "Inter-turn Short Circuit": 72,
        "Winding Deformation": 96
      },
      "Bushing Failure": {
        "Bushing Flashover": 24,
        "Capacitance Tap Degradation": 16
      },
      "OLTC Failure": {
        "Contact Wear": 14,
        "Mechanism Jam": 10
      }
    },
    "HV": {
      "Operating Mechanism Failure": {
        "Trip Coil Open Circuit": 6,
        "Linkage Binding": 12
      },
      "Interrupter Failure": {
        "Nozzle Erosion": 20,
        "Vacuum Loss": 30
      }
    },
    "MV": {
      "Busbar Breakdown": {
        "Flashover": 12,
        "Insulator Cracking": 18
      },
      "Switchgear Contact Defect": {
        "Contact Overheating": 8,
        "Spring Fatigue": 6
      }
    },
    "LV": {
      "Thermal Overload": {
        "Terminal Loose Connection": 4,
        "Cable Insulation Breakdown": 8
      },
      "Switching Mechanism": {
        "Breaker Jammed": 6
      }
    }
  };

  let selectedEquipment = "GIS";
  let selectedMode = "";
  let selectedCause = "";
  let activePresetMttr = 18;
  let isCustomMode = false;
  let simChartInstance = null;

  // DOM Elements
  const eqSelect = document.getElementById("simEquipmentSelect");
  const modeSelect = document.getElementById("simFailureModeSelect");
  const causeSelect = document.getElementById("simFailureCauseSelect");
  
  const presetCard = document.getElementById("simPresetCard");
  const presetVal = document.getElementById("simPresetVal");
  const presetHint = document.getElementById("simPresetHint");
  const mttrInput = document.getElementById("simMttrInput");
  const mtbfInput = document.getElementById("simMtbfInput");
  const mtbfSlider = document.getElementById("simMtbfSlider");
  const targetInput = document.getElementById("simTargetInput");

  const modePresetBtn = document.getElementById("simModePresetBtn");
  const modeCustomBtn = document.getElementById("simModeCustomBtn");
  const runBtn = document.getElementById("simRunBtn");
  const resetBtn = document.getElementById("simResetBtn");

  const resBaseline = document.getElementById("simResBaseline");
  const resSimulated = document.getElementById("simResSimulated");
  const resChange = document.getElementById("simResChange");
  const resSimBox = document.getElementById("simResSimulatedBox");

  const calcMtbf = document.getElementById("calcParamMtbf");
  const calcMttr = document.getElementById("calcParamMttr");
  const calcNum = document.getElementById("calcFormulaNum");
  const calcDen = document.getElementById("calcFormulaDen");
  const calcRes = document.getElementById("calcFormulaRes");

  const refTitle = document.getElementById("simRefEquipmentTitle");
  const refTableBody = document.getElementById("simRefTableBody");
  const refToggleBtn = document.getElementById("simRefToggleBtn");
  const refBody = document.getElementById("simRefBody");

  updateSimulatorEquipment = function() {
    if (!eqSelect) return;
    eqSelect.innerHTML = '<option value="" disabled selected>Select Equipment...</option>';

    const sheets = (currentWorkbook && currentWorkbook.SheetNames) ? currentWorkbook.SheetNames : [];
    const available = Object.keys(simulatedPresetRegistry);
    const combined = [...new Set([...sheets, ...available])];

    combined.forEach(eq => {
      const opt = document.createElement("option");
      opt.value = eq;
      opt.textContent = eq;
      eqSelect.appendChild(opt);
    });

    if (eqSelect.options.length > 1) {
      eqSelect.selectedIndex = 1;
      eqSelect.dispatchEvent(new Event("change"));
    }
  };

  // 1. Equipment Select Cascade
  eqSelect?.addEventListener("change", function() {
    selectedEquipment = this.value;
    selectedMode = "";
    selectedCause = "";

    modeSelect.innerHTML = '<option value="" disabled selected>Select Failure Mode...</option>';
    modeSelect.disabled = false;
    causeSelect.innerHTML = '<option value="" disabled selected>Select Failure Cause...</option>';
    causeSelect.disabled = true;

    // Retrieve Modes from registry or sheet
    let modes = [];
    if (simulatedPresetRegistry[selectedEquipment]) {
      modes = Object.keys(simulatedPresetRegistry[selectedEquipment]);
    } else {
      const rows = getNormalizedRows(selectedEquipment);
      modes = [...new Set(rows.map(r => r.mode))].filter(Boolean);
      if (modes.length === 0) modes = ["General Electrical Defect", "Mechanical Stress"];
    }

    modes.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      modeSelect.appendChild(opt);
    });

    // Auto-select first mode
    if (modeSelect.options.length > 1) {
      modeSelect.selectedIndex = 1;
      modeSelect.dispatchEvent(new Event("change"));
    }

    // Update Baseline Availability
    const rows = getNormalizedRows(selectedEquipment);
    if (rows.length > 0) {
      const m = calculateSheetMetrics(rows);
      if (resBaseline && m.avgAvail !== '-') {
        resBaseline.textContent = `${m.avgAvail}%`;
      }
    }

    renderReferenceTable(selectedEquipment);
  });

  // 2. Failure Mode Select Cascade
  modeSelect?.addEventListener("change", function() {
    selectedMode = this.value;
    selectedCause = "";

    causeSelect.innerHTML = '<option value="" disabled selected>Select Failure Cause...</option>';
    causeSelect.disabled = false;

    let causes = [];
    if (simulatedPresetRegistry[selectedEquipment] && simulatedPresetRegistry[selectedEquipment][selectedMode]) {
      causes = Object.keys(simulatedPresetRegistry[selectedEquipment][selectedMode]);
    } else {
      const rows = getNormalizedRows(selectedEquipment);
      causes = [...new Set(rows.filter(r => r.mode === selectedMode).map(r => r.cause))].filter(Boolean);
      if (causes.length === 0) causes = ["Thermal Aging", "Operational Overload"];
    }

    causes.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      causeSelect.appendChild(opt);
    });

    // Auto-select first cause
    if (causeSelect.options.length > 1) {
      causeSelect.selectedIndex = 1;
      causeSelect.dispatchEvent(new Event("change"));
    }
  });

  // 3. Failure Cause Select: Auto Preset MTTR
  causeSelect?.addEventListener("change", function() {
    selectedCause = this.value;

    let preset = 18;
    if (simulatedPresetRegistry[selectedEquipment] &&
        simulatedPresetRegistry[selectedEquipment][selectedMode] &&
        simulatedPresetRegistry[selectedEquipment][selectedMode][selectedCause]) {
      preset = simulatedPresetRegistry[selectedEquipment][selectedMode][selectedCause];
    } else {
      const rows = getNormalizedRows(selectedEquipment);
      const match = rows.find(r => r.cause === selectedCause);
      if (match && match.mttr > 0) preset = match.mttr;
    }

    activePresetMttr = preset;
    if (presetVal) presetVal.textContent = activePresetMttr;
    if (presetHint) presetHint.textContent = `Auto-filled based on: ${selectedCause}`;

    if (!isCustomMode && mttrInput) {
      mttrInput.value = activePresetMttr;
    }

    runSimulation();
  });

  // Preset vs Custom Toggle
  modePresetBtn?.addEventListener("click", function() {
    isCustomMode = false;
    this.classList.add("active");
    modeCustomBtn?.classList.remove("active");
    if (mttrInput) {
      mttrInput.readOnly = true;
      mttrInput.value = activePresetMttr;
    }
    if (presetCard) presetCard.style.opacity = "1";
    runSimulation();
  });

  modeCustomBtn?.addEventListener("click", function() {
    isCustomMode = true;
    this.classList.add("active");
    modePresetBtn?.classList.remove("active");
    if (mttrInput) {
      mttrInput.readOnly = false;
      mttrInput.focus();
    }
    if (presetCard) presetCard.style.opacity = "0.75";
  });

  // Slider Synchronizations
  mtbfSlider?.addEventListener("input", function() {
    if (mtbfInput) mtbfInput.value = this.value;
    runSimulation();
  });

  mtbfInput?.addEventListener("input", function() {
    if (mtbfSlider) mtbfSlider.value = this.value;
    runSimulation();
  });

  mttrInput?.addEventListener("input", function() {
    if (isCustomMode) runSimulation();
  });

  targetInput?.addEventListener("input", runSimulation);

  // Toggle Reference Matrix
  document.getElementById("simRefHeader")?.addEventListener("click", function() {
    if (refBody) refBody.classList.toggle("collapsed");
    if (refToggleBtn) refToggleBtn.classList.toggle("collapsed");
  });

  function renderReferenceTable(eq) {
    if (refTitle) refTitle.textContent = `${eq} Hierarchy`;
    if (!refTableBody) return;
    refTableBody.innerHTML = "";

    const dataset = simulatedPresetRegistry[eq];
    if (dataset) {
      Object.entries(dataset).forEach(([mode, causes]) => {
        Object.entries(causes).forEach(([cause, hours]) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td><strong>${mode}</strong></td>
            <td>${cause}</td>
            <td style="text-align: right; font-weight: 700; color: var(--brand-champagne);">${hours} hrs</td>
          `;
          refTableBody.appendChild(row);
        });
      });
    } else {
      const rows = getNormalizedRows(eq);
      if (rows.length === 0) {
        refTableBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color: var(--text-muted);">No records available.</td></tr>`;
        return;
      }
      rows.slice(0, 8).forEach(r => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><strong>${r.mode}</strong></td>
          <td>${r.cause}</td>
          <td style="text-align: right; font-weight: 700; color: var(--brand-champagne);">${r.mttr.toFixed(1)} hrs</td>
        `;
        refTableBody.appendChild(row);
      });
    }
  }

  // Calculation Engine & Visualization
  function runSimulation() {
    const currentMtbf = Math.max(1, parseFloat(mtbfInput?.value) || 4320);
    const currentMttr = Math.max(0.1, parseFloat(mttrInput?.value) || activePresetMttr);
    const targetAvail = Math.min(99.99, Math.max(0, parseFloat(targetInput?.value) || 96.00));

    // Availability = MTBF / (MTBF + MTTR)
    const simAvail = calculateAvailabilityFormula(currentMtbf, currentMttr);

    let baselineAvail = 99.12;
    if (resBaseline) {
      const parsed = parseFloat(resBaseline.textContent.replace("%", "").trim());
      if (!isNaN(parsed) && parsed > 0) baselineAvail = parsed;
    }

    const delta = simAvail - baselineAvail;

    // Update Result Cards
    if (resSimulated) resSimulated.textContent = `${simAvail.toFixed(2)}%`;
    if (resChange) {
      const sign = delta >= 0 ? "+" : "";
      resChange.textContent = `${sign}${delta.toFixed(2)}%`;
      resChange.style.color = delta >= 0 ? "var(--status-healthy)" : "var(--status-warning)";
    }

    // State styling against Target Availability
    if (resSimBox) {
      if (simAvail >= targetAvail) {
        resSimBox.classList.remove("warning-state");
        if (resSimulated) resSimulated.style.color = "var(--status-healthy)";
      } else {
        resSimBox.classList.add("warning-state");
        if (resSimulated) resSimulated.style.color = "var(--status-warning)";
      }
    }

    // Math Walkthrough Display
    if (calcMtbf) calcMtbf.textContent = `${currentMtbf.toLocaleString()} hrs`;
    if (calcMttr) calcMttr.textContent = `${currentMttr.toFixed(1)} hrs`;
    if (calcNum) calcNum.textContent = currentMtbf.toLocaleString();
    if (calcDen) calcDen.textContent = `${currentMtbf.toLocaleString()} + ${currentMttr.toFixed(1)}`;
    if (calcRes) {
      calcRes.textContent = `${simAvail.toFixed(2)}%`;
      calcRes.style.color = simAvail >= targetAvail ? "var(--status-healthy)" : "var(--status-warning)";
    }

    renderComparisonChart(baselineAvail, simAvail, targetAvail);
  }

  // Chart Rendering
  function renderComparisonChart(baseline, simulated, target) {
    const canvas = document.getElementById("simComparisonChart");
    if (!canvas) return;

    if (simChartInstance) {
      simChartInstance.destroy();
    }

    const ctx = canvas.getContext("2d");
    simChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Baseline", "Simulated Scenario"],
        datasets: [{
          data: [baseline, simulated],
          backgroundColor: ["#8E7C93", simulated >= target ? "#66756B" : "#A65D57"],
          borderRadius: 4,
          barThickness: 32
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `Availability: ${ctx.parsed.y.toFixed(2)}%`
            }
          }
        },
        scales: {
          y: {
            min: Math.max(80, Math.floor(Math.min(baseline, simulated, target) - 2)),
            max: 100,
            grid: { color: "rgba(0, 0, 0, 0.05)" },
            ticks: {
              color: "#888E94",
              font: { size: 10 },
              callback: (val) => `${val}%`
            }
          },
          x: {
            grid: { display: false },
            ticks: { color: "#888E94", font: { size: 10, family: 'Plus Jakarta Sans' } }
          }
        }
      },
      plugins: [{
        id: "targetLine",
        afterDraw: (chart) => {
          const yAxis = chart.scales.y;
          const xAxis = chart.scales.x;
          if (target < yAxis.min || target > yAxis.max) return;

          const yPos = yAxis.getPixelForValue(target);
          const c = chart.ctx;
          c.save();
          c.beginPath();
          c.setLineDash([4, 4]);
          c.strokeStyle = "#B7A58A";
          c.lineWidth = 1.5;
          c.moveTo(xAxis.left, yPos);
          c.lineTo(xAxis.right, yPos);
          c.stroke();
          
          c.fillStyle = "#B7A58A";
          c.font = "bold 9px 'Plus Jakarta Sans'";
          c.fillText(`Target: ${target}%`, xAxis.right - 60, yPos - 4);
          c.restore();
        }
      }]
    });
  }

  // Reset Button
  resetBtn?.addEventListener("click", () => {
    if (eqSelect && eqSelect.options.length > 1) {
      eqSelect.selectedIndex = 1;
      eqSelect.dispatchEvent(new Event("change"));
    }
    if (mtbfInput) mtbfInput.value = 4320;
    if (mtbfSlider) mtbfSlider.value = 4320;
    if (targetInput) targetInput.value = 96.00;
    modePresetBtn?.click();
    runSimulation();
  });

  runBtn?.addEventListener("click", runSimulation);

  updateSimulatorEquipment();
}

// ============================================================
// 7. DRAWER & EXPORT REPORT ENGINE
// ============================================================
function openDrawer() {
  const detailDrawer = document.getElementById('detailDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  if (!detailDrawer || !drawerBackdrop) return;
  detailDrawer.classList.add('open');
  drawerBackdrop.classList.add('show');
  detailDrawer.setAttribute('aria-hidden', 'false');
}

function closeDrawer() {
  const detailDrawer = document.getElementById('detailDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  if (!detailDrawer || !drawerBackdrop) return;
  detailDrawer.classList.remove('open');
  drawerBackdrop.classList.remove('show');
  detailDrawer.setAttribute('aria-hidden', 'true');
  drillHistory.length = 0;
}

function pushDrillView(viewState) {
  drillHistory.push(viewState);
  renderDrillView(viewState, true);
}

function renderDrillView(viewState, shouldOpen = true) {
  const drawerBackBtn = document.getElementById('drawerBackBtn');
  const drawerLevelTag = document.getElementById('drawerLevelTag');

  if (drawerBackBtn) drawerBackBtn.style.display = drillHistory.length > 1 ? 'inline-flex' : 'none';
  if (drawerLevelTag) {
    drawerLevelTag.textContent = viewState.level === 3 
      ? ((currentLang === 'th') ? 'ระดับ 3 • รายละเอียดอุปกรณ์เชิงลึก' : 'LEVEL 3 • EQUIPMENT DEEP-DIVE')
      : ((currentLang === 'th') ? 'ระดับ 2 • รายละเอียดเชิงวิเคราะห์' : 'LEVEL 2 • ANALYTICAL DETAIL');
  }

  if (viewState.type === 'category') {
    renderCategoryDetail(viewState.category);
  } else if (viewState.type === 'kpi') {
    renderKpiDetail(viewState.metric);
  } else if (viewState.type === 'equipment') {
    renderEquipmentDetail(viewState.equipmentName);
  }

  if (shouldOpen) openDrawer();
}

function openDrillEquipment(rawCompName) {
  const compName = decodeURIComponent(rawCompName);
  pushDrillView({ type: 'equipment', equipmentName: compName, level: 3 });
}

function renderEquipmentDetail(compName) {
  const drawerContent = document.getElementById('drawerContent');
  const sheetSelect = document.getElementById('sheetSelect');
  if (!drawerContent || !sheetSelect) return;
  const currentSheet = sheetSelect.value;
  const allRows = getNormalizedRows(currentSheet);
  const matchedRows = allRows.filter(r => r.component.toLowerCase() === compName.toLowerCase());
  const dict = i18nData[currentLang] || i18nData.en;
  
  if (matchedRows.length === 0) {
    drawerContent.innerHTML = `<p>${(currentLang === 'th') ? 'ไม่พบข้อมูลอุปกรณ์' : 'Equipment details unavailable.'}</p>`;
    return;
  }

  const primary = matchedRows[0];
  const isAttention = primary.availability < 96 || primary.mttr > 10;
  const statusBadge = isAttention
    ? `<span class="badge-status-attention"><i class="fa-solid fa-triangle-exclamation"></i> ${(currentLang === 'th') ? 'ต้องเฝ้าระวัง' : 'ATTENTION REQUIRED'}</span>`
    : `<span class="badge-status-normal"><i class="fa-solid fa-check"></i> ${(currentLang === 'th') ? 'สถานะปกติ' : 'NORMAL OPERATIONAL'}</span>`;

  let html = `
    <div class="drawer-title-group">
      <h2>${primary.component}</h2>
      <div class="drawer-subtitle">
        <span>${primary.id}</span>
        <span>•</span>
        <span>${(currentLang === 'th') ? 'ระบบย่อย' : 'Subsystem'}: ${currentSheet}</span>
        <span>•</span>
        ${statusBadge}
      </div>
    </div>

    <div class="drawer-kpi-strip">
      <div class="drawer-mini-kpi">
        <span>Availability</span>
        <strong style="color: ${primary.availability >= 96 ? '#66756B' : '#A65D57'};">${primary.availability.toFixed(2)}%</strong>
      </div>
      <div class="drawer-mini-kpi">
        <span>MTBF</span>
        <strong>${primary.mtbf.toFixed(2)} ${dict.unit_hrs}</strong>
      </div>
      <div class="drawer-mini-kpi">
        <span>MTTR</span>
        <strong style="color: ${primary.mttr > 10 ? '#A65D57' : 'inherit'};">${primary.mttr.toFixed(2)} ${dict.unit_hrs}</strong>
      </div>
      <div class="drawer-mini-kpi">
        <span>${(currentLang === 'th') ? 'จำนวนลักษณะข้อบกพร่อง' : 'Failure Modes'}</span>
        <strong>${matchedRows.length}</strong>
      </div>
    </div>

    <div class="drawer-section">
      <span class="drawer-section-title">${(currentLang === 'th') ? 'รายการข้อบกพร่องที่บันทึก' : 'Registered Subsystem Events'}</span>
      <table class="drawer-table">
        <thead>
          <tr>
            <th>${(currentLang === 'th') ? 'ลักษณะข้อบกพร่อง' : 'Mode'}</th>
            <th>${(currentLang === 'th') ? 'สาเหตุ' : 'Reported Cause'}</th>
            <th>Downtime</th>
          </tr>
        </thead>
        <tbody>
  `;

  matchedRows.forEach(r => {
    html += `
      <tr>
        <td><strong>${r.mode}</strong></td>
        <td>${r.cause}</td>
        <td>${r.mttr.toFixed(2)}h</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  drawerContent.innerHTML = html;
}

function initExportEvents() {
  const openExportModalBtn = document.getElementById('openExportModalBtn');
  const exportModal = document.getElementById('exportModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const confirmPrintBtn = document.getElementById('confirmPrintBtn');

  if (openExportModalBtn) {
    openExportModalBtn.addEventListener('click', function() {
      const sheetSelect = document.getElementById('sheetSelect');
      const sheetOptionsList = document.getElementById('sheetOptionsList');
      if (!currentWorkbook || !sheetSelect || !sheetOptionsList || !exportModal) return;

      const currentSheet = sheetSelect.value;
      sheetOptionsList.innerHTML = '';

      const currentOption = `
        <label class="sheet-radio-item">
          <input type="radio" name="printSheetTarget" value="${currentSheet}" checked />
          <span><strong>${(currentLang === 'th') ? 'ระบบย่อยที่กำลังเปิดอยู่' : 'Active Workspace Subsystem'} (${currentSheet})</strong></span>
        </label>
      `;
      sheetOptionsList.insertAdjacentHTML('beforeend', currentOption);

      currentWorkbook.SheetNames.forEach(name => {
        if (name !== currentSheet) {
          const item = `
            <label class="sheet-radio-item">
              <input type="radio" name="printSheetTarget" value="${name}" />
              <span>${(currentLang === 'th') ? 'ระบบย่อย' : 'Subsystem Scope'}: ${name}</span>
            </label>
          `;
          sheetOptionsList.insertAdjacentHTML('beforeend', item);
        }
      });

      exportModal.classList.add('show');
    });
  }

  function closeExport() {
    if (exportModal) exportModal.classList.remove('show');
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeExport);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeExport);

  if (confirmPrintBtn) {
    confirmPrintBtn.addEventListener('click', function() {
      const selectedRadio = document.querySelector('input[name="printSheetTarget"]:checked');
      if (!selectedRadio) return;

      const targetSheet = selectedRadio.value;
      closeExport();
      buildPrintView(targetSheet);

      setTimeout(() => { window.print(); }, 300);
    });
  }
}

function buildPrintView(targetSheet) {
  const printContainer = document.getElementById('printContainer');
  if (!printContainer || !currentWorkbook) return;
  printContainer.innerHTML = '';
  const sheetsToPrint = targetSheet === '__ALL__' ? currentWorkbook.SheetNames : [targetSheet];
  const dict = i18nData[currentLang] || i18nData.en;

  sheetsToPrint.forEach(sName => {
    const rows = getNormalizedRows(sName);
    const metrics = calculateSheetMetrics(rows);
    const sheet = currentWorkbook.Sheets[sName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    if (jsonData.length === 0) return;

    const headers = jsonData[0];
    const availColIndex = headers.findIndex(h => h && h.toString().trim().toUpperCase() === 'AVAILABILITY');
    const mtbfColIndex = headers.findIndex(h => h && h.toString().trim().toUpperCase() === 'MTBF');
    const mttrColIndex = headers.findIndex(h => h && h.toString().trim().toUpperCase() === 'MTTR');

    let pageHtml = `
      <div class="print-page">
        <div class="print-header">
          <div>
            <h2>${(currentLang === 'th') ? 'รายงานสรุปผลการวิเคราะห์การบำรุงรักษาและ RAM' : 'RAM Analytics Operational Brief'}: Subsystem ${sName}</h2>
            <span style="font-size: 0.72rem; color: #666;">Substation Reliability, Availability & Maintenance Performance Data</span>
          </div>
          <div class="meta">
            <div>Lead Analyst: <strong>Suwanan K. (${dict.lead_engineer})</strong></div>
            <div>Documentation Timestamp: ${new Date().toLocaleDateString(currentLang === 'th' ? 'th-TH' : 'en-GB')}</div>
          </div>
        </div>

        <div class="print-kpi-grid">
          <div class="print-kpi-item">
            <span>${dict.kpi_avail_title} (${dict.kpi_avail_target})</span>
            <strong>${metrics.avgAvail !== '-' ? metrics.avgAvail + '%' : '-'}</strong>
          </div>
          <div class="print-kpi-item">
            <span>${dict.kpi_mtbf_title}</span>
            <strong>${metrics.avgMtbf} ${dict.unit_hrs}</strong>
          </div>
          <div class="print-kpi-item">
            <span>${dict.kpi_mttr_title}</span>
            <strong>${metrics.avgMttr} ${dict.unit_hrs}</strong>
          </div>
          <div class="print-kpi-item">
            <span>${dict.kpi_modes_title}</span>
            <strong>${metrics.totalModes}</strong>
          </div>
        </div>

        <table class="print-table">
          <thead><tr>
    `;

    headers.forEach(h => { pageHtml += `<th>${h || ''}</th>`; });
    pageHtml += `</tr></thead><tbody>`;

    for (let i = 1; i < jsonData.length; i++) {
      const r = jsonData[i];
      let rowMtbf = mtbfColIndex !== -1 && !isNaN(r[mtbfColIndex]) ? Number(r[mtbfColIndex]) : 0;
      let rowMttr = mttrColIndex !== -1 && !isNaN(r[mttrColIndex]) ? Number(r[mttrColIndex]) : 0;
      let rowAvail = (rowMtbf > 0 || rowMttr > 0) ? calculateAvailabilityFormula(rowMtbf, rowMttr) : 100;

      pageHtml += `<tr>`;
      for (let j = 0; j < headers.length; j++) {
        let val = r[j] !== undefined ? r[j] : '';
        if (j === availColIndex) {
          const color = rowAvail >= 96 ? '#66756B' : '#A65D57';
          pageHtml += `<td style="color: ${color}; font-weight: bold; text-align: center;">${rowAvail.toFixed(2)}%</td>`;
        } else if (j === mtbfColIndex || j === mttrColIndex) {
          pageHtml += `<td>${!isNaN(val) && val !== '' ? Number(val).toFixed(2) : val}</td>`;
        } else {
          pageHtml += `<td>${val}</td>`;
        }
      }
      pageHtml += `</tr>`;
    }

    pageHtml += `</tbody></table></div>`;
    printContainer.insertAdjacentHTML('beforeend', pageHtml);
  });
}
