import { db } from './firebase-config.js';
import { todayKey, formatDayLabel, timeAgo } from './utils/date-utils.js';
import { getRoast } from './utils/roast-utils.js';
import { showToast } from './components/toast.js';
import { switchPage, showScreen } from './components/navigation.js';
import { handleLogin, handleSignup, logout, getCurrentUser } from './auth.js';
import { initLogPage, logDrink, logVom } from './pages/log.js';
import { initHomePage, subscribeData, selectDay, removeDrink } from './pages/home.js';
import { initBoardPage, switchLbTab } from './pages/board.js';
import { initPackingPage } from './pages/packing.js';

// Make all necessary functions available globally for onclick handlers
window.switchPage = switchPage;
window.showScreen = showScreen;
window.toast = showToast;
window.todayKey = todayKey;
window.formatDayLabel = formatDayLabel;
window.timeAgo = timeAgo;
window.getRoast = getRoast;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.logout = logout;
window.logDrink = logDrink;
window.logVom = logVom;
window.selectDay = selectDay;
window.removeDrink = removeDrink;
window.switchLbTab = switchLbTab;

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved session
    const savedUser = sessionStorage.getItem('sb_user');
    if (savedUser) {
        window.currentUser = savedUser;
        document.getElementById('header-username').textContent = savedUser;
        window.selectedDay = todayKey();
        showScreen('app');
        
        // Initialize all pages
        subscribeData(savedUser);
        if (initLogPage) initLogPage();
        if (initPackingPage) initPackingPage(savedUser);
    }
});