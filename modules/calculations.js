// modules/calculations.js

// Funcție centralizată pentru toate calculele
export function calculateAllMetrics(data, userConfig) {
    if (!data || data.length === 0) return null;
    
    const lastEntry = data[data.length - 1];
    const { BIRTH_DATE, HEIGHT_CM, ACTIVITY_FACTOR } = userConfig;

    const age = (new Date() - BIRTH_DATE) / (1000 * 60 * 60 * 24 * 365.25);
    const height_m = HEIGHT_CM / 100;
    const weight_kg = lastEntry.weight_kg;

    const metrics = {
        weight_kg: weight_kg || null,
        waist_cm: lastEntry.waist_cm || null,
        hips_cm: lastEntry.hips_cm || null,
        bmi: null, whtr: null, whr: null,
        bmr: null, tdee: null,
        ideal_weight_low: (18.5 * (height_m * height_m)).toFixed(1),
        ideal_weight_high: (24.9 * (height_m * height_m)).toFixed(1)
    };

    if (weight_kg) {
        metrics.bmi = (weight_kg / (height_m * height_m)).toFixed(1);
        metrics.bmr = Math.round(10 * weight_kg + 6.25 * HEIGHT_CM - 5 * age + 5);
        metrics.tdee = Math.round(metrics.bmr * ACTIVITY_FACTOR);
    }
    if (metrics.waist_cm) {
        metrics.whtr = (metrics.waist_cm / HEIGHT_CM).toFixed(2);
        if (metrics.hips_cm) {
            metrics.whr = (metrics.waist_cm / metrics.hips_cm).toFixed(2);
        }
    }
    return metrics;
}
