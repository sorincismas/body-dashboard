import { fetchMetricsData, addMetricsData } from './js/data-service.js';
import { calculateBMI, getBMICategory, calculateBMIColor, formatMetric, calculateProgress, getWeightStatus } from './js/metrics.js';
import { USER_CONFIG } from './js/config.js';
import { initializeCharts } from './js/charts.js';

let metricsData = [];

async function loadAndDisplayData() {
    try {
        metricsData = await fetchMetricsData();
        if (metricsData.length === 0) return;

        const latestMetrics = metricsData[metricsData.length - 1];
        const firstMetrics = metricsData[0];
        
        updateMetricsDisplay(latestMetrics, firstMetrics);
        initializeCharts(metricsData);
        
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

function updateMetricsDisplay(latest, first) {
    // Current Weight
    document.getElementById('currentWeight').textContent = formatMetric(latest.weight_kg, 'weight');
    
    // BMI
    const bmi = calculateBMI(latest.weight_kg, USER_CONFIG.HEIGHT_CM);
    const bmiCategory = getBMICategory(bmi);
    const bmiElement = document.getElementById('bmiValue');
    bmiElement.textContent = formatMetric(bmi, 'bmi');
    bmiElement.style.color = calculateBMIColor(bmi);
    document.getElementById('bmiCategory').textContent = bmiCategory;

    // Progress
    const progress = calculateProgress(latest.weight_kg, first.weight_kg, USER_CONFIG.GOAL_WEIGHT_KG);
    document.getElementById('progressBar').style.width = `${progress}%`;
    document.getElementById('progressValue').textContent = `${Math.round(progress)}%`;
    
    // Goal Status
    document.getElementById('weightStatus').textContent = 
        getWeightStatus(latest.weight_kg, USER_CONFIG.GOAL_WEIGHT_KG);

    // Latest Measurements
    document.getElementById('waistMeasurement').textContent = formatMetric(latest.waist_cm, 'measurement');
    document.getElementById('chestMeasurement').textContent = formatMetric(latest.chest_cm, 'measurement');
    document.getElementById('hipsMeasurement').textContent = formatMetric(latest.hips_cm, 'measurement');
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const newMetrics = {
        date: formData.get('date'),
        weight_kg: parseFloat(formData.get('weight')),
        waist_cm: parseInt(formData.get('waist')),
        chest_cm: parseInt(formData.get('chest')),
        hips_cm: parseInt(formData.get('hips')),
        bmi: calculateBMI(
            parseFloat(formData.get('weight')), 
            USER_CONFIG.HEIGHT_CM
        )
    };

    try {
        await addMetricsData(newMetrics);
        event.target.reset();
        await loadAndDisplayData();
    } catch (error) {
        console.error("Error saving metrics:", error);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadAndDisplayData();
    document.getElementById('metricsForm').addEventListener('submit', handleFormSubmit);
});
