// app.js - extracted from index.html
// ==================== Theme Toggle ====================
function bindThemeToggle() {
    const themeSwitch = document.getElementById('theme-switch');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') === null ? 'dark' : localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    } else {
        document.body.setAttribute('data-theme', 'light');
    }

    updateThemeIcon();

    if (themeSwitch) {
        themeSwitch.addEventListener('click', () => {
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
            updateThemeIcon();
        });
    }
}

function updateThemeIcon() {
    const themeIcon = document.getElementById('theme-icon');
    const isDark = document.body.getAttribute('data-theme') === 'dark';

    if (themeIcon) {
        if (isDark) {
            themeIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5M17.6859 17.69L18.5 18.5M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>`;
        } else {
            themeIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
        }
    }
}

// ==================== Favorites ====================
function getFavorites() {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function toggleFavorite(toolId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(toolId);
    
    if (index === -1) {
        favorites.push(toolId);
    } else {
        favorites.splice(index, 1);
    }
    
    saveFavorites(favorites);
    updateFavoriteButtons();
    updateFavoritesSection();
}

function updateFavoriteButtons() {
    const favorites = getFavorites();
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    favoriteButtons.forEach(btn => {
        const toolId = btn.getAttribute('data-tool-id');
        const isFavorite = favorites.includes(toolId);
        
        if (isFavorite) {
            btn.classList.add('active');
            btn.setAttribute('aria-label', 'Remove from favorites');
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-label', 'Add to favorites');
        }
    });
}

function updateFavoritesSection() {
    const favorites = getFavorites();
    const favoritesSection = document.getElementById('favorites-section');
    const favoritesGrid = document.getElementById('favorites-grid');
    
    if (!favoritesSection || !favoritesGrid) return;
    
    if (favorites.length === 0) {
        favoritesSection.style.display = 'none';
        return;
    }
    
    favoritesSection.style.display = 'block';
    favoritesGrid.innerHTML = '';
    
    favorites.forEach(toolId => {
        const originalCard = document.querySelector(`.tool-card[data-tool-id="${toolId}"]`);
        if (originalCard) {
            const clone = originalCard.cloneNode(true);
            // Keep favorite button in cloned card for remove functionality
            const favBtn = clone.querySelector('.favorite-btn');
            if (favBtn) {
                favBtn.classList.add('active');
                favBtn.setAttribute('aria-label', 'Remove from favorites');
            }
            favoritesGrid.appendChild(clone);
        }
    });
}

function bindFavoriteButtons() {
    // Use event delegation to handle all favorite button clicks
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.favorite-btn');
        if (btn) {
            e.preventDefault();
            e.stopPropagation();
            const toolId = btn.getAttribute('data-tool-id');
            toggleFavorite(toolId);
        }
    });
}

// ==================== Statistics ====================
function updateStatistics() {
    const categories = document.querySelectorAll('.tools-category');
    const statisticsGrid = document.getElementById('statistics-grid');
    
    if (!statisticsGrid) return;
    
    statisticsGrid.innerHTML = '';
    
    let totalTools = 0;
    
    categories.forEach(category => {
        const titleElement = category.querySelector('.tools-category-title');
        const tools = category.querySelectorAll('.tool-card');
        
        if (titleElement && tools.length > 0) {
            const categoryName = titleElement.textContent;
            const toolCount = tools.length;
            totalTools += toolCount;
            
            const statCard = document.createElement('div');
            statCard.className = 'stat-card';
            statCard.innerHTML = `
                <div class="stat-count">${toolCount}</div>
                <div class="stat-category">${categoryName}</div>
            `;
            statisticsGrid.appendChild(statCard);
        }
    });
}

// Set current year
document.addEventListener('DOMContentLoaded', function() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
    bindThemeToggle();
    bindFavoriteButtons();
    updateFavoriteButtons();
    updateFavoritesSection();
    updateStatistics();
});
