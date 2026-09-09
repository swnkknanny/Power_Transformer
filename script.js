/* ============================================================
   RAM WHAT-IF SIMULATOR ENGINE (EXECUTIVE DASHBOARD LOGIC)
   ============================================================ */

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
const simBoardDiffCaption = document.getElementById('simBoardDiffCaption');
const simBoardScenarioBox = document.getElementById('simBoardScenarioBox');

const simVisualTrack = document.getElementById('simVisualTrack');
const trackLblBase = document.getElementById('trackLblBase');
const trackLblScen = document.getElementById('trackLblScen');
const trackDotBase = document.getElementById('trackDotBase');
const trackDotScen = document.getElementById('trackDotScen');
const trackActiveBar = document.getElementById('trackActiveBar');

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

function populateSimulatorDropdown(sheetName) {
  const rows = getNormalizedRows(sheetName);
  if (!simScenarioSelect) return;
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

  if (simCompName) simCompName.textContent = rowItem.component;
  if (simFailMode) simFailMode.textContent = rowItem.mode;
  if (simFailCause) simFailCause.textContent = rowItem.cause;

  if (simBaseMtbf) simBaseMtbf.textContent = `${rowItem.mtbf.toLocaleString()} ${dict.unit_hrs}`;
  if (simBaseMttr) simBaseMttr.textContent = `${rowItem.mttr.toFixed(2)} ${dict.unit_hrs}`;
  if (simBaseAvail) simBaseAvail.textContent = `${rowItem.availability.toFixed(2)}%`;

  resetSimulatorInputs();
  recalculateWhatIfScenario();
}

function resetSimulatorInputs() {
  if (!simActiveRow) return;

  const mttrVal = simActiveRow.mttr > 0 ? simActiveRow.mttr : 8;
  if (simMttrSlider) simMttrSlider.value = mttrVal;
  if (simMttrNum) simMttrNum.value = mttrVal;

  const mtbfVal = simActiveRow.mtbf > 0 ? simActiveRow.mtbf : 25000;
  if (simMtbfSlider) {
    simMtbfSlider.max = Math.max(100000, mtbfVal * 2);
    simMtbfSlider.value = mtbfVal;
  }
  if (simMtbfNum) simMtbfNum.value = mtbfVal;

  if (simTargetSlider) simTargetSlider.value = 99.95;
  if (simTargetNum) simTargetNum.value = 99.95;

  const defaultStrat = document.querySelector('input[name="simStrategy"][value="fixed-mttr"]');
  if (defaultStrat) defaultStrat.checked = true;
}

function initSimulatorEventListeners() {
  if (!simScenarioSelect) return;

  simScenarioSelect.addEventListener('change', function() {
    const currentSheet = sheetSelect.value;
    const rows = getNormalizedRows(currentSheet);
    const selectedIdx = parseInt(this.value);
    if (!isNaN(selectedIdx) && rows[selectedIdx]) {
      loadSimulatorBaseline(rows[selectedIdx]);
    }
  });

  if (simResetBtn) {
    simResetBtn.addEventListener('click', () => {
      resetSimulatorInputs();
      recalculateWhatIfScenario();
    });
  }

  document.querySelectorAll('.sim-seg-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.sim-seg-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      simCurrentMode = this.getAttribute('data-mode');

      document.querySelectorAll('.sim-pane').forEach(p => p.classList.remove('active'));
      if (simCurrentMode === 'mttr') document.getElementById('simPaneMttr')?.classList.add('active');
      else if (simCurrentMode === 'mtbf') document.getElementById('simPaneMtbf')?.classList.add('active');
      else if (simCurrentMode === 'target') document.getElementById('simPaneTarget')?.classList.add('active');

      recalculateWhatIfScenario();
    });
  });

  if (simMttrSlider && simMttrNum) {
    simMttrSlider.addEventListener('input', function() {
      simMttrNum.value = parseFloat(this.value).toFixed(1);
      recalculateWhatIfScenario();
    });
    simMttrNum.addEventListener('input', function() {
      simMttrSlider.value = this.value;
      recalculateWhatIfScenario();
    });
  }

  if (simMtbfSlider && simMtbfNum) {
    simMtbfSlider.addEventListener('input', function() {
      simMtbfNum.value = this.value;
      recalculateWhatIfScenario();
    });
    simMtbfNum.addEventListener('input', function() {
      simMtbfSlider.value = this.value;
      recalculateWhatIfScenario();
    });
  }

  if (simTargetSlider && simTargetNum) {
    simTargetSlider.addEventListener('input', function() {
      simTargetNum.value = parseFloat(this.value).toFixed(2);
      recalculateWhatIfScenario();
    });
    simTargetNum.addEventListener('input', function() {
      simTargetSlider.value = this.value;
      recalculateWhatIfScenario();
    });
  }

  document.querySelectorAll('input[name="simStrategy"]').forEach(radio => {
    radio.addEventListener('change', recalculateWhatIfScenario);
  });
}

function recalculateWhatIfScenario() {
  if (!simActiveRow) return;

  const baseMtbf = Number(simActiveRow.mtbf) || 1;
  const baseMttr = Number(simActiveRow.mttr) || 0;
  const baseAvail = Number(simActiveRow.availability) || calculateAvailabilityFormula(baseMtbf, baseMttr);

  let scenMtbf = baseMtbf;
  let scenMttr = baseMttr;
  let scenAvail = baseAvail;
  let interpretationText = '';
  let takeawayText = '';

  if (simCurrentMode === 'mttr') {
    scenMttr = Math.max(0.1, parseFloat(simMttrNum?.value) || 0.1);
    scenMtbf = baseMtbf;
    scenAvail = calculateAvailabilityFormula(scenMtbf, scenMttr);

    updateVisualTrack(baseMttr, scenMttr, 0.5, 96, 'MTTR (hrs)');

    const availDiff = scenAvail - baseAvail;
    if (scenAvail >= 96.00) {
      interpretationText = `Under this simulated scenario, adjusting repair time to ${scenMttr.toFixed(2)} hrs yields an Availability of <strong>${scenAvail.toFixed(2)}%</strong> (${availDiff >= 0 ? '+' : ''}${availDiff.toFixed(2)}%). The model indicates Availability would remain above the target threshold.`;
      takeawayText = `Under this simulated scenario, Availability remains above the 96% target.`;
    } else {
      interpretationText = `Increasing repair time to ${scenMttr.toFixed(2)} hrs would reduce Availability below the target threshold to <strong>${scenAvail.toFixed(2)}%</strong> (${availDiff.toFixed(2)}%). Corrective staging optimization would be required.`;
      takeawayText = `Under this simulated scenario, increased repair time would reduce Availability below the 96% target.`;
    }
  } else if (simCurrentMode === 'mtbf') {
    scenMtbf = Math.max(10, parseFloat(simMtbfNum?.value) || 10);
    scenMttr = baseMttr;
    scenAvail = calculateAvailabilityFormula(scenMtbf, scenMttr);

    const maxMtbfScale = Math.max(100000, baseMtbf * 2);
    updateVisualTrack(baseMtbf, scenMtbf, 1000, maxMtbfScale, 'MTBF (hrs)');

    const availDiff = scenAvail - baseAvail;
    if (scenAvail >= 96.00) {
      interpretationText = `Under this simulated scenario, adjusting MTBF to ${Math.round(scenMtbf).toLocaleString()} hrs results in <strong>${scenAvail.toFixed(2)}%</strong> Availability (${availDiff >= 0 ? '+' : ''}${availDiff.toFixed(2)}%). The model indicates performance would remain above the target threshold.`;
      takeawayText = `Under this simulated scenario, reliability performance maintains Availability above the 96% target.`;
    } else {
      interpretationText = `Under this simulated scenario, reduced operating intervals (MTBF ${Math.round(scenMtbf).toLocaleString()} hrs) would drop Availability to <strong>${scenAvail.toFixed(2)}%</strong>, falling below the 96.00% target.`;
      takeawayText = `Under this simulated scenario, decreased failure intervals would reduce Availability below the 96% target.`;
    }
  } else if (simCurrentMode === 'target') {
    if (simVisualTrack) simVisualTrack.style.display = 'none';

    const targetAvailPct = Math.min(99.99, Math.max(90.0, parseFloat(simTargetNum?.value) || 99.0));
    const targetAvailDecimal = targetAvailPct / 100;
    scenAvail = targetAvailPct;

    const selectedStrategy = document.querySelector('input[name="simStrategy"]:checked')?.value || 'fixed-mttr';

    if (selectedStrategy === 'fixed-mttr') {
      scenMttr = baseMttr;
      scenMtbf = calculateRequiredMtbf(targetAvailDecimal, scenMttr);
      const reqDelta = scenMtbf - baseMtbf;

      interpretationText = `To achieve target Availability of <strong>${targetAvailPct.toFixed(2)}%</strong> with MTTR fixed at ${baseMttr.toFixed(2)} hrs, the model indicates required MTBF would need to increase to <strong>${Math.round(scenMtbf).toLocaleString()} hrs</strong> (${reqDelta >= 0 ? '+' : ''}${Math.round(reqDelta).toLocaleString()} hrs).`;
      takeawayText = `Targeting ${targetAvailPct.toFixed(2)}% Availability with fixed repair time requires expanding MTBF to ${Math.round(scenMtbf).toLocaleString()} operating hours.`;
    } else {
      scenMtbf = baseMtbf;
      scenMttr = calculateRequiredMttr(targetAvailDecimal, scenMtbf);
      const redDelta = baseMttr - scenMttr;

      interpretationText = `To achieve target Availability of <strong>${targetAvailPct.toFixed(2)}%</strong> with MTBF fixed at ${baseMtbf.toLocaleString()} hrs, maximum allowable MTTR must be limited to <strong>${scenMttr.toFixed(2)} hrs or less</strong> (reduction of ${redDelta.toFixed(2)} hrs).`;
      takeawayText = `Targeting ${targetAvailPct.toFixed(2)}% Availability with fixed failure intervals requires limiting MTTR to ${scenMttr.toFixed(2)} hours.`;
    }
  }

  // Update What-If Visual Compare Board
  if (simBoardBaseAvail) simBoardBaseAvail.textContent = `${baseAvail.toFixed(2)}%`;
  if (simBoardScenAvail) simBoardScenAvail.textContent = `${scenAvail.toFixed(2)}%`;

  const availDelta = scenAvail - baseAvail;
  if (simBoardDiffAvail) {
    if (Math.abs(availDelta) < 0.005) {
      simBoardDiffAvail.textContent = '—';
      simBoardDiffAvail.style.color = 'var(--text-muted)';
      if (simBoardDiffCaption) simBoardDiffCaption.textContent = 'No variation';
    } else {
      const arrow = availDelta > 0 ? '↑' : '↓';
      simBoardDiffAvail.textContent = `${arrow} ${Math.abs(availDelta).toFixed(2)}%`;
      simBoardDiffAvail.style.color = availDelta > 0 ? '#66756B' : '#A65D57';
      if (simBoardDiffCaption) simBoardDiffCaption.textContent = availDelta > 0 ? 'increase' : 'decrease';
    }
  }

  // Threshold Reactive Styling
  if (simBoardScenarioBox) {
    simBoardScenarioBox.classList.remove('within-target', 'below-target');
    simBoardScenarioBox.classList.add(scenAvail >= 96.00 ? 'within-target' : 'below-target');
  }

  // Impact Summary Table
  const dict = i18nData[currentLang] || i18nData.en;
  if (simCmpBaseMtbf) simCmpBaseMtbf.textContent = `${baseMtbf.toLocaleString()} ${dict.unit_hrs}`;
  if (simCmpScenMtbf) simCmpScenMtbf.textContent = `${Math.round(scenMtbf).toLocaleString()} ${dict.unit_hrs}`;
  renderDiffIndicator(simCmpDeltaMtbf, scenMtbf - baseMtbf, dict.unit_hrs, true);

  if (simCmpBaseMttr) simCmpBaseMttr.textContent = `${baseMttr.toFixed(2)} ${dict.unit_hrs}`;
  if (simCmpScenMttr) simCmpScenMttr.textContent = `${scenMttr.toFixed(2)} ${dict.unit_hrs}`;
  renderDiffIndicator(simCmpDeltaMttr, scenMttr - baseMttr, dict.unit_hrs, false);

  if (simCmpBaseAvail) simCmpBaseAvail.textContent = `${baseAvail.toFixed(2)}%`;
  if (simCmpScenAvail) simCmpScenAvail.textContent = `${scenAvail.toFixed(2)}%`;
  renderDiffIndicator(simCmpDeltaAvail, scenAvail - baseAvail, '%', true);

  // Interpretation Card Tag & Narrative
  if (simFeasibilityBadge) {
    simFeasibilityBadge.className = 'interpret-pill ' + (scenAvail >= 96.00 ? 'status-within' : 'status-below');
    simFeasibilityBadge.textContent = (scenAvail >= 96.00) ? '✓ WITHIN TARGET' : '⚠ BELOW TARGET';
  }
  if (simInterpretationText) simInterpretationText.innerHTML = interpretationText;
  if (simTakeawayText) simTakeawayText.textContent = takeawayText;
}

function updateVisualTrack(baseVal, scenVal, minVal, maxVal, unitLabel) {
  if (!simVisualTrack) return;
  simVisualTrack.style.display = 'flex';

  const range = maxVal - minVal;
  const pctBase = Math.min(100, Math.max(0, ((baseVal - minVal) / range) * 100));
  const pctScen = Math.min(100, Math.max(0, ((scenVal - minVal) / range) * 100));

  if (trackLblBase) trackLblBase.textContent = `Baseline: ${baseVal.toLocaleString()} ${unitLabel}`;
  if (trackLblScen) trackLblScen.textContent = `Scenario: ${scenVal.toLocaleString()} ${unitLabel}`;

  if (trackDotBase) trackDotBase.style.left = `calc(${pctBase}% - 6px)`;
  if (trackDotScen) trackDotScen.style.left = `calc(${pctScen}% - 6px)`;

  if (trackActiveBar) {
    const left = Math.min(pctBase, pctScen);
    const width = Math.abs(pctScen - pctBase);
    trackActiveBar.style.left = `${left}%`;
    trackActiveBar.style.width = `${width}%`;
  }
}
