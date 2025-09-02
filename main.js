// main.js

// Importă serviciile Firebase și modulele locale
import { db } from './firebase-config.js';
import { calculateAllMetrics } from './modules/calculations.js';
import { showToast } from './modules/ui.js';

// --- CONFIGURARE PERSONALĂ ---
const USER_CONFIG = {
    BIRTH_DATE: new Date('1985-09-08'),
    HEIGHT_CM: 172,
    ACTIVITY_FACTOR: 1.55 
};

// --- Referințe DOM & Variabile Globale ---
const entryModal = document.getElementById('entry-modal');
const entryForm = document.getElementById('entry-form');
let weightChart, measurementsChart, bmiChart;

// --- Inițializare Evenimente ---
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-entry-btn').addEventListener('click', () => {
        entryForm.reset();
        document.getElementById('date').valueAsDate = new Date();
        entryModal.classList.add('active');
    });
    entryModal.addEventListener('click', (e) => {
        if (e.target === entryModal) entryModal.classList.remove('active');
    });
    entryForm.addEventListener('submit', handleFormSubmit);
    
    loadAllData();
});

// --- Logică Date ---
async function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const entry = {
        date: formData.get('date'),
        weight_kg: parseFloat(formData.get('weight')) || null,
        shoulders_cm: parseFloat(formData.get('shoulders')) || null,
        chest_cm: parseFloat(formData.get('chest')) || null,
        waist_cm: parseFloat(formData.get('waist')) || null,
        hips_cm: parseFloat(formData.get('hips')) || null,
        kcal_burnt: parseInt(formData.get('kcal')) || null
    };

    // Elimină câmpurile goale
    Object.keys(entry).forEach(key => (entry[key] == null || isNaN(entry[key])) && delete entry[key]);
    if (!entry.date) {
        showToast("Data este obligatorie!", true);
        return;
    }

    try {
        await db.collection('checkins').add(entry);
        entryModal.classList.remove('active');
        showToast('Date salvate cu succes!');
        loadAllData();
    } catch (error) {
        showToast('Eroare la salvare: ' + error.message, true);
    }
}

async function loadAllData() {
    try {
        const snapshot = await db.collection('checkins').orderBy('date').get();
        const data = snapshot.docs.map(doc => doc.data());
        
        const metrics = calculateAllMetrics(data, USER_CONFIG);
        
        updateDashboardUI(metrics);
        renderAllCharts(data);
    } catch(error) {
        console.error("Eroare la încărcarea datelor:", error);
        showToast("Nu am putut încărca datele.", true);
    }
}

// --- Logică UI (Actualizare și Desenare) ---
function updateDashboardUI(metrics) {
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

function renderAllCharts(data) {
    const chartOptions = (annotations) => ({
        responsive: true, maintainAspectRatio: false,
        scales: {
            x: { type: 'time', time: { unit: 'week', displayFormats: { week: 'dd MMM' } }, ticks: { color: 'var(--text-secondary)' }, grid: { color: 'var(--border-color)' } },
            y: { beginAtZero: false, ticks: { color: 'var(--text-secondary)' }, grid: { color: 'var(--border-color)' } }
        },
        plugins: { legend: { labels: { color: 'var(--text-secondary)', usePointStyle: true, pointStyle: 'circle' } }, annotation: { annotations } }
    });

    if (weightChart) weightChart.destroy();
    const weightCtx = document.getElementById('weightChart').getContext('2d');
    weightChart = new Chart(weightCtx, {
        type: 'line', data: { datasets: [{ label: 'Greutate', data: data.map(d => ({x: d.date, y: d.weight_kg})).filter(d=>d.y), borderColor: 'var(--primary-orange)', backgroundColor: 'rgba(255, 122, 0, 0.1)', tension: 0.2, pointRadius: 4, fill: true }] },
        options: chartOptions({ box1: { type: 'box', yMin: 18.5 * Math.pow(USER_CONFIG.HEIGHT_CM / 100, 2), yMax: 24.9 * Math.pow(USER_CONFIG.HEIGHT_CM / 100, 2), backgroundColor: 'rgba(52, 199, 89, 0.1)', borderColor: 'rgba(52, 199, 89, 0.3)' } })
    });
    
    // ... restul graficelor (IMC, Măsurători) ...
    // ... (copiază logica de creare a graficelor IMC și Măsurători din versiunea anterioară)
}
