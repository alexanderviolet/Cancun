export function getRoast(n, voms) {
    if (voms > 0) return 'been through it 🤮';
    if (n === 0) return 'sober sally 😇';
    if (n <= 2) return 'just warming up 🌅';
    if (n <= 5) return 'feeling it 🌊';
    if (n <= 8) return 'in the zone 🔥';
    if (n <= 12) return 'legend status 🏆';
    return 'call an uber 🚨';
}