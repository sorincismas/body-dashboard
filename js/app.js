/**
 * Controller principal pentru aplicație
 */
import { USER_CONFIG, firebaseConfig } from './config.js';
import { processData } from './utils.js';
import { createWeightChartConfig, createBMIChartConfig, createMeasurementsChartConfig } from './charts.js';
import { updateDashboard, setupChartControls, showToast, setupModal } from './ui.js';

// Stare globală pentru grafice
let weightChart, bmiChart, measurementsChart;

document.addEventListener('DOMContentLoaded', () => {
    // Inițializare Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // Configurare UI
    setupModal(handleFormSubmit);
    
    // Încărcare date inițială
    loadAllData();

    /**
     * Procesează submiterea formularului
     * @param {Event} e - Evenimentul de submit
     */
    async function handleFormSubmit(e) {
        const entry = {
            date: document.getElementById('date').value,
            weight_kg: parseFloat(document.getElementById('weight').value) || null,
            shoulders_cm: parseFloat(document.getElementById('shoulders').value) || null,
            chest_cm: parseFloat(document.getElementById('chest').value) || null,
            waist_cm: parseFloat(document.getElementById('waist').value) || null,
            hips_cm: parseFloat(document.getElementById('hips').value) || null,
            kcal_burnt: parseInt(document.getElementById('kcal').value) || null
        };

        // Eliminăm proprietățile null
        Object.keys(entry).forEach(key => {
            if (entry[key] === null) {
                delete entry[key];
            }
        });

        try {
            await db.collection('checkins').add(entry);
            showToast('Date salvate cu succes!');
            loadAllData();
        } catch (error) {
            showToast('Eroare la salvare: ' + error.message, true);
        }
    }

    /**
     * Încarcă toate datele din Firebase și actualizează UI-ul
     */
    async function loadAllData() {
        try {
            const snapshot = await db.collection('checkins').orderBy('date').get();
            const rawData = snapshot.docs.map(doc => doc.data());
            const processedData = processData(rawData, USER_CONFIG);
            
            updateDashboard(processedData[processedData.length - 1], USER_CONFIG);
            renderCharts(processedData);
        } catch(error) {
            console.error("Eroare la încărcarea datelor:", error);
            showToast("Nu am putut încărca datele.", true);
        }
    }

    /**
     * Renderează toate graficele cu datele procesate
     * @param {Array} data - Datele procesate pentru grafice
     */
    function renderCharts(data) {
        const height_m = USER_CONFIG.HEIGHT_CM / 100;

        // Curățăm graficele existente
        if (weightChart) weightChart.destroy();
        if (bmiChart) bmiChart.destroy();
        if (measurementsChart) measurementsChart.destroy();

        // Inițializăm graficele noi
        const weightCtx = document.getElementById('weightChart').getContext('2d');
        weightChart = new Chart(weightCtx, createWeightChartConfig(data, height_m));

        const bmiCtx = document.getElementById('bmiChart').getContext('2d');
        bmiChart = new Chart(bmiCtx, createBMIChartConfig(data));

        const measureCtx = document.getElementById('measurementsChart').getContext('2d');
        measurementsChart = new Chart(measureCtx, createMeasurementsChartConfig(data));

        // Configurăm controalele pentru grafice
        setupChartControls({ weight: weightChart, bmi: bmiChart, measurements: measurementsChart });
    }
});
