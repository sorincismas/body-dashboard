import { USER_CONFIG } from './config.js';

let weightChart, bmiChart, measurementsChart;

export function initializeCharts(data) {
    renderWeightChart(data);
    renderBMIChart(data);
    renderMeasurementsChart(data);
    setupChartControls();
}

function getDefaultChartOptions(annotations = {}) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        day: 'dd MMM'
                    }
                },
                ticks: {
                    color: 'var(--text-secondary)'
                },
                grid: {
                    color: 'var(--border-color)'
                }
            },
            y: {
                beginAtZero: false,
                ticks: {
                    color: 'var(--text-secondary)'
                },
                grid: {
                    color: 'var(--border-color)'
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: 'var(--text-secondary)',
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            annotation: { annotations },
            zoom: {
                zoom: {
                    wheel: { enabled: true },
                    pinch: { enabled: true },
                    mode: 'xy'
                },
                pan: {
                    enabled: true,
                    mode: 'xy'
                }
            }
        }
    };
}

function renderWeightChart(data) {
    if (weightChart) weightChart.destroy();
    const ctx = document.getElementById('weightChart').getContext('2d');
    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Greutate',
                data: data.map(d => ({x: d.date, y: d.weight_kg})),
                borderColor: 'var(--primary-orange)',
                backgroundColor: 'rgba(255, 122, 0, 0.1)',
                tension: 0.2,
                pointRadius: 4,
                fill: true
            }]
        },
        options: getDefaultChartOptions({
            box1: {
                type: 'box',
                yMin: 18.5 * Math.pow(USER_CONFIG.HEIGHT_CM / 100, 2),
                yMax: 24.9 * Math.pow(USER_CONFIG.HEIGHT_CM / 100, 2),
                backgroundColor: 'rgba(52, 199, 89, 0.1)',
                borderColor: 'rgba(52, 199, 89, 0.3)'
            }
        })
    });
}

function renderBMIChart(data) {
    if (bmiChart) bmiChart.destroy();
    const ctx = document.getElementById('bmiChart').getContext('2d');
    bmiChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'IMC',
                data: data.map(d => ({x: d.date, y: d.bmi})),
                borderColor: 'var(--primary-orange)',
                backgroundColor: 'rgba(255, 122, 0, 0.1)',
                tension: 0.2,
                pointRadius: 4,
                fill: true
            }]
        },
        options: getDefaultChartOptions({
            box1: {
                type: 'box',
                yMin: 18.5,
                yMax: 24.9,
                backgroundColor: 'rgba(52, 199, 89, 0.1)',
                borderColor: 'rgba(52, 199, 89, 0.3)'
            }
        })
    });
}

function renderMeasurementsChart(data) {
    if (measurementsChart) measurementsChart.destroy();
    const ctx = document.getElementById('measurementsChart').getContext('2d');
    measurementsChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Talie',
                    data: data.map(d => ({x: d.date, y: d.waist_cm})),
                    borderColor: '#FF9500',
                    tension: 0.2,
                    pointRadius: 4
                },
                {
                    label: 'Bust',
                    data: data.map(d => ({x: d.date, y: d.chest_cm})),
                    borderColor: '#FF2D55',
                    tension: 0.2,
                    pointRadius: 4
                },
                {
                    label: 'Șold',
                    data: data.map(d => ({x: d.date, y: d.hips_cm})),
                    borderColor: '#AF52DE',
                    tension: 0.2,
                    pointRadius: 4
                }
            ]
        },
        options: getDefaultChartOptions()
    });
}

function setupChartControls() {
    document.querySelectorAll('.chart-button').forEach(button => {
        button.addEventListener('click', () => {
            const chartType = button.dataset.chart;
            const action = button.dataset.action;
            let chart;

            switch(chartType) {
                case 'weight': chart = weightChart; break;
                case 'bmi': chart = bmiChart; break;
                case 'measurements': chart = measurementsChart; break;
            }

            if (!chart) return;

            switch(action) {
                case 'zoomIn': chart.zoom(1.1); break;
                case 'zoomOut': chart.zoom(0.9); break;
                case 'reset': chart.resetZoom(); break;
            }
        });
    });
}
