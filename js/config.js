/**
 * Firebase configuration and authentication setup
 */

// Configurare personală
export const USER_CONFIG = {
    BIRTH_DATE: new Date('1985-09-08'),
    HEIGHT_CM: 172,
    ACTIVITY_FACTOR: 1.55 
};

// Configurare Firebase din variabile de mediu
export const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

/**
 * Inițializează Firebase și autentifică utilizatorul
 * @returns {Promise<firebase.auth.UserCredential>}
 */
export async function initializeFirebase() {
    // Inițializare Firebase
    firebase.initializeApp(firebaseConfig);
    
    // Setăm persistența pentru a menține starea de autentificare
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    
    // Verificăm dacă utilizatorul este deja autentificat
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
        return currentUser;
    }

    // Dacă nu este autentificat, folosim autentificare anonimă
    try {
        return await firebase.auth().signInAnonymously();
    } catch (error) {
        console.error("Eroare la autentificare:", error);
        throw error;
    }
}

/**
 * Obține instanța Firestore cu verificări de securitate
 * @returns {firebase.firestore.Firestore}
 */
export function getFirestore() {
    const db = firebase.firestore();
    
    // Activăm cache-ul offline
    db.enablePersistence()
        .catch((err) => {
            if (err.code == 'failed-precondition') {
                console.warn('Persistența poate fi activată într-o singură filă.');
            } else if (err.code == 'unimplemented') {
                console.warn('Browser-ul nu suportă persistență.');
            }
        });

    return db;
}
