/* ============================================================
   RAM WHAT-IF SIMULATOR ENGINE (REDESIGNED DECISION SUPPORT)
   ============================================================ */

// References to new visual comparison elements
const simBoardBaseAvail = document.getElementById('simBoardBaseAvail');
const simBoardScenAvail = document.getElementById('simBoardScenAvail');
const simBoardDiffAvail = document.getElementById('simBoardDiffAvail');
const simBoardScenarioBox = document.getElementById('simBoardScenarioBox');
const simTakeawayText = document.getElementById('simTakeawayText');

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

  // Context fields
  simCompName.textContent = rowItem.component;
  simFailMode.textContent = rowItem.mode;
  simFailCause.textContent = rowItem.cause;

  // Baseline metric pills
  simBaseMtbf.textContent = `${rowItem.mtbf.toLocaleString()} ${dict.unit_hrs}`;
  simBaseMttr.textContent = `${rowItem.mttr.toFixed(2)} ${dict.unit_hrs}`;
  simBaseAvail.textContent = `${rowItem.availability.toFixed(2)}%`;

  resetSimulatorInputs();
  recalculateWhatIfScenario();
}

function resetSimulatorInputs() {
  if (!simActiveRow) return;

  // Reset MTTR
  simMttrSlider.value = simActiveRow.mttr > 0 ? simActiveRow.mttr : 8;
  simMttrNum.value = simMttrSlider.value;

  // Reset MTBF
  const mtbfVal = simActiveRow.mtbf > 0 ? simActiveRow.mtbf : 25000;
  simMtbfSlider.max = Math.max(100000, mtbfVal * 2);
  simMtbfSlider.value = mtbfVal;
  simMtbfNum.value = mtbfVal;

  // Reset Target
  simTargetSlider.value = 99.95;
  simTargetNum.value = 99.95;

  const defaultStrat = document.querySelector('input[name="simStrategy"][value="fixed-mttr"]');
  if (defaultStrat) defaultStrat.checked = true;
}

function initSimulatorEventListeners() {
  // Scenario Selection
  simScenarioSelect.addEventListener('change', function() {
    const currentSheet = sheetSelect.value;
    const rows = getNormalizedRows(currentSheet);
    const selectedIdx = parseInt(this.value);
    if (!isNaN(selectedIdx) && rows[selectedIdx]) {
      loadSimulatorBaseline(rows[selectedIdx]);
    }
  });

  // Reset Button
  simResetBtn.addEventListener('click', () => {
    resetSimulatorInputs();
    recalculateWhatIfScenario();
  });

  // Segmented Mode Switcher
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

  // Mode 1: MTTR Sync
  simMttrSlider.addEventListener('input', function() {
    simMttrNum.value = parseFloat(this.value).toFixed(1);
    recalculateWhatIfScenario();
  });
  simMttrNum.addEventListener('input', function() {
    simMttrSlider.value = this.value;
    recalculateWhatIfScenario();
  });

  // Mode 2: MTBF Sync
  simMtbfSlider.addEventListener('input', function() {
    simMtbfNum.value = this.value;
    recalculateWhatIfScenario();
  });
  simMtbfNum.addEventListener('input', function() {
    simMtbfSlider.value = this.value;
    recalculateWhatIfScenario();
  });

  // Mode 3: Target Sync
  simTargetSlider.addEventListener('input', function() {
    simTargetNum.value = parseFloat(this.value).toFixed(2);
    recalculateWhatIfScenario();
  });
  simTargetNum.addEventListener('input', function() {
    simTargetSlider.value = this.value;
    recalculateWhatIfScenario();
  });

  // Strategy Radio Sync
  document.querySelectorAll('input[name="simStrategy"]').forEach(radio => {
    radio.addEventListener('change', recalculateWhatIfScenario);
  });
}

function recalculateWhatIfScenario() {
  if (!simActiveRow) return;
  const dict = i18nData[currentLang] || i18nData.en;

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
      interpretationText = `Under this simulated scenario, adjusting repair time to ${scenMttr.toFixed(2)} hrs yields a calculated Availability of <strong>${scenAvail.toFixed(2)}%</strong> (${availDiff >= 0 ? '+' : ''}${availDiff.toFixed(2)}%). The model indicates the equipment would remain above the target threshold.`;
      takeawayText = `A moderate change in repair duration adjusts Availability to ${scenAvail.toFixed(2)}%, maintaining compliance with the 96.00% benchmark.`;
    } else {
      interpretationText = `Increasing repair time to ${scenMttr.toFixed(2)} hrs would reduce Availability below the 96.00% target threshold to <strong>${scenAvail.toFixed(2)}%</strong> (${availDiff.toFixed(2)}%). Corrective mitigation would be required under these operational parameters.`;
      takeawayText = `Under this simulated scenario, increased repair time would reduce Availability below the 96.00% target.`;
    }
  } else if (simCurrentMode === 'mtbf') {
    scenMtbf = Math.max(10, parseFloat(simMtbfNum.value) || 10);
    scenMttr = baseMttr;
    scenAvail = calculateAvailabilityFormula(scenMtbf, scenMttr);

    const availDiff = scenAvail - baseAvail;
    if (scenAvail >= 96.00) {
      interpretationText = `Based on the selected assumptions, adjusting MTBF to ${Math.round(scenMtbf).toLocaleString()} hrs while holding MTTR at ${baseMttr.toFixed(2)} hrs results in <strong>${scenAvail.toFixed(2)}%</strong> Availability (${availDiff >= 0 ? '+' : ''}${availDiff.toFixed(2)}%). The model indicates performance would remain within target bounds.`;
      takeawayText = `Reliability scaling indicates operational Availability would remain healthy at ${scenAvail.toFixed(2)}%.`;
    } else {
      interpretationText = `Under this simulated scenario, shorter operating intervals (MTBF ${Math.round(scenMtbf).toLocaleString()} hrs) would drop Availability to <strong>${scenAvail.toFixed(2)}%</strong>, breaching the 96.00% target.`;
      takeawayText = `Degraded failure intervals would drive equipment Availability below the 96.00% target.`;
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

      interpretationText = `To achieve the target Availability of <strong>${targetAvailPct.toFixed(2)}%</strong> while holding MTTR constant at ${baseMttr.toFixed(2)} hrs, the model indicates required MTBF would need to reach approximately <strong>${Math.round(scenMtbf).toLocaleString()} hrs</strong> (${reqDelta >= 0 ? '+' : ''}${Math.round(reqDelta).toLocaleString()} hrs vs baseline).`;
      takeawayText = `Targeting ${targetAvailPct.toFixed(2)}% Availability with fixed repair time requires expanding MTBF to ${Math.round(scenMtbf).toLocaleString()} operating hours.`;
    } else {
      scenMtbf = baseMtbf;
      scenMttr = calculateRequiredMttr(targetAvailDecimal, scenMtbf);
      const redDelta = baseMttr - scenMttr;

      interpretationText = `To achieve the target Availability of <strong>${targetAvailPct.toFixed(2)}%</strong> while holding MTBF constant at ${baseMtbf.toLocaleString()} hrs, maximum allowable MTTR would need to be reduced to <strong>${scenMttr.toFixed(2)} hrs or less</strong> (a reduction of ${redDelta >= 0 ? '-' : '+'}${Math.abs(redDelta).toFixed(2)} hrs).`;
      takeawayText = `Targeting ${targetAvailPct.toFixed(2)}% Availability with fixed failure intervals requires limiting MTTR to ${scenMttr.toFixed(2)} hours.`;
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
  simCmpBaseMtbf.textContent = `${baseMtbf.toLocaleString()} hrs`;
  simCmpScenMtbf.textContent = `${Math.round(scenMtbf).toLocaleString()} hrs`;
  renderDiffIndicator(simCmpDeltaMtbf, scenMtbf - baseMtbf, 'hrs', true);

  simCmpBaseMttr.textContent = `${baseMttr.toFixed(2)} hrs`;
  simCmpScenMttr.textContent = `${scenMttr.toFixed(2)} hrs`;
  renderDiffIndicator(simCmpDeltaMttr, scenMttr - baseMttr, 'hrs', false); // lower MTTR is good

  simCmpBaseAvail.textContent = `${baseAvail.toFixed(2)}%`;
  simCmpScenAvail.textContent = `${scenAvail.toFixed(2)}%`;
  renderDiffIndicator(simCmpDeltaAvail, scenAvail - baseAvail, '%', true); // higher Avail is good

  // Interpretation Panel Tag & Body
  if (simFeasibilityBadge) {
    simFeasibilityBadge.className = 'interpret-tag ' + (scenAvail >= 96.00 ? 'tag-within' : 'tag-below');
    simFeasibilityBadge.textContent = (scenAvail >= 96.00) ? 'WITHIN TARGET' : 'BELOW TARGET';
  }
  if (simInterpretationText) simInterpretationText.innerHTML = interpretationText;
  if (simTakeawayText) simTakeawayText.textContent = takeawayText;
}
