import { USER_CONFIG, TARGETS } from './config.js';

export function calculateMetrics(entry) {
    const age = (new Date() - USER_CONFIG.BIRTH_DATE) / (1000 * 60 * 60 * 24 * 365.25);
    const height_m = USER_CONFIG.HEIGHT_CM / 100;
    const weight_kg = entry.weight_kg;

    return {
        bmi: weight_kg ? (weight_kg / (height_m * height_m)).toFixed(1) : '--',
        whtr: entry.whtr ? entry.whtr.toFixed(2) : '--',
        whr: entry.whr ? entry.whr.toFixed(2) : '--',
        bmr: weight_kg ? Math.round(10 * weight_kg + 6.25 * USER_CONFIG.HEIGHT_CM - 5 * age + 5) : '--',
        tdee: weight_kg ? Math.round((10 * weight_kg + 6.25 * USER_CONFIG.HEIGHT_CM - 5 * age + 5) * USER_CONFIG.ACTIVITY_FACTOR) : '--',
        ideal_weight: {
            low: (18.5 * (height_m * height_m)).toFixed(1),
            high: (24.9 * (height_m * height_m)).toFixed(1)
        }
    };
}
