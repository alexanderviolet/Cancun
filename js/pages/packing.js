import { db, ref, set, get, onValue } from '../firebase-config.js';
import { showToast } from '../components/toast.js';

// Packing checklist items (inspired by cancun.py)
const PACKING_ITEMS = [
    { id: 'passport', emoji: '📄', name: 'Passport', description: 'Valid for 6+ months!', critical: true },
    { id: 'visa', emoji: '🎫', name: 'Visa/Tourist Card', description: 'If needed for entry', critical: true },
    { id: 'flight', emoji: '✈️', name: 'Flight Confirmation', description: 'Boarding passes', critical: true },
    { id: 'hotel', emoji: '🏨', name: 'Hotel Reservation', description: 'Confirmation number', critical: true },
    { id: 'sunscreen', emoji: '🧴', name: 'Sunscreen SPF 50+', description: 'Cancun sun is no joke!', critical: true },
    { id: 'swimsuit', emoji: '👙', name: 'Swimsuit', description: 'Pack at least 2!', critical: true },
    { id: 'sunglasses', emoji: '🕶️', name: 'Sunglasses', description: 'Essential for the beach', critical: false },
    { id: 'hat', emoji: '🧢', name: 'Hat/Cap', description: 'Protect your face', critical: false },
    { id: 'towel', emoji: '🏖️', name: 'Beach Towel', description: 'Quick-dry recommended', critical: true },
    { id: 'flipflops', emoji: '🩴', name: 'Flip Flops', description: 'For sand and pool', critical: true },
    { id: 'toiletries', emoji: '🧼', name: 'Toiletries', description: 'Toothbrush, toothpaste, deodorant', critical: true },
    { id: 'repellent', emoji: '🦟', name: 'Insect Repellent', description: 'Mosquitoes love tourists', critical: true },
    { id: 'charger', emoji: '🔌', name: 'Phone Charger', description: 'Don\'t forget the cable!', critical: true },
    { id: 'camera', emoji: '📷', name: 'Camera/GoPro', description: 'Capture the memories', critical: false },
    { id: 'cash', emoji: '💵', name: 'Cash & Cards', description: 'Pesos and credit/debit cards', critical: true },
    { id: 'party', emoji: '👗', name: 'Party Outfits', description: 'For clubs and bars', critical: false },
    { id: 'hangover', emoji: '🤢', name: 'Hangover Kit', description: 'Advil, pepto, water', critical: true },
    { id: 'speaker', emoji: '🔊', name: 'Portable Speaker', description: 'Pre-game vibes', critical: false },
    { id: 'powerbank', emoji: '🔋', name: 'Power Bank', description: 'For long beach days', critical: false },
    { id: 'waterproof', emoji: '📱', name: 'Waterproof Phone Case', description: 'Pool/beach selfies', critical: false }
];

let currentUser = null;
let packedItems = new Set();
let unsubscribe = null;

export function initPackingPage(user) {
    currentUser = user;
    loadPackedItems();
    renderChecklist();
}

function loadPackedItems() {
    if (!currentUser) return;
    
    const userPackingRef = ref(db, `users/${currentUser}/packing`);
    
    if (unsubscribe) unsubscribe();
    
    unsubscribe = onValue(userPackingRef, (snapshot) => {
        const data = snapshot.val();
        packedItems = new Set(data ? Object.keys(data).filter(key => data[key] === true) : []);
        renderChecklist();
        updateProgress();
    });
}

async function toggleItem(itemId) {
    if (!currentUser) {
        showToast('Please log in first', 'orange');
        return;
    }
    
    const newValue = !packedItems.has(itemId);
    const itemRef = ref(db, `users/${currentUser}/packing/${itemId}`);
    
    try {
        await set(itemRef, newValue);
        
        if (newValue) {
            packedItems.add(itemId);
            showToast(`✅ ${getItemName(itemId)} packed!`, 'green');
        } else {
            packedItems.delete(itemId);
            showToast(`📦 ${getItemName(itemId)} removed`, 'orange');
        }
        
        renderChecklist();
        updateProgress();
        checkReadiness();
    } catch (error) {
        console.error('Error updating packing item:', error);
        showToast('Error saving progress', 'orange');
    }
}

function getItemName(itemId) {
    const item = PACKING_ITEMS.find(i => i.id === itemId);
    return item ? item.name : itemId;
}

function renderChecklist() {
    const container = document.getElementById('packing-checklist');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Sort: critical items first, then by name
    const sorted = [...PACKING_ITEMS].sort((a, b) => {
        if (a.critical && !b.critical) return -1;
        if (!a.critical && b.critical) return 1;
        return a.name.localeCompare(b.name);
    });
    
    sorted.forEach(item => {
        const isChecked = packedItems.has(item.id);
        const itemDiv = document.createElement('div');
        itemDiv.className = `checklist-item ${isChecked ? 'checked' : ''}`;
        itemDiv.onclick = () => toggleItem(item.id);
        
        itemDiv.innerHTML = `
            <div class="checklist-checkbox">${isChecked ? '✓' : ''}</div>
            <div class="checklist-content">
                <div class="checklist-title">${item.emoji} ${item.name} ${item.critical ? '⚠️' : ''}</div>
                <div class="checklist-desc">${item.description}</div>
            </div>
        `;
        
        container.appendChild(itemDiv);
    });
    
    updateProgress();
    document.getElementById('total-items').textContent = PACKING_ITEMS.length;
}

function updateProgress() {
    const packedCount = packedItems.size;
    const totalItems = PACKING_ITEMS.length;
    const percentage = (packedCount / totalItems) * 100;
    
    document.getElementById('packed-count').textContent = packedCount;
    document.getElementById('progress-fill').style.width = `${percentage}%`;
}

function checkReadiness() {
    const packedCount = packedItems.size;
    const totalItems = PACKING_ITEMS.length;
    const missingItems = PACKING_ITEMS.filter(item => !packedItems.has(item.id));
    const missingCritical = missingItems.filter(item => item.critical).length;
    
    const summaryDiv = document.getElementById('packing-summary');
    
    if (packedCount === totalItems) {
        // All items packed!
        summaryDiv.style.display = 'block';
        summaryDiv.className = 'packing-summary success';
        summaryDiv.innerHTML = `
            <div class="summary-emoji">🎉🎉🎉</div>
            <div class="summary-title">AMAZING!</div>
            <div class="summary-message">
                You're fully packed and ready for Cancun!<br>
                Have an incredible spring break! 🌊🍹☀️
            </div>
            <div style="color: var(--muted); font-size: 11px;">
                Don't forget to:<br>
                • Double-check your passport one more time<br>
                • Download some playlists for the flight<br>
                • Tell your bank you're traveling
            </div>
        `;
    } else if (missingCritical > 0) {
        // Missing critical items - DISASTER!
        summaryDiv.style.display = 'block';
        summaryDiv.className = 'packing-summary warning';
        summaryDiv.innerHTML = `
            <div class="summary-emoji">😱😱😱</div>
            <div class="summary-title">SPRING BREAK DISASTER!</div>
            <div class="summary-message">
                YOU'RE NOT READY FOR CANCUN YET!<br>
                Pack these CRITICAL items NOW:
            </div>
            <div class="missing-list">
                ${missingItems.filter(item => item.critical).map(item => 
                    `<div class="missing-item">${item.emoji} ${item.name}</div>`
                ).join('')}
            </div>
            <div style="color: var(--muted); font-size: 11px; margin-top: 16px;">
                ⚠️ Don't even think about getting on the plane without these!
            </div>
        `;
    } else {
        // Missing some items but all critical are packed
        summaryDiv.style.display = 'block';
        summaryDiv.className = 'packing-summary';
        summaryDiv.innerHTML = `
            <div class="summary-emoji">👍</div>
            <div class="summary-title">Getting there!</div>
            <div class="summary-message">
                You've got the essentials, but could pack more:<br>
                ${missingItems.length} item${missingItems.length !== 1 ? 's' : ''} left
            </div>
        `;
    }
}

// Make functions available globally for onclick handlers
window.togglePackingItem = toggleItem;