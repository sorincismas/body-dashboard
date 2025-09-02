/**
 * Configurări și opțiuni pentru grafice
 */

/**
 * Generează opțiunile de bază pentru grafice
 * @param {Object} annotations - Adnotările pentru grafic
 * @returns {Object} - Opțiunile configurate pentru grafic
 */
export function createChartOptions(annotations) {
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
                    wheel: {
                        enabled: true
                    },
                    pinch: {
                        enabled: true
                    },
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

/**
 * Creează configurația pentru graficul de greutate
 * @param {Array} data - Datele pentru grafic
 * @param {number} height_m - Înălțimea în metri
 * @returns {Object} - Configurația completă a graficului
 */
export function createWeightChartConfig(data, height_m) {
    return {
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
        options: createChartOptions({
            box1: {
                type: 'box',
                yMin: 18.5 * Math.pow(height_m, 2),
                yMax: 24.9 * Math.pow(height_m, 2),
                backgroundColor: 'rgba(52, 199, 89, 0.1)',
                borderColor: 'rgba(52, 199, 89, 0.3)'
            }
        })
    };
}

/**
 * Creează configurația pentru graficul IMC
 * @param {Array} data - Datele pentru grafic
 * @returns {Object} - Configurația completă a graficului
 */
export function createBMIChartConfig(data) {
    return {
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
        options: createChartOptions({
            box1: {
                type: 'box',
                yMin: 18.5,
                yMax: 24.9,
                backgroundColor: 'rgba(52, 199, 89, 0.1)',
                borderColor: 'rgba(52, 199, 89, 0.3)'
            }
        })
    };
}

/**
 * Creează configurația pentru graficul măsurătorilor
 * @param {Array} data - Datele pentru grafic
 * @returns {Object} - Configurația completă a graficului
 */
export function createMeasurementsChartConfig(data) {
    return {
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
        options: createChartOptions({})
    };
}
