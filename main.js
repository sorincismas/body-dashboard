// main.js - Orchestratorul principal al aplicației

// --- Importuri ---
// Importăm serviciile Firebase configurate în fișierul separat
import { db } from './firebase-config.js';
// Importăm funcțiile specializate din module
import { calculateAllMetrics } from './modules/calculations.js';
import { updateDashboardUI, renderAllCharts, showToast } from './modules/ui.js';

// --- CONFIGURARE PERSONALĂ ---
const USER_CONFIG = {
    BIRTH_DATE: new Date('1985-09-08'),
    HEIGHT_CM: 172,
    ACTIVITY_FACTOR: 1.55 // 1.2=sedentar, 1.55=moderat activ, 1.725=foarte activ
};

// --- Referințe DOM & Variabile Globale ---
const entryModal = document.getElementById('entry-modal');
const entryForm = document.getElementById('entry-form');

// --- Inițializare Evenimente ---
// Așteptăm ca tot conținutul paginii să fie încărcat înainte de a rula scriptul
document.addEventListener('DOMContentLoaded', () => {
    // Logica pentru deschiderea ferestrei de adăugare
    document.getElementById('add-entry-btn').addEventListener('click', () => {
        entryForm.reset();
        document.getElementById('date').valueAsDate = new Date();
        entryModal.classList.add('active');
    });

    // Logica pentru închiderea ferestrei la click în exterior
    entryModal.addEventListener('click', (e) => {
        if (e.target === entryModal) {
            entryModal.classList.remove('active');
        }
    });

    // Logica pentru trimiterea formularului
    entryForm.addEventListener('submit', handleFormSubmit);
    
    // Încărcăm datele inițiale la pornirea aplicației
    loadAllData();
});

// --- Logică Date (Comunicarea cu Baza de Date) ---

/**
 * Prelucrează datele din formular și le salvează în Firestore.
 * @param {Event} e Evenimentul de submit al formularului.
 */
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

    // Elimină câmpurile goale pentru a nu le salva în baza de date
    Object.keys(entry).forEach(key => {
        if (entry[key] === null || isNaN(entry[key])) {
            delete entry[key];
        }
    });
    
    // Data este singurul câmp obligatoriu
    if (!entry.date) {
        showToast("Data este obligatorie!", true);
        return;
    }

    try {
        await db.collection('checkins').add(entry);
        entryModal.classList.remove('active');
        showToast('Date salvate cu succes!');
        loadAllData(); // Reîncarcă toate datele pentru a reflecta noua intrare
    } catch (error) {
        showToast('Eroare la salvare: ' + error.message, true);
    }
}

/**
 * Încarcă toate înregistrările din Firestore și pornește actualizarea interfeței.
 */
async function loadAllData() {
    try {
        const snapshot = await db.collection('checkins').orderBy('date').get();
        const rawData = snapshot.docs.map(doc => doc.data());
        
        // Pre-procesăm datele, calculând toți indicii derivați (IMC, WHR etc.)
        const processedData = rawData.map(d => {
            const height_m = USER_CONFIG.HEIGHT_CM / 100;
            const weight = d.weight_kg;
            const waist = d.waist_cm;
            const hips = d.hips_cm;
            return {
                ...d,
                bmi: weight ? (weight / (height_m * height_m)) : null,
                whtr: waist ? (waist / USER_CONFIG.HEIGHT_CM) : null,
                whr: waist && hips ? (waist / hips) : null
            };
        });
        
        const latestMetrics = calculateAllMetrics(processedData, USER_CONFIG);
        
        updateDashboardUI(latestMetrics);
        renderAllCharts(processedData, USER_CONFIG);

    } catch(error) {
        console.error("Eroare la încărcarea datelor:", error);
        showToast("Nu am putut încărca datele.", true);
    }
}
