/**
 * Utilitare pentru calcularea metricilor și manipularea datelor
 */

/**
 * Calculează vârsta în ani bazată pe data nașterii
 * @param {Date} birthDate - Data nașterii
 * @returns {number} - Vârsta în ani
 */
export function calculateAge(birthDate) {
    return (new Date() - birthDate) / (1000 * 60 * 60 * 24 * 365.25);
}

/**
 * Calculează Indicele de Masă Corporală (IMC/BMI)
 * @param {number} weight - Greutatea în kg
 * @param {number} height - Înălțimea în metri
 * @returns {number} - IMC calculat
 */
export function calculateBMI(weight, height) {
    return weight / (height * height);
}

/**
 * Calculează Rata Metabolică Bazală (BMR) folosind formula Mifflin-St Jeor
 * @param {number} weight - Greutatea în kg
 * @param {number} height - Înălțimea în cm
 * @param {number} age - Vârsta în ani
 * @param {string} gender - Genul ('male' sau 'female')
 * @returns {number} - BMR calculat în kcal
 */
export function calculateBMR(weight, height, age, gender = 'male') {
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    return gender === 'male' ? bmr + 5 : bmr - 161;
}

/**
 * Calculează Necesarul Zilnic Total de Energie (TDEE)
 * @param {number} bmr - Rata Metabolică Bazală
 * @param {number} activityFactor - Factorul de activitate
 * @returns {number} - TDEE calculat în kcal
 */
export function calculateTDEE(bmr, activityFactor) {
    return bmr * activityFactor;
}

/**
 * Procesează datele brute pentru a calcula toate metricile necesare
 * @param {Array} rawData - Array-ul cu datele brute
 * @param {Object} userConfig - Configurația utilizatorului
 * @returns {Array} - Array-ul cu datele procesate
 */
export function processData(rawData, userConfig) {
    const height_m = userConfig.HEIGHT_CM / 100;
    
    return rawData.map(d => {
        const weight = parseFloat(d.weight_kg);
        const waist = parseFloat(d.waist_cm);
        const hips = parseFloat(d.hips_cm);
        
        return {
            ...d,
            weight_kg: weight,
            waist_cm: waist,
            hips_cm: hips,
            bmi: weight ? (weight / (height_m * height_m)) : null,
            whtr: waist ? (waist / userConfig.HEIGHT_CM) : null,
            whr: (waist && hips) ? (waist / hips) : null
        };
    });
}

/**
 * Calculează intervalul de greutate ideală bazat pe IMC
 * @param {number} height_m - Înălțimea în metri
 * @returns {Object} - Obiect cu limitele inferioară și superioară
 */
export function calculateIdealWeightRange(height_m) {
    return {
        low: (18.5 * (height_m * height_m)).toFixed(1),
        high: (24.9 * (height_m * height_m)).toFixed(1)
    };
}
