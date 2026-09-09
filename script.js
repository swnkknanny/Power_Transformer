// ============================================================
// MULTI-LANGUAGE SYSTEM (EN / TH)
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
  localStorage.setItem('RAM_DASHBOARD_LANG', lang);
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

  if (sheetSelect && sheetSelect.value) {
    currentSheetTitle.textContent = `${dict.table_title_prefix} ${sheetSelect.value}`;
  }
  updateAuthUI();

  if (typeof recalculateWhatIfScenario === 'function') {
    recalculateWhatIfScenario();
  }
}

// ============================================================
// FIREBASE CONFIGURATION & INITIALIZATION
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

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const RAM_DOC_REF = db.collection('substation_data').doc('active_workbook');

let currentWorkbook = null;
let currentChart = null;
let currentActiveFilter = 'all';

const ADMIN_PASSWORD = '13102547'; 
let isAdmin = false;

const DEFAULT_EXCEL_FILE = 'ALL_RAM.xlsx';

const drillHistory = [];
let activeSegmentIndex = null;

// DOM Elements: Core Dashboard
const fileInput = document.getElementById('excelFile');
const sheetSelect = document.getElementById('sheetSelect');
const tableContainer = document.getElementById('tableContainer');
const currentSheetTitle = document.getElementById('currentSheetTitle');
const searchInput = document.getElementById('searchInput');
const editNotice = document.getElementById('editNotice');
const modeBadge = document.getElementById('modeBadge');

const adminUploadWidget = document.getElementById('adminUploadWidget');
const saveExcelBtn = document.getElementById('saveExcelBtn');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userProfile = document.getElementById('userProfile');

const loginModal = document.getElementById('loginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const cancelLoginModal = document.getElementById('cancelLoginModal');
const submitLoginBtn = document.getElementById('submitLoginBtn');
const adminPasswordInput = document.getElementById('adminPassword');
const loginError = document.getElementById('loginError');

const exportModal = document.getElementById('exportModal');
const openExportModalBtn = document.getElementById('openExportModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const confirmPrintBtn = document.getElementById('confirmPrintBtn');
const sheetOptionsList = document.getElementById('sheetOptionsList');
const printContainer = document.getElementById('printContainer');

const avgAvailElem = document.getElementById('avgAvail');
const avgMtbfElem = document.getElementById('avgMtbf');
const avgMttrElem = document.getElementById('avgMttr');
const totalModesElem = document.getElementById('totalModes');
const worstAvailElem = document.getElementById('worstAvail');
const worstMttrElem = document.getElementById('worstMttr');

// Drawer Elements
const detailDrawer = document.getElementById('detailDrawer');
const drawerBackdrop = document.getElementById('drawerBackdrop');
const drawerCloseBtn = document.getElementById('drawerCloseBtn');
const drawerBackBtn = document.getElementById('drawerBackBtn');
const drawerContent = document.getElementById('drawerContent');
const drawerLevelTag = document.getElementById('drawerLevelTag');

// Simulator Elements
const simScenarioSelect = document.getElementById('simScenarioSelect');
const simResetBtn = document.getElementById('simResetBtn');
const simCompName = document.getElementById('simCompName');
const simFailMode = document.getElementById('simFailMode');
const simFailCause = document.getElementById('simFailCause');

const simBaseMtbf = document.getElementById('simBaseMtbf');
const simBaseMttr = document.getElementById('simBaseMttr');
const simBaseAvail = document.getElementById('simBaseAvail');

const simMttrSlider = document.getElementById('simMttrSlider');
const simMttrNum = document.getElementById('simMttrNum');
const simMtbfSlider = document.getElementById('simMtbfSlider');
const simMtbfNum = document.getElementById('simMtbfNum');
const simTargetSlider = document.getElementById('simTargetSlider');
const simTargetNum = document.getElementById('simTargetNum');

const simBoardBaseAvail = document.getElementById('simBoardBaseAvail');
const simBoardScenAvail = document.getElementById('simBoardScenAvail');
const simBoardDiffAvail = document.getElementById('simBoardDiffAvail');
const simBoardScenarioBox = document.getElementById('simBoardScenarioBox');

const simCmpBaseMtbf = document.getElementById('simCmpBaseMtbf');
const simCmpScenMtbf = document.getElementById('simCmpScenMtbf');
const simCmpDeltaMtbf = document.getElementById('simCmpDeltaMtbf');

const simCmpBaseMttr = document.getElementById('simCmpBaseMttr');
const simCmpScenMttr = document.getElementById('simCmpScenMttr');
const simCmpDeltaMttr = document.getElementById('simCmpDeltaMttr');

const simCmpBaseAvail = document.getElementById('simCmpBaseAvail');
const simCmpScenAvail = document.getElementById('simCmpScenAvail');
const simCmpDeltaAvail = document.getElementById('simCmpDeltaAvail');

const simFeasibilityBadge = document.getElementById('simFeasibilityBadge');
const simInterpretationText = document.getElementById('simInterpretationText');
const simTakeawayText = document.getElementById('simTakeawayText');

let simCurrentMode = 'mttr';
let simActiveRow = null;

// ============================================================
// REALTIME FIREBASE SYNC ENGINE
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
      const byteArray = new Uint8Array(byteNumbers);
      handleWorkbookData(byteArray, false);
    } else {
      fetchDefaultRepoFile();
    }
  }, (error) => {
    console.warn('Firestore snapshot error, falling back to local file:', error);
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
    console.error('Error syncing dataset to Firebase:', err);
  }
}

function showManualUploadPrompt() {
  tableContainer.innerHTML = `
    <div class="empty-state" style="cursor: pointer;" onclick="document.getElementById('excelFile').click()">
      <i class="fa-solid fa-cloud-arrow-up" style="font-size: 2.4rem; color: #8E7C93; margin-bottom: 12px;"></i>
      <p style="font-weight: 600; color: #343A40; margin-bottom: 4px;">Initialize Substation Dataset (ALL_RAM.xlsx)</p>
      <span style="font-size: 0.75rem; color: #888E94;">Click here to upload and publish data live to all connected devices</span>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn-lang').forEach(btn => {
    btn.addEventListener('click', function() {
      setLanguage(this.getAttribute('data-lang'));
    });
  });

  setLanguage(currentLang);
  initRealtimeCloudSync();
  initSimulatorEventListeners();
});

function handleWorkbookData(data, shouldPublishToCloud = false) {
  currentWorkbook = XLSX.read(data, { type: 'array' });

  if (shouldPublishToCloud) {
    syncWorkbookToCloud();
  }

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

  if (detailDrawer.classList.contains('open') && drillHistory.length > 0) {
    const currentView = drillHistory[drillHistory.length - 1];
    renderDrillView(currentView, false);
  }

  populateSimulatorDropdown(targetSheet);
}

fileInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    handleWorkbookData(new Uint8Array(evt.target.result), true);
  };
  reader.readAsArrayBuffer(file);
});

sheetSelect.addEventListener('change', function(e) {
  if (currentWorkbook) {
    loadRamSheet(e.target.value);
    populateSimulatorDropdown(e.target.value);
    closeDrawer();
  }
});

/* ============================================================
   ADMIN AUTHENTICATION
   ============================================================ */
loginBtn.addEventListener('click', () => {
  loginModal.classList.add('show');
  adminPasswordInput.value = '';
  loginError.style.display = 'none';
  adminPasswordInput.focus();
});

function closeLogin() {
  loginModal.classList.remove('show');
}
closeLoginModal.addEventListener('click', closeLogin);
cancelLoginModal.addEventListener('click', closeLogin);

submitLoginBtn.addEventListener('click', checkAdminPassword);
adminPasswordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkAdminPassword();
});

function checkAdminPassword() {
  if (adminPasswordInput.value === ADMIN_PASSWORD) {
    isAdmin = true;
    updateAuthUI();
    closeLogin();
    if (currentWorkbook) loadRamSheet(sheetSelect.value);
  } else {
    loginError.style.display = 'block';
  }
}

logoutBtn.addEventListener('click', () => {
  isAdmin = false;
  updateAuthUI();
  if (currentWorkbook) loadRamSheet(sheetSelect.value);
});

function updateAuthUI() {
  const dict = i18nData[currentLang] || i18nData.en;
  if (isAdmin) {
    loginBtn.style.display = 'none';
    userProfile.style.display = 'flex';
    adminUploadWidget.style.display = 'block';
    saveExcelBtn.style.display = 'flex';
    modeBadge.textContent = dict.mode_admin;
    modeBadge.classList.add('admin');
    editNotice.textContent = dict.table_status_admin;
    editNotice.style.color = '#8E7C93';
  } else {
    loginBtn.style.display = 'flex';
    userProfile.style.display = 'none';
    adminUploadWidget.style.display = 'none';
    saveExcelBtn.style.display = 'none';
    modeBadge.textContent = dict.mode_viewer;
    modeBadge.classList.remove('admin');
    editNotice.textContent = dict.table_status_viewer;
    editNotice.style.color = 'var(--text-secondary)';
  }
}

/* ============================================================
   MATHEMATICAL FORMULATIONS
   ============================================================ */
function calculateAvailabilityFormula(mtbf, mttr) {
  if (mtbf <= 0 || (mtbf + mttr) <= 0) return 0;
  return (mtbf / (mtbf + mttr)) * 100;
}

function calculateRequiredMtbf(targetAvailDecimal, mttr) {
  if (targetAvailDecimal >= 1 || targetAvailDecimal <= 0) return 0;
  return (targetAvailDecimal * mttr) / (1 - targetAvailDecimal);
}

function calculateRequiredMttr(targetAvailDecimal, mtbf) {
  if (targetAvailDecimal <= 0) return 0;
  return (mtbf * (1 - targetAvailDecimal)) / targetAvailDecimal;
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
      subsystem: sheetName,
      isAttention: availVal < 96 || mttrVal > 10
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
  currentSheetTitle.textContent = `${dict.table_title_prefix} ${sheetName}`;
  const rows = getNormalizedRows(sheetName);

  if (rows.length === 0) {
    tableContainer.innerHTML = `<p style="padding: 24px; text-align: center; color: var(--text-muted);">${dict.no_records}</p>`;
    resetMetrics();
    return;
  }

  const metrics = calculateSheetMetrics(rows);

  avgAvailElem.textContent = metrics.avgAvail !== '-' ? metrics.avgAvail + '%' : '-';
  avgAvailElem.classList.remove('status-green', 'status-red');
  if (metrics.avgAvail !== '-') {
    avgAvailElem.classList.add(parseFloat(metrics.avgAvail) >= 96 ? 'status-green' : 'status-red');
  }

  totalModesElem.textContent = metrics.totalModes.toLocaleString();
  avgMtbfElem.textContent = metrics.avgMtbf;
  avgMttrElem.textContent = metrics.avgMttr;
  worstAvailElem.textContent = metrics.minAvailItem;
  worstMttrElem.textContent = metrics.maxMttrItem;

  renderCauseChart(metrics.causeCounts);
  renderFormattedTable(currentWorkbook.Sheets[sheetName], sheetName);
}

/* ============================================================
   CHART.JS ROOT CAUSE DONUT
   ============================================================ */
function renderCauseChart(causeCounts) {
  const ctx = document.getElementById('causeChart').getContext('2d');
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
      onClick: (event, elements) => {
        if (elements && elements.length > 0) {
          const index = elements[0].index;
          activeSegmentIndex = index;
          const clickedCategory = labels[index];
          openDrillCategory(clickedCategory);
        }
      },
      onHover: (event, chartElement) => {
        event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
      },
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
            padding: 14
          }
        },
        tooltip: {
          backgroundColor: '#343A40',
          titleFont: { size: 11, family: 'Plus Jakarta Sans, Sarabun' },
          bodyFont: { size: 11, family: 'Plus Jakarta Sans, Sarabun' },
          padding: 10,
          cornerRadius: 6,
          callbacks: {
            afterLabel: () => (currentLang === 'th') ? 'คลิกเพื่อดูรายละเอียด' : 'Click to drill down'
          }
        }
      },
      cutout: '72%'
    }
  });
}

/* ============================================================
   TABLE RENDERING & AUTO-CALCULATE
   ============================================================ */
function renderFormattedTable(sheet, sheetName) {
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

  if (isAdmin) {
    bindCellEditEvents(sheetName, headers, mtbfColIndex, mttrColIndex, availColIndex);
  }

  applyTableFilter();
}

function bindCellEditEvents(sheetName, headers, mtbfColIndex, mttrColIndex, availColIndex) {
  const editableCells = document.querySelectorAll('#ramTable td[contenteditable="true"]');
  editableCells.forEach(cell => {
    cell.addEventListener('blur', function() {
      const rowIdx = parseInt(this.parentElement.getAttribute('data-row'));
      const colIdx = parseInt(this.getAttribute('data-col'));
      const newVal = this.textContent.trim();

      const sheet = currentWorkbook.Sheets[sheetName];
      const cellAddress = XLSX.utils.encode_cell({ r: rowIdx, c: colIdx });

      if (!sheet[cellAddress]) sheet[cellAddress] = {};
      sheet[cellAddress].v = !isNaN(newVal) && newVal !== '' ? Number(Number(newVal).toFixed(2)) : newVal;
      sheet[cellAddress].t = !isNaN(newVal) && newVal !== '' ? 'n' : 's';

      if (colIdx === mtbfColIndex || colIdx === mttrColIndex) {
        const mtbfAddr = XLSX.utils.encode_cell({ r: rowIdx, c: mtbfColIndex });
        const mttrAddr = XLSX.utils.encode_cell({ r: rowIdx, c: mttrColIndex });
        const currentMtbf = sheet[mtbfAddr] && !isNaN(sheet[mtbfAddr].v) ? Number(sheet[mtbfAddr].v) : 0;
        const currentMttr = sheet[mttrAddr] && !isNaN(sheet[mttrAddr].v) ? Number(sheet[mttrAddr].v) : 0;

        const newAvail = calculateAvailabilityFormula(currentMtbf, currentMttr);

        if (availColIndex !== -1) {
          const availAddr = XLSX.utils.encode_cell({ r: rowIdx, c: availColIndex });
          if (!sheet[availAddr]) sheet[availAddr] = {};
          sheet[availAddr].v = Number(newAvail.toFixed(2));
          sheet[availAddr].t = 'n';
        }

        const rowElem = this.parentElement;
        rowElem.setAttribute('data-avail', newAvail.toFixed(2));
        rowElem.setAttribute('data-mttr', currentMttr.toFixed(2));

        const availCell = rowElem.querySelector('.cell-avail');
        if (availCell) {
          const badgeClass = newAvail >= 96 ? 'badge-pass' : 'badge-fail';
          availCell.innerHTML = `<span class="${badgeClass}">${newAvail.toFixed(2)}%</span>`;
        }
      }

      syncWorkbookToCloud();

      const rows = getNormalizedRows(sheetName);
      const metrics = calculateSheetMetrics(rows);
      avgAvailElem.textContent = metrics.avgAvail !== '-' ? metrics.avgAvail + '%' : '-';
      avgAvailElem.classList.remove('status-green', 'status-red');
      if (metrics.avgAvail !== '-') {
        avgAvailElem.classList.add(parseFloat(metrics.avgAvail) >= 96 ? 'status-green' : 'status-red');
      }
      avgMtbfElem.textContent = metrics.avgMtbf;
      avgMttrElem.textContent = metrics.avgMttr;
      worstAvailElem.textContent = metrics.minAvailItem;
      worstMttrElem.textContent = metrics.maxMttrItem;

      populateSimulatorDropdown(sheetName);
    });
  });
}

saveExcelBtn.addEventListener('click', function() {
  if (!currentWorkbook) return;
  XLSX.writeFile(currentWorkbook, 'Substation_RAM_Intelligence_Export.xlsx');
});

function resetMetrics() {
  avgAvailElem.textContent = '-%';
  avgAvailElem.classList.remove('status-green', 'status-red');
  avgMtbfElem.textContent = '-';
  avgMttrElem.textContent = '-';
  totalModesElem.textContent = '0';
  worstAvailElem.textContent = '-';
  worstMttrElem.textContent = '-';
  if (currentChart) currentChart.destroy();
}

function applyTableFilter() {
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

searchInput.addEventListener('input', applyTableFilter);

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentActiveFilter = this.getAttribute('data-filter');
    applyTableFilter();
  });
});

/* ============================================================
   RAM WHAT-IF SIMULATOR ENGINE (REDESIGNED DECISION SUPPORT)
   ============================================================ */
function populateSimulatorDropdown(sheetName) {
  const rows = getNormalizedRows(sheetName);
  simScenarioSelect.innerHTML = '';

  if (rows.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = (currentLang === 'th') ? 'ไม่มีรายการในระบบย่อยนี้' : 'No records in active subsystem';
    simScenarioSelect.appendChild(opt);
    simActiveRow = null;
    return;
  }

  rows.forEach((r, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = `[${r.id}] ${r.component}`;
    simScenarioSelect.appendChild(opt);
  });

  loadSimulatorBaseline(rows[0]);
}

function loadSimulatorBaseline(rowItem) {
  if (!rowItem) return;
  simActiveRow = rowItem;
  const dict = i18nData[currentLang] || i18nData.en;

  simCompName.textContent = rowItem.component;
  simFailMode.textContent = rowItem.mode;
  simFailCause.textContent = rowItem.cause;

  simBaseMtbf.textContent = `${rowItem.mtbf.toLocaleString()} ${dict.unit_hrs}`;
  simBaseMttr.textContent = `${rowItem.mttr.toFixed(2)} ${dict.unit_hrs}`;
  simBaseAvail.textContent = `${rowItem.availability.toFixed(2)}%`;

  resetSimulatorInputs();
  recalculateWhatIfScenario();
}

function resetSimulatorInputs() {
  if (!simActiveRow) return;

  simMttrSlider.value = simActiveRow.mttr > 0 ? simActiveRow.mttr : 8;
  simMttrNum.value = simMttrSlider.value;

  const mtbfVal = simActiveRow.mtbf > 0 ? simActiveRow.mtbf : 25000;
  simMtbfSlider.max = Math.max(100000, mtbfVal * 2);
  simMtbfSlider.value = mtbfVal;
  simMtbfNum.value = mtbfVal;

  simTargetSlider.value = 99.95;
  simTargetNum.value = 99.95;

  const defaultStrat = document.querySelector('input[name="simStrategy"][value="fixed-mttr"]');
  if (defaultStrat) defaultStrat.checked = true;
}

function initSimulatorEventListeners() {
  simScenarioSelect.addEventListener('change', function() {
    const currentSheet = sheetSelect.value;
    const rows = getNormalizedRows(currentSheet);
    const selectedIdx = parseInt(this.value);
    if (!isNaN(selectedIdx) && rows[selectedIdx]) {
      loadSimulatorBaseline(rows[selectedIdx]);
    }
  });

  simResetBtn.addEventListener('click', () => {
    resetSimulatorInputs();
    recalculateWhatIfScenario();
  });

  document.querySelectorAll('.sim-seg-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.sim-seg-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      simCurrentMode = this.getAttribute('data-mode');

      document.querySelectorAll('.sim-input-pane').forEach(p => p.classList.remove('active'));
      if (simCurrentMode === 'mttr') document.getElementById('simPaneMttr').classList.add('active');
      else if (simCurrentMode === 'mtbf') document.getElementById('simPaneMtbf').classList.add('active');
      else if (simCurrentMode === 'target') document.getElementById('simPaneTarget').classList.add('active');

      recalculateWhatIfScenario();
    });
  });

  simMttrSlider.addEventListener('input', function() {
    simMttrNum.value = parseFloat(this.value).toFixed(1);
    recalculateWhatIfScenario();
  });
  simMttrNum.addEventListener('input', function() {
    simMttrSlider.value = this.value;
    recalculateWhatIfScenario();
  });

  simMtbfSlider.addEventListener('input', function() {
    simMtbfNum.value = this.value;
    recalculateWhatIfScenario();
  });
  simMtbfNum.addEventListener('input', function() {
    simMtbfSlider.value = this.value;
    recalculateWhatIfScenario();
  });

  simTargetSlider.addEventListener('input', function() {
    simTargetNum.value = parseFloat(this.value).toFixed(2);
    recalculateWhatIfScenario();
  });
  simTargetNum.addEventListener('input', function() {
    simTargetSlider.value = this.value;
    recalculateWhatIfScenario();
  });

  document.querySelectorAll('input[name="simStrategy"]').forEach(radio => {
    radio.addEventListener('change', recalculateWhatIfScenario);
  });
}

function recalculateWhatIfScenario() {
  if (!simActiveRow) return;

  const baseMtbf = Number(simActiveRow.mtbf);
  const baseMttr = Number(simActiveRow.mttr);
  const baseAvail = Number(simActiveRow.availability);

  let scenMtbf = baseMtbf;
  let scenMttr = baseMttr;
  let scenAvail = baseAvail;
  let interpretationText = '';
  let takeawayText = '';

  if (simCurrentMode === 'mttr') {
    scenMttr = Math.max(0.1, parseFloat(simMttrNum.value) || 0.1);
    scenMtbf = baseMtbf;
    scenAvail = calculateAvailabilityFormula(scenMtbf, scenMttr);

    const availDiff = scenAvail - baseAvail;
    if (scenAvail >= 96.00) {
      if (currentLang === 'th') {
        interpretationText = `ภายใต้สถานการณ์จำลองนี้ การปรับเวลาซ่อมเป็น ${scenMttr.toFixed(2)} ชม. ส่งผลให้ความพร้อมใช้งานอยู่ที่ <strong>${scenAvail.toFixed(2)}%</strong> (${availDiff >= 0 ? '+' : ''}${availDiff.toFixed(2)}%) แบบจำลองชี้ว่าอุปกรณ์ยังคงทำงานได้เหนือเกณฑ์เป้าหมาย`;
        takeawayText = `การปรับเวลาบำรุงรักษาทำให้ความพร้อมใช้งานอยู่ที่ ${scenAvail.toFixed(2)}% ซึ่งยังคงผ่านเกณฑ์เป้าหมาย 96.00%`;
      } else {
        interpretationText = `Under this simulated scenario, adjusting repair time to ${scenMttr.toFixed(2)} hrs yields a calculated Availability of <strong>${scenAvail.toFixed(2)}%</strong> (${availDiff >= 0 ? '+' : ''}${availDiff.toFixed(2)}%). The model indicates the equipment would remain above the target threshold.`;
        takeawayText = `A moderate change in repair duration adjusts Availability to ${scenAvail.toFixed(2)}%, maintaining compliance with the 96.00% benchmark.`;
      }
    } else {
      if (currentLang === 'th') {
        interpretationText = `การเพิ่มเวลาซ่อมเป็น ${scenMttr.toFixed(2)} ชม. จะส่งผลให้ความพร้อมใช้งานลดลงต่ำกว่าเกณฑ์ 96.00% เหลือ <strong>${scenAvail.toFixed(2)}%</strong> (${availDiff.toFixed(2)}%) จำเป็นต้องมีมาตรการเร่งด่วน`;
        takeawayText = `ภายใต้สถานการณ์จำลองนี้ เวลาบำรุงรักษาที่เพิ่มขึ้นทำให้ความพร้อมใช้งานลดลงต่ำกว่าเป้าหมาย 96.00%`;
      } else {
        interpretationText = `Increasing repair time to ${scenMttr.toFixed(2)} hrs would reduce Availability below the 96.00% target threshold to <strong>${scenAvail.toFixed(2)}%</strong> (${availDiff.toFixed(2)}%). Corrective mitigation would be required under these operational parameters.`;
        takeawayText = `Under this simulated scenario, increased repair time would reduce Availability below the 96.00% target.`;
      }
    }
  } else if (simCurrentMode === 'mtbf') {
    scenMtbf = Math.max(10, parseFloat(simMtbfNum.value) || 10);
    scenMttr = baseMttr;
    scenAvail = calculateAvailabilityFormula(scenMtbf, scenMttr);

    const availDiff = scenAvail - baseAvail;
    if (scenAvail >= 96.00) {
      if (currentLang === 'th') {
        interpretationText = `จากสมมติฐานที่เลือก การปรับค่า MTBF เป็น ${Math.round(scenMtbf).toLocaleString()} ชม. ส่งผลให้ความพร้อมใช้งานอยู่ที่ <strong>${scenAvail.toFixed(2)}%</strong> (${availDiff >= 0 ? '+' : ''}${availDiff.toFixed(2)}%) แบบจำลองชี้ว่าประสิทธิภาพยังอยู่ในเกณฑ์ที่ยอมรับได้`;
        takeawayText = `ความน่าเชื่อถือที่เพิ่มขึ้นช่วยรักษาความพร้อมใช้งานของระบบให้อยู่ในระดับสูงที่ ${scenAvail.toFixed(2)}%`;
      } else {
        interpretationText = `Based on the selected assumptions, adjusting MTBF to ${Math.round(scenMtbf).toLocaleString()} hrs while holding MTTR at ${baseMttr.toFixed(2)} hrs results in <strong>${scenAvail.toFixed(2)}%</strong> Availability (${availDiff >= 0 ? '+' : ''}${availDiff.toFixed(2)}%). The model indicates performance would remain within target bounds.`;
        takeawayText = `Reliability scaling indicates operational Availability would remain healthy at ${scenAvail.toFixed(2)}%.`;
      }
    } else {
      if (currentLang === 'th') {
        interpretationText = `ภายใต้สถานการณ์จำลองนี้ หากเกิดข้อบกพร่องถี่ขึ้น (MTBF ${Math.round(scenMtbf).toLocaleString()} ชม.) จะทำให้ความพร้อมใช้งานลดลงเหลือ <strong>${scenAvail.toFixed(2)}%</strong> ซึ่งหลุดเกณฑ์ 96.00%`;
        takeawayText = `รอบการชำรุดที่ถี่ขึ้นส่งผลให้อุปกรณ์มีความพร้อมใช้งานต่ำกว่าเป้าหมาย 96.00%`;
      } else {
        interpretationText = `Under this simulated scenario, shorter operating intervals (MTBF ${Math.round(scenMtbf).toLocaleString()} hrs) would drop Availability to <strong>${scenAvail.toFixed(2)}%</strong>, breaching the 96.00% target.`;
        takeawayText = `Degraded failure intervals would drive equipment Availability below the 96.00% target.`;
      }
    }
  } else if (simCurrentMode === 'target') {
    const targetAvailPct = Math.min(99.99, Math.max(90.0, parseFloat(simTargetNum.value) || 99.0));
    const targetAvailDecimal = targetAvailPct / 100;
    scenAvail = targetAvailPct;

    const selectedStrategy = document.querySelector('input[name="simStrategy"]:checked')?.value || 'fixed-mttr';

    if (selectedStrategy === 'fixed-mttr') {
      scenMttr = baseMttr;
      scenMtbf = calculateRequiredMtbf(targetAvailDecimal, scenMttr);
      const reqDelta = scenMtbf - baseMtbf;

      if (currentLang === 'th') {
        interpretationText = `หากต้องการบรรลุเป้าหมายความพร้อมใช้งานที่ <strong>${targetAvailPct.toFixed(2)}%</strong> โดยใช้เวลาซ่อมเดิม (${baseMttr.toFixed(2)} ชม.) แบบจำลองระบุว่าต้องยืดอายุ MTBF เป็นประมาณ <strong>${Math.round(scenMtbf).toLocaleString()} ชม.</strong> (${reqDelta >= 0 ? '+' : ''}${Math.round(reqDelta).toLocaleString()} ชม. จากค่าเริ่มต้น)`;
        takeawayText = `การตั้งเป้าหมายความพร้อมใช้งาน ${targetAvailPct.toFixed(2)}% ภายใต้เวลาซ่อมคงที่ จำเป็นต้องเพิ่ม MTBF เป็น ${Math.round(scenMtbf).toLocaleString()} ชั่วโมง`;
      } else {
        interpretationText = `To achieve the target Availability of <strong>${targetAvailPct.toFixed(2)}%</strong> while holding MTTR constant at ${baseMttr.toFixed(2)} hrs, the model indicates required MTBF would need to reach approximately <strong>${Math.round(scenMtbf).toLocaleString()} hrs</strong> (${reqDelta >= 0 ? '+' : ''}${Math.round(reqDelta).toLocaleString()} hrs vs baseline).`;
        takeawayText = `Targeting ${targetAvailPct.toFixed(2)}% Availability with fixed repair time requires expanding MTBF to ${Math.round(scenMtbf).toLocaleString()} operating hours.`;
      }
    } else {
      scenMtbf = baseMtbf;
      scenMttr = calculateRequiredMttr(targetAvailDecimal, scenMtbf);
      const redDelta = baseMttr - scenMttr;

      if (currentLang === 'th') {
        interpretationText = `หากต้องการบรรลุเป้าหมายความพร้อมใช้งานที่ <strong>${targetAvailPct.toFixed(2)}%</strong> ภายใต้ความน่าเชื่อถือเดิม (${baseMtbf.toLocaleString()} ชม.) ทีมช่างต้องลดเวลาซ่อมบำรุงลงเหลือไม่เกิน <strong>${scenMttr.toFixed(2)} ชม.</strong> (ต้องลดเวลาลง ${redDelta >= 0 ? '-' : '+'}${Math.abs(redDelta).toFixed(2)} ชม.)`;
        takeawayText = `การตั้งเป้าหมายความพร้อมใช้งาน ${targetAvailPct.toFixed(2)}% ภายใต้รอบการชำรุดคงที่ จำเป็นต้องคุมเวลา MTTR ให้อยู่ในระดับไม่เกิน ${scenMttr.toFixed(2)} ชั่วโมง`;
      } else {
        interpretationText = `To achieve the target Availability of <strong>${targetAvailPct.toFixed(2)}%</strong> while holding MTBF constant at ${baseMtbf.toLocaleString()} hrs, maximum allowable MTTR would need to be reduced to <strong>${scenMttr.toFixed(2)} hrs or less</strong> (a reduction of ${redDelta >= 0 ? '-' : '+'}${Math.abs(redDelta).toFixed(2)} hrs).`;
        takeawayText = `Targeting ${targetAvailPct.toFixed(2)}% Availability with fixed failure intervals requires limiting MTTR to ${scenMttr.toFixed(2)} hours.`;
      }
    }
  }

  // Update Large Visual Comparative Board
  if (simBoardBaseAvail) simBoardBaseAvail.textContent = `${baseAvail.toFixed(2)}%`;
  if (simBoardScenAvail) simBoardScenAvail.textContent = `${scenAvail.toFixed(2)}%`;

  const availDelta = scenAvail - baseAvail;
  if (simBoardDiffAvail) {
    if (Math.abs(availDelta) < 0.01) {
      simBoardDiffAvail.textContent = '—';
      simBoardDiffAvail.style.color = 'var(--text-muted)';
    } else {
      const arrow = availDelta > 0 ? '↑' : '↓';
      simBoardDiffAvail.textContent = `${arrow} ${Math.abs(availDelta).toFixed(2)}%`;
      simBoardDiffAvail.style.color = availDelta > 0 ? 'var(--status-healthy)' : 'var(--status-warning)';
    }
  }

  // Reactivity to threshold (96.00%)
  if (simBoardScenarioBox) {
    simBoardScenarioBox.classList.remove('success-state', 'warning-state');
    simBoardScenarioBox.classList.add(scenAvail >= 96.00 ? 'success-state' : 'warning-state');
  }

  // Impact Summary Table
  const dict = i18nData[currentLang] || i18nData.en;
  simCmpBaseMtbf.textContent = `${baseMtbf.toLocaleString()} ${dict.unit_hrs}`;
  simCmpScenMtbf.textContent = `${Math.round(scenMtbf).toLocaleString()} ${dict.unit_hrs}`;
  renderDiffIndicator(simCmpDeltaMtbf, scenMtbf - baseMtbf, dict.unit_hrs, true);

  simCmpBaseMttr.textContent = `${baseMttr.toFixed(2)} ${dict.unit_hrs}`;
  simCmpScenMttr.textContent = `${scenMttr.toFixed(2)} ${dict.unit_hrs}`;
  renderDiffIndicator(simCmpDeltaMttr, scenMttr - baseMttr, dict.unit_hrs, false);

  simCmpBaseAvail.textContent = `${baseAvail.toFixed(2)}%`;
  simCmpScenAvail.textContent = `${scenAvail.toFixed(2)}%`;
  renderDiffIndicator(simCmpDeltaAvail, scenAvail - baseAvail, '%', true);

  // Interpretation Panel Tag & Body
  if (simFeasibilityBadge) {
    simFeasibilityBadge.className = 'interpret-tag ' + (scenAvail >= 96.00 ? 'tag-within' : 'tag-below');
    simFeasibilityBadge.textContent = (scenAvail >= 96.00) 
      ? ((currentLang === 'th') ? 'อยู่ในเกณฑ์เป้าหมาย' : 'WITHIN TARGET')
      : ((currentLang === 'th') ? 'ต่ำกว่าเกณฑ์เป้าหมาย' : 'BELOW TARGET');
  }
  if (simInterpretationText) simInterpretationText.innerHTML = interpretationText;
  if (simTakeawayText) simTakeawayText.textContent = takeawayText;
}

function renderDiffIndicator(elem, delta, unit, higherIsBetter) {
  const rounded = Number(delta.toFixed(2));
  if (Math.abs(rounded) < 0.01) {
    elem.innerHTML = `<span class="diff-neutral">0.00 ${unit}</span>`;
    return;
  }

  const isPositive = rounded > 0;
  const isGood = higherIsBetter ? isPositive : !isPositive;
  const colorClass = isGood ? 'diff-up-green' : 'diff-down-red';
  const arrow = isPositive ? '↑' : '↓';
  const sign = isPositive ? '+' : '';

  elem.innerHTML = `<span class="${colorClass}">${arrow} ${sign}${rounded.toLocaleString()} ${unit}</span>`;
}

/* ============================================================
   DRILL-DOWN ENGINE
   ============================================================ */
function openDrawer() {
  detailDrawer.classList.add('open');
  drawerBackdrop.classList.add('show');
  detailDrawer.setAttribute('aria-hidden', 'false');
}

function closeDrawer() {
  detailDrawer.classList.remove('open');
  drawerBackdrop.classList.remove('show');
  detailDrawer.setAttribute('aria-hidden', 'true');
  drillHistory.length = 0;
  activeSegmentIndex = null;
}

drawerCloseBtn.addEventListener('click', closeDrawer);
drawerBackdrop.addEventListener('click', closeDrawer);

drawerBackBtn.addEventListener('click', () => {
  if (drillHistory.length > 1) {
    drillHistory.pop();
    const prevView = drillHistory[drillHistory.length - 1];
    renderDrillView(prevView, false);
  } else {
    closeDrawer();
  }
});

function pushDrillView(viewState) {
  drillHistory.push(viewState);
  renderDrillView(viewState, true);
}

function renderDrillView(viewState, shouldOpen = true) {
  drawerBackBtn.style.display = drillHistory.length > 1 ? 'inline-flex' : 'none';
  drawerLevelTag.textContent = viewState.level === 3 
    ? ((currentLang === 'th') ? 'ระดับ 3 • รายละเอียดอุปกรณ์เชิงลึก' : 'LEVEL 3 • EQUIPMENT DEEP-DIVE')
    : ((currentLang === 'th') ? 'ระดับ 2 • รายละเอียดเชิงวิเคราะห์' : 'LEVEL 2 • ANALYTICAL DETAIL');

  if (viewState.type === 'category') {
    renderCategoryDetail(viewState.category);
  } else if (viewState.type === 'kpi') {
    renderKpiDetail(viewState.metric);
  } else if (viewState.type === 'equipment') {
    renderEquipmentDetail(viewState.equipmentName);
  }

  if (shouldOpen) openDrawer();
}

function openDrillCategory(categoryName) {
  pushDrillView({ type: 'category', category: categoryName, level: 2 });
}

function renderCategoryDetail(categoryName) {
  const currentSheet = sheetSelect.value;
  const allRows = getNormalizedRows(currentSheet);
  const dict = i18nData[currentLang] || i18nData.en;
  
  const isOther = categoryName.includes('Other') || categoryName.includes('อื่นๆ');
  const categoryRows = allRows.filter(r => {
    if (isOther) {
      return !['Electrical', 'Mechanical', 'Protection', 'Human Error'].some(top => r.cause.toLowerCase().includes(top.toLowerCase()));
    }
    return r.cause.toLowerCase().includes(categoryName.toLowerCase());
  });

  const totalFailures = categoryRows.length;
  const totalSubsystemFailures = allRows.length;
  const sharePct = totalSubsystemFailures > 0 ? ((totalFailures / totalSubsystemFailures) * 100).toFixed(2) : '0.00';
  
  const avgDowntime = totalFailures > 0
    ? (categoryRows.reduce((acc, r) => acc + r.mttr, 0) / totalFailures).toFixed(2)
    : '0.00';

  const eqMap = {};
  categoryRows.forEach(r => {
    eqMap[r.component] = (eqMap[r.component] || 0) + 1;
  });
  const sortedEq = Object.entries(eqMap).sort((a, b) => b[1] - a[1]);
  const maxEqCount = sortedEq.length > 0 ? sortedEq[0][1] : 1;

  const causeBreakdown = {};
  categoryRows.forEach(r => {
    causeBreakdown[r.cause] = (causeBreakdown[r.cause] || 0) + 1;
  });
  const sortedCauses = Object.entries(causeBreakdown).sort((a, b) => b[1] - a[1]);

  let html = `
    <div class="drawer-title-group">
      <h2>${categoryName.toUpperCase()}</h2>
      <div class="drawer-subtitle">
        <span>${sharePct}% ${(currentLang === 'th') ? 'ของเหตุการณ์ทั้งหมดในระบบย่อย' : 'of Total Subsystem Incidents'}</span>
        <span>•</span>
        <span>${(currentLang === 'th') ? 'ระบบย่อย' : 'Subsystem'} ${currentSheet}</span>
      </div>
    </div>

    <div class="drawer-kpi-strip">
      <div class="drawer-mini-kpi">
        <span>${(currentLang === 'th') ? 'จำนวนเหตุการณ์' : 'Failure Events'}</span>
        <strong>${totalFailures}</strong>
      </div>
      <div class="drawer-mini-kpi">
        <span>${(currentLang === 'th') ? 'เวลาบำรุงรักษาเฉลี่ย' : 'Avg Repair Downtime'}</span>
        <strong>${avgDowntime} ${dict.unit_hrs}</strong>
      </div>
      <div class="drawer-mini-kpi">
        <span>${(currentLang === 'th') ? 'อุปกรณ์ที่ได้รับผลกระทบ' : 'Affected Equipment'}</span>
        <strong>${sortedEq.length} ${(currentLang === 'th') ? 'รายการ' : 'units'}</strong>
      </div>
      <div class="drawer-mini-kpi">
        <span>${(currentLang === 'th') ? 'สัดส่วนในระบบย่อย' : 'Subsystem Share'}</span>
        <strong>${sharePct}%</strong>
      </div>
    </div>

    <div class="drawer-section">
      <span class="drawer-section-title">${(currentLang === 'th') ? 'ข้อบกพร่องจำแนกตามอุปกรณ์' : 'Failures by Equipment'}</span>
      <div class="horizontal-bars">
  `;

  sortedEq.slice(0, 5).forEach(([comp, count]) => {
    const widthPct = Math.round((count / maxEqCount) * 100);
    html += `
      <div class="bar-row" onclick="openDrillEquipment('${encodeURIComponent(comp)}')">
        <div class="bar-row-info">
          <span>${comp}</span>
          <span>${count} ${(currentLang === 'th') ? 'ครั้ง' : 'events'}</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${widthPct}%;"></div>
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>

    <div class="drawer-section">
      <span class="drawer-section-title">${(currentLang === 'th') ? 'สาเหตุข้อบกพร่องสูงสุด' : 'Top Failure Causes'}</span>
      <div class="horizontal-bars">
  `;

  sortedCauses.slice(0, 4).forEach(([cause, count]) => {
    html += `
      <div class="bar-row">
        <div class="bar-row-info">
          <span style="font-weight: 500;">${cause}</span>
          <span>${count}</span>
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>

    <div class="drawer-section">
      <span class="drawer-section-title">${(currentLang === 'th') ? 'รายการบันทึกล่าสุด' : 'Recent Registered Events'}</span>
      <table class="drawer-table">
        <thead>
          <tr>
            <th>${(currentLang === 'th') ? 'อุปกรณ์' : 'Equipment'}</th>
            <th>${(currentLang === 'th') ? 'ลักษณะข้อบกพร่อง' : 'Mode'}</th>
            <th>MTTR</th>
          </tr>
        </thead>
        <tbody>
  `;

  categoryRows.slice(0, 6).forEach(r => {
    html += `
      <tr class="clickable" onclick="openDrillEquipment('${encodeURIComponent(r.component)}')">
        <td><strong>${r.component}</strong></td>
        <td>${r.mode}</td>
        <td>${r.mttr.toFixed(2)} ${dict.unit_hrs}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
      <button class="drawer-btn-viewall" onclick="applyCategoryFilterToMatrix('${categoryName}')">
        ${(currentLang === 'th') ? `กรองตารางเฉพาะกลุ่ม ${categoryName} →` : `Filter Matrix to ${categoryName} Failures →`}
      </button>
    </div>
  `;

  drawerContent.innerHTML = html;
}

document.getElementById('kpiCardAvail').addEventListener('click', () => openDrillKpi('availability'));
document.getElementById('kpiCardMtbf').addEventListener('click', () => openDrillKpi('mtbf'));
document.getElementById('kpiCardMttr').addEventListener('click', () => openDrillKpi('mttr'));
document.getElementById('kpiCardModes').addEventListener('click', () => openDrillKpi('modes'));

function openDrillKpi(metric) {
  pushDrillView({ type: 'kpi', metric: metric, level: 2 });
}

function renderKpiDetail(metric) {
  const currentSheet = sheetSelect.value;
  const allRows = getNormalizedRows(currentSheet);

  let title = '';
  let sub = '';
  let sorted = [];

  if (metric === 'availability') {
    title = (currentLang === 'th') ? 'การจัดอันดับความพร้อมใช้งาน (AVAILABILITY)' : 'FLEET AVAILABILITY RANKING';
    sub = (currentLang === 'th') ? 'เรียงลำดับจากความพร้อมใช้งานต่ำสุดไปสูงสุด (เป้าหมาย ≥ 96.00%)' : 'Ranked from lowest availability to highest (Target ≥ 96.00%)';
    sorted = [...allRows].sort((a, b) => a.availability - b.availability);
  } else if (metric === 'mtbf') {
    title = (currentLang === 'th') ? 'การจัดอันดับความน่าเชื่อถือ (MTBF)' : 'MTBF RELIABILITY SPECTRUM';
    sub = (currentLang === 'th') ? 'เรียงลำดับจากชำรุดบ่อยสุด (MTBF ต่ำ) ไปยังตัวที่ทนทานที่สุด' : 'Ranked from lowest MTBF (highest failure rate) to highest';
    sorted = [...allRows].sort((a, b) => a.mtbf - b.mtbf);
  } else if (metric === 'mttr') {
    title = (currentLang === 'th') ? 'การจัดอันดับเวลาบำรุงรักษา (MTTR)' : 'REPAIR LATENCY (MTTR) RANKING';
    sub = (currentLang === 'th') ? 'เรียงลำดับจากใช้เวลาซ่อมนานสุดไปน้อยสุด (เกณฑ์ ≤ 10 ชม.)' : 'Ranked from highest repair duration to lowest (Limit ≤ 10h)';
    sorted = [...allRows].sort((a, b) => b.mttr - a.mttr);
  } else {
    title = (currentLang === 'th') ? 'ลักษณะข้อบกพร่องที่พบในระบบ' : 'FAILURE MODE FREQUENCY';
    sub = (currentLang === 'th') ? 'รายการข้อบกพร่องที่บันทึกไว้ในระบบย่อยปัจจุบัน' : 'Most prevalent cataloged mechanisms within current subsystem';
    sorted = [...allRows];
  }

  let html = `
    <div class="drawer-title-group">
      <h2>${title}</h2>
      <div class="drawer-subtitle">${sub}</div>
    </div>

    <div class="drawer-section">
      <span class="drawer-section-title">${(currentLang === 'th') ? 'อันดับอุปกรณ์ตามตัวชี้วัด' : 'Equipment Diagnostic Ranks'}</span>
      <table class="drawer-table">
        <thead>
          <tr>
            <th>${(currentLang === 'th') ? 'อุปกรณ์' : 'Equipment'}</th>
            <th>Avail</th>
            <th>MTBF</th>
            <th>MTTR</th>
          </tr>
        </thead>
        <tbody>
  `;

  sorted.forEach(r => {
    const availColor = r.availability >= 96 ? '#66756B' : '#A65D57';
    const mttrColor = r.mttr <= 10 ? 'inherit' : '#A65D57';

    html += `
      <tr class="clickable" onclick="openDrillEquipment('${encodeURIComponent(r.component)}')">
        <td><strong>${r.component}</strong><br><span style="font-size:0.65rem; color:var(--text-muted);">${r.id}</span></td>
        <td style="color:${availColor}; font-weight:700;">${r.availability.toFixed(2)}%</td>
        <td>${r.mtbf.toFixed(2)}h</td>
        <td style="color:${mttrColor}; font-weight:${r.mttr > 10 ? '700' : '500'};">${r.mttr.toFixed(2)}h</td>
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

document.getElementById('insightWorstAvail').addEventListener('click', () => {
  const currentSheet = sheetSelect.value;
  const rows = getNormalizedRows(currentSheet);
  if (rows.length === 0) return;
  const worst = [...rows].sort((a, b) => a.availability - b.availability)[0];
  if (worst) openDrillEquipment(worst.component);
});

document.getElementById('insightWorstMttr').addEventListener('click', () => {
  const currentSheet = sheetSelect.value;
  const rows = getNormalizedRows(currentSheet);
  if (rows.length === 0) return;
  const worst = [...rows].sort((a, b) => b.mttr - a.mttr)[0];
  if (worst) openDrillEquipment(worst.component);
});

function openDrillEquipment(rawCompName) {
  const compName = decodeURIComponent(rawCompName);
  pushDrillView({ type: 'equipment', equipmentName: compName, level: 3 });
}

function renderEquipmentDetail(compName) {
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
      <span class="drawer-section-title">${(currentLang === 'th') ? 'ข้อมูลการวินิจฉัยอุปกรณ์' : 'Equipment Diagnostic Details'}</span>
      <div style="font-size:0.78rem; line-height:1.6; color:var(--text-secondary); background:var(--surface-base); padding:14px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
        <div><strong>${(currentLang === 'th') ? 'สาเหตุหลัก' : 'Primary Cause'}:</strong> ${primary.cause}</div>
        <div><strong>${(currentLang === 'th') ? 'ลักษณะข้อบกพร่องหลัก' : 'Dominant Failure Mode'}:</strong> ${primary.mode}</div>
        <div style="margin-top:6px; font-size:0.72rem; color:var(--text-muted);">
          ${isAttention
            ? ((currentLang === 'th') 
               ? 'คำแนะนำ: อุปกรณ์นี้มีค่าความพร้อมใช้งานต่ำกว่าเกณฑ์ หรือใช้เวลาบำรุงรักษานาน ควรตรวจสอบระบบฉนวน หน้าสัมผัสทางไฟฟ้า และกลไกขับเคลื่อน' 
               : 'Root Cause Advisory: This unit triggers an availability or MTTR breach. Recommended action: inspect insulation, contacts, and mechanical linkages.')
            : ((currentLang === 'th')
               ? 'ประสิทธิภาพการทำงานอยู่ภายใต้เกณฑ์มาตรฐาน ISO 14224 และ IEEE' 
               : 'Performance metrics operate within designated ISO 14224 & IEEE reliability thresholds.')}
        </div>
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

function applyCategoryFilterToMatrix(categoryName) {
  const isOther = categoryName.includes('Other') || categoryName.includes('อื่นๆ');
  searchInput.value = isOther ? '' : categoryName;
  applyTableFilter();
  closeDrawer();
  document.getElementById('ramTable').scrollIntoView({ behavior: 'smooth' });
}

/* ============================================================
   EXECUTIVE BRIEF PRINT ENGINE (A4 Landscape)
   ============================================================ */
openExportModalBtn.addEventListener('click', function() {
  if (!currentWorkbook) {
    alert((currentLang === 'th') ? 'กรุณารอโหลดข้อมูลให้สมบูรณ์ก่อนสร้างรายงาน' : 'Please wait for system data to complete loading before generating the brief.');
    return;
  }

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

  const allOption = `
    <label class="sheet-radio-item" style="border-top: 1px dashed var(--border-divider); margin-top: 8px; padding-top: 12px;">
      <input type="radio" name="printSheetTarget" value="__ALL__" />
      <span><strong>${(currentLang === 'th') ? 'รวมทุกระบบย่อย (All Subsystems)' : 'Consolidated Fleet Brief (All Subsystems)'}</strong></span>
    </label>
  `;
  sheetOptionsList.insertAdjacentHTML('beforeend', allOption);

  exportModal.classList.add('show');
});

function closeModal() { exportModal.classList.remove('show'); }
closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);

confirmPrintBtn.addEventListener('click', function() {
  const selectedRadio = document.querySelector('input[name="printSheetTarget"]:checked');
  if (!selectedRadio) return;

  const targetSheet = selectedRadio.value;
  closeModal();
  buildPrintView(targetSheet);

  setTimeout(() => { window.print(); }, 300);
});

function buildPrintView(targetSheet) {
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
