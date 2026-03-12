import { db, ref, get, set } from './firebase-config.js';
import { showToast } from './components/toast.js';
import { showScreen } from './components/navigation.js';
import { initPackingPage } from './pages/packing.js';

let currentUser = null;

export function getCurrentUser() {
    return currentUser;
}

export function slideToSignup() {
    document.getElementById('auth-slider').classList.add('show-signup');
    document.getElementById('login-error').style.display = 'none';
}

export function slideToLogin() {
    document.getElementById('auth-slider').classList.remove('show-signup');
    document.getElementById('signup-error').style.display = 'none';
}

export async function handleLogin() {
    const name = document.getElementById('login-name').value.trim().toLowerCase();
    const pin = document.getElementById('login-pin').value.trim();
    const errEl = document.getElementById('login-error');
    
    errEl.style.display = 'none';
    if (!name || pin.length < 4) {
        errEl.textContent = 'Need a name + 4-digit PIN';
        errEl.style.display = 'block';
        return;
    }
    
    const snap = await get(ref(db, 'users/' + name));
    if (!snap.exists()) {
        errEl.textContent = 'User not found — sign up?';
        errEl.style.display = 'block';
        return;
    }
    if (snap.val().pin !== pin) {
        errEl.textContent = 'Wrong PIN 🚫';
        errEl.style.display = 'block';
        return;
    }
    
    currentUser = name;
    sessionStorage.setItem('sb_user', name);
    enterApp();
    showToast('Back at it, ' + name + '! 🤙', 'orange');
}

export async function handleSignup() {
    const name = document.getElementById('signup-name').value.trim().toLowerCase();
    const pin = document.getElementById('signup-pin').value.trim();
    const errEl = document.getElementById('signup-error');
    
    errEl.style.display = 'none';
    if (!name || pin.length < 4) {
        errEl.textContent = 'Need a name + 4-digit PIN';
        errEl.style.display = 'block';
        return;
    }
    
    const snap = await get(ref(db, 'users/' + name));
    if (snap.exists()) {
        errEl.textContent = 'Name taken — try another';
        errEl.style.display = 'block';
        return;
    }
    
    await set(ref(db, 'users/' + name), { pin, joined: Date.now() });
    currentUser = name;
    sessionStorage.setItem('sb_user', name);
    enterApp();
    showToast('Welcome to the crew, ' + name + '! 🎉', 'orange');
}

export function logout() {
    if (window.unsubscribe) window.unsubscribe();
    sessionStorage.removeItem('sb_user');
    currentUser = null;
    slideToLogin();
    showScreen('auth');
}

function enterApp() {
    document.getElementById('header-username').textContent = currentUser;
    window.selectedDay = window.todayKey ? window.todayKey() : null;
    showScreen('app');
    
    // Initialize all pages
    if (window.subscribeData) window.subscribeData(currentUser);
    if (window.initLogPage) window.initLogPage();
    if (window.initPackingPage) window.initPackingPage(currentUser);
}

// Make functions globally available
window.slideToSignup = slideToSignup;
window.slideToLogin = slideToLogin;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.logout = logout;