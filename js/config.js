export const USER_CONFIG = {
    BIRTH_DATE: new Date('1985-09-08'),
    HEIGHT_CM: 172,
    ACTIVITY_FACTOR: 1.55
};

export const TARGETS = {
    weight: {
        min: 18.5 * Math.pow(USER_CONFIG.HEIGHT_CM / 100, 2),
        max: 24.9 * Math.pow(USER_CONFIG.HEIGHT_CM / 100, 2)
    },
    bmi: { min: 18.5, max: 24.9 },
    waist: { max: 94 },
    whtr: { max: 0.5 },
    whr: { max: 0.9 },
    hips: { min: 98, max: 102 }
};
