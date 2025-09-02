/**
 * UI Controller pentru gestionarea interfeței utilizator
 */

/**
 * Actualizează valorile din dashboard cu datele cele mai recente
 * @param {Object} lastEntry - Ultima înregistrare din date
 * @param {Object} userConfig - Configurația utilizatorului
 */
export function updateDashboard(lastEntry, userConfig) {
    if (!lastEntry) return;
    
    const age = (new Date() - userConfig.BIRTH_DATE) / (1000 * 60 * 60 * 24 * 365.25);
    const height_m = userConfig.HEIGHT_CM / 100;
    const weight_kg = lastEntry.weight_kg;

    // Calculăm indicii
    const bmi = weight_kg ? (weight_kg / (height_m * height_m)).toFixed(1) : '--';
    const whtr = lastEntry.whtr ? lastEntry.whtr.toFixed(2) : '--';
    const whr = lastEntry.whr ? lastEntry.whr.toFixed(2) : '--';
    
    // Calculăm valorile metabolice
    const bmr = weight_kg ? Math.round(10 * weight_kg + 6.25 * userConfig.HEIGHT_CM - 5 * age + 5) : '--';
    const tdee = bmr !== '--' ? Math.round(bmr * userConfig.ACTIVITY_FACTOR) : '--';

    // Calculăm greutățile ideale
    const ideal_weight_low = (18.5 * (height_m * height_m)).toFixed(1);
    const ideal_weight_high = (24.9 * (height_m * height_m)).toFixed(1);

    // Actualizăm interfața
    updateStatElement('weight', weight_kg ? `${weight_kg} kg` : '--');
    updateStatElement('bmi', bmi);
    updateStatElement('waist', lastEntry.waist_cm ? `${lastEntry.waist_cm} cm` : '--');
    updateStatElement('whtr', whtr);
    updateStatElement('whr', whr);
    updateStatElement('hips', lastEntry.hips_cm ? `${lastEntry.hips_cm} cm` : '--');
    updateStatElement('bmr', bmr !== '--' ? `${bmr} kcal` : '--');
    updateStatElement('tdee', tdee !== '--' ? `${tdee} kcal` : '--');
    
    document.getElementById('target-weight').textContent = `${ideal_weight_low}-${ideal_weight_high} kg`;
}

/**
 * Actualizează un element statistic individual
 * @param {string} id - ID-ul elementului
 * @param {string} value - Valoarea de afișat
 */
function updateStatElement(id, value) {
    document.getElementById(`stat-${id}`).textContent = value;
}

/**
 * Inițializează controalele pentru grafice
 * @param {Object} charts - Obiect cu referințe către grafice
 */
export function setupChartControls(charts) {
    document.querySelectorAll('.chart-button').forEach(button => {
        button.addEventListener('click', () => {
            const chartType = button.dataset.chart;
            const action = button.dataset.action;
            const chart = charts[chartType];

            if (!chart) return;

            switch(action) {
                case 'zoomIn':
                    chart.zoom(1.1);
                    break;
                case 'zoomOut':
                    chart.zoom(0.9);
                    break;
                case 'reset':
                    chart.resetZoom();
                    break;
            }
        });
    });
}

/**
 * Afișează o notificare toast
 * @param {string} message - Mesajul de afișat
 * @param {boolean} isError - Dacă este o eroare
 */
export function showToast(message, isError = false) {
    const toast = document.getElementById('toast-notification');
    toast.textContent = message;
    toast.style.backgroundColor = isError ? 'var(--danger-red)' : 'var(--secondary-green)';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

/**
 * Configurează evenimentele pentru modal
 * @param {function} onSubmit - Funcția de callback pentru submit
 */
export function setupModal(onSubmit) {
    const entryModal = document.getElementById('entry-modal');
    const entryForm = document.getElementById('entry-form');
    
    document.getElementById('add-entry-btn').addEventListener('click', () => {
        entryForm.reset();
        document.getElementById('date').valueAsDate = new Date();
        entryModal.classList.add('active');
    });
    
    entryModal.addEventListener('click', (e) => {
        if (e.target === entryModal) entryModal.classList.remove('active');
    });
    
    entryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await onSubmit(e);
        entryModal.classList.remove('active');
    });
}
