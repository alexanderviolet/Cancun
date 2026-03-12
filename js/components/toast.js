let toastTimer;

export function showToast(msg, color) {
    const el = document.getElementById('toast');
    if (!el) return;
    
    el.textContent = msg;
    el.className = color;
    el.classList.add('show');
    
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
}

// Make available globally for inline onclick handlers
window.toast = showToast;