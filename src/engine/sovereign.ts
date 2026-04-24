/**
 * SPDX-License-Identifier: Apache-2.0
 */

export const calculateGematria = (text: string) => {
    const t = text.toUpperCase();
    let simple = 0;
    let english = 0; // A=6, B=12
    
    for (let i = 0; i < t.length; i++) {
        const charCode = t.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
            const val = charCode - 64;
            simple += val;
            english += val * 6;
        }
    }
    
    return { simple, english };
};

export const calculateNumerology = (name: string, birthdate?: string) => {
    const reduce = (n: number): number => {
        if (n <= 9) return n;
        const s = n.toString().split('').reduce((a, b) => a + parseInt(b), 0);
        return reduce(s);
    };

    const getVowelsScore = (s: string) => {
        const vowels = ['A', 'E', 'I', 'O', 'U'];
        let score = 0;
        for (const char of s.toUpperCase()) {
            if (vowels.includes(char)) score += (char.charCodeAt(0) - 64);
        }
        return reduce(score);
    };

    const getConsonantsScore = (s: string) => {
        const vowels = ['A', 'E', 'I', 'O', 'U'];
        let score = 0;
        for (const char of s.toUpperCase()) {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90 && !vowels.includes(char)) {
                score += (code - 64);
            }
        }
        return reduce(score);
    };

    const soulUrge = getVowelsScore(name); // Fuel
    const personality = getConsonantsScore(name); // Armor
    const expression = reduce(soulUrge + personality); // Vehicle
    
    // Default Life Path if no birthdate
    let lifePath = 5; 
    if (birthdate) {
        const digits = birthdate.replace(/\D/g, '');
        const sum = digits.split('').reduce((a, b) => a + parseInt(b), 0);
        lifePath = reduce(sum);
    }

    const maturity = reduce(lifePath + expression);

    return { lifePath, expression, soulUrge, personality, maturity };
};
