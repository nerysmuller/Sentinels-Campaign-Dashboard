// Player data configuration
const playerData = {
    player1: {
        name: "Character Name 1",
        class: "Class & Level",
        password: "sentinel",
        sheetUrl: "https://www.dndbeyond.com/characters/YOUR_CHARACTER_ID"
    },
    player2: {
        name: "Character Name 2",
        class: "Class & Level",
        password: "sentinel",
        sheetUrl: "https://www.dndbeyond.com/characters/YOUR_CHARACTER_ID"
    },
    player3: {
        name: "Character Name 3",
        class: "Class & Level",
        password: "sentinel",
        sheetUrl: "https://www.dndbeyond.com/characters/YOUR_CHARACTER_ID"
    },
    player4: {
        name: "Character Name 4",
        class: "Class & Level",
        password: "sentinel",
        sheetUrl: "https://www.dndbeyond.com/characters/YOUR_CHARACTER_ID"
    },
    player5: {
        name: "Character Name 5",
        class: "Class & Level",
        password: "sentinel",
        sheetUrl: "https://www.dndbeyond.com/characters/YOUR_CHARACTER_ID"
    }
};

// Current logged-in player
let currentPlayer = null;

// DOM Elements
const loginSection = document.getElementById('loginSection');
const playerDashboard = document.getElementById('playerDashboard');
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const logoutBtn = document.getElementById('logoutBtn');

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const savedPlayer = sessionStorage.getItem('currentPlayer');
    if (savedPlayer && playerData[savedPlayer]) {
        currentPlayer = savedPlayer;
        showDashboard();
    }

    // Login form handler
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });

    // Logout handler
    logoutBtn.addEventListener('click', handleLogout);

    // Auto-save notes handlers
    setupNoteSaving('sessionNotes', 'saveNotesBtn');
    setupNoteSaving('inventoryNotes', 'saveInventoryBtn');
    setupNoteSaving('relationshipNotes', 'saveRelationshipsBtn');
    setupNoteSaving('theoriesNotes', 'saveTheoriesBtn');
});

function handleLogin() {
    const selectedPlayer = document.getElementById('playerSelect').value;
    const enteredPassword = document.getElementById('password').value;

    if (!selectedPlayer) {
        showError('Please select a character.');
        return;
    }

    const player = playerData[selectedPlayer];
    
    if (enteredPassword === player.password) {
        currentPlayer = selectedPlayer;
        sessionStorage.setItem('currentPlayer', selectedPlayer);
        showDashboard();
        hideError();
    } else {
        showError('Incorrect password. Please try again.');
    }
}

function handleLogout() {
    currentPlayer = null;
    sessionStorage.removeItem('currentPlayer');
    loginSection.style.display = 'block';
    playerDashboard.classList.remove('active');
    document.getElementById('password').value = '';
    hideError();
}

function showDashboard() {
    const player = playerData[currentPlayer];
    
    // Hide login, show dashboard
    loginSection.style.display = 'none';
    playerDashboard.classList.add('active');
    
    // Update player info
    document.getElementById('playerName').textContent = `Welcome, ${player.name}`;
    document.getElementById('playerClass').textContent = player.class;
    document.getElementById('characterSheetLink').href = player.sheetUrl;
    
    // Load saved notes
    loadNotes();
    
    // Populate party list
    populatePartyList();
}

function setupNoteSaving(textareaId, buttonId) {
    const textarea = document.getElementById(textareaId);
    const button = document.getElementById(buttonId);
    
    if (textarea && button) {
        button.addEventListener('click', function() {
            saveNotes(textareaId);
            showSaveStatus(button);
        });
    }
}

function saveNotes(textareaId) {
    if (!currentPlayer) return;
    
    const textarea = document.getElementById(textareaId);
    const content = textarea.value;
    const storageKey = `${currentPlayer}_${textareaId}`;
    
    localStorage.setItem(storageKey, content);
}

function loadNotes() {
    if (!currentPlayer) return;
    
    const textareas = ['sessionNotes', 'inventoryNotes', 'relationshipNotes', 'theoriesNotes'];
    
    textareas.forEach(textareaId => {
        const textarea = document.getElementById(textareaId);
        const storageKey = `${currentPlayer}_${textareaId}`;
        const savedContent = localStorage.getItem(storageKey);
        
        if (savedContent && textarea) {
            textarea.value = savedContent;
        }
    });
}

function showSaveStatus(button) {
    const originalText = button.textContent;
    button.textContent = '✓ Saved!';
    button.style.background = 'rgba(74, 222, 128, 0.2)';
    button.style.borderColor = '#4ade80';
    button.style.color = '#4ade80';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
        button.style.borderColor = '';
        button.style.color = '';
    }, 2000);
}

function populatePartyList() {
    const partyList = document.getElementById('partyList');
    partyList.innerHTML = '';
    
    Object.keys(playerData).forEach(playerId => {
        if (playerId !== currentPlayer) {
            const player = playerData[playerId];
            const partyMember = document.createElement('div');
            partyMember.style.cssText = `
                padding: 10px;
                background: rgba(10,10,15,0.6);
                border-left: 3px solid var(--accent-gold);
                border-radius: 4px;
            `;
            partyMember.innerHTML = `
                <strong style="color: var(--accent-gold);">${player.name}</strong><br>
                <span style="color: var(--text-dim); font-size: 0.9rem;">${player.class}</span>
            `;
            partyList.appendChild(partyMember);
        }
    });
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
}

// Auto-save every 30 seconds
setInterval(() => {
    if (currentPlayer) {
        ['sessionNotes', 'inventoryNotes', 'relationshipNotes', 'theoriesNotes'].forEach(saveNotes);
    }
}, 30000);

// Warn before leaving if there are unsaved changes
window.addEventListener('beforeunload', function(e) {
    if (currentPlayer) {
        // Save everything one last time
        ['sessionNotes', 'inventoryNotes', 'relationshipNotes', 'theoriesNotes'].forEach(saveNotes);
    }
});
