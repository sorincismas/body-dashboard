// modules/ui.js

let weightChart, measurementsChart, bmiChart;

// Actualizează cardurile de statistici
export function updateDashboardUI(metrics) {
    if (!metrics) return;
    document.getElementById('stat-weight').textContent = `${metrics.weight_kg || '--'} kg`;
    document.getElementById('stat-bmi').textContent = metrics.bmi || '--';
    document.getElementById('stat-waist').textContent = `${metrics.waist_cm || '--'} cm`;
    document.getElementById('stat-whtr').textContent = metrics.whtr || '--';
    document.getElementById('stat-whr').textContent = metrics.whr || '--';
    document.getElementById('stat-hips').textContent = `${metrics.hips_cm || '--'} cm`;
    document.getElementById('stat-bmr').textContent = `${metrics.bmr || '--'} kcal`;
    document.getElementById('stat-tdee').textContent = `${metrics.tdee || '--'} kcal`;
    document.getElementById('target-weight').textContent = `${metrics.ideal_weight_low}-${metrics.ideal_weight_high} kg`;
}

// Desenează toate graficele
export function renderAllCharts(data, userConfig) {
    if (weightChart) weightChart.destroy();
    if (measurementsChart) measurementsChart.destroy();
    if (bmiChart) bmiChart.destroy();
    
    // ... Logica pentru a crea chartOptions ...
    const chartOptions = (annotations) => ({ /* ... copiază chartOptions din main.js de mai jos ... */ });

    // Aici ar trebui să fie logica detaliată pentru fiecare grafic, dar o vom păstra în main.js deocamdată pentru simplitate
    // În viitor, am putea muta fiecare funcție de creare a graficului aici.
}


// Afișează o notificare "toast"
export function showToast(message, isError = false) {
    const toast = document.getElementById('toast-notification');
    toast.textContent = message;
    toast.style.backgroundColor = isError ? 'var(--danger-red)' : 'var(--secondary-green)';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
