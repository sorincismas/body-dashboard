import { db } from './firebase-init.js';
import { USER_CONFIG } from './config.js';

export async function saveEntry(entry) {
    return await db.collection('checkins').add(entry);
}

export async function loadAllData() {
    const snapshot = await db.collection('checkins').orderBy('date').get();
    const rawData = snapshot.docs.map(doc => doc.data());
    
    return rawData.map(d => processEntry(d));
}

function processEntry(entry) {
    const height_m = USER_CONFIG.HEIGHT_CM / 100;
    const weight = parseFloat(entry.weight_kg);
    const waist = parseFloat(entry.waist_cm);
    const hips = parseFloat(entry.hips_cm);
    
    return {
        ...entry,
        weight_kg: weight,
        waist_cm: waist,
        hips_cm: hips,
        bmi: weight ? (weight / (height_m * height_m)) : null,
        whtr: waist ? (waist / USER_CONFIG.HEIGHT_CM) : null,
        whr: (waist && hips) ? (waist / hips) : null
    };
}
