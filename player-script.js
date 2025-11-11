const playerData = {
    player1: {
        name: "Althaea Liadon",
        class: "Cleric",
        password: "altlovesast",
        dndBeyondCharacterId: "141783747", 
        fallbackData: {
            race: "High Elf",
            level: 6,
            hp: { current: 51, max: 51 },
            ac: 18,
            abilities: { str: 13, dex: 15, con: 17, int: 13, wis: 19, cha: 16 },
            attacks: [
                { name: "Bloodbane", bonus: 4, damage: "1d8+1 slashing" },
                { name: "Dagger", bonus: 5, damage: "1d4+2 piercing" },
                { name: "Guiding Bolt", bonus: 7, damage: "4d6 radiant" },
                { name: "Inflict Wounds", bonus: 7, damage: "3d10" }
            ],
            proficiencies: {
                languages: ["Common", "Elvish", "Celestial", "Draconic"],
                weapons: ["Simple Weapons", "Martial Weapons"],
                tools: ["Playing Card Set"],
                armor: ["Light Armor", "Medium Armor", "Heavy Armor", "Shields"]
            }
        }
    },
    player2: {
        name: "Artyom Tonare",
        class: "Barbarian",
        password: "sentinel",
        dndBeyondCharacterId: "139724008",
        fallbackData: {
            race: "Dragonborn",
            level: 6,
            hp: { current: 84, max: 84 },
            ac: 18,
            abilities: { str: 20, dex: 18, con: 18, int: 13, wis: 10, cha: 13 },
            attacks: [
                { name: "Handaxe", bonus: 8, damage: "1d4+5 slashing" },
                { name: "Javelin of Misty Step", bonus: 9, damage: "1d6+6 piercing" },
                { name: "Maul", bonus: 8, damage: "2d6+5 bludgeoning" },
                { name: "Breath Weapon", bonus: 0, damage: "2d10 thunder" }
            ],
            proficiencies: {
                languages: ["Common", "Draconic", "Telepathy"],
                weapons: ["Martial Weapons", "Simple Weapons", "Shortsword"],
                tools: ["Dragonchess Set", "Vehicles (Land)"],
                armor: ["Light Armor", "Medium Armor", "Shields"]
            }
        }
    },
    player3: {
        name: "Kova Liadon",
        class: "Level 6 Ranger",
        password: "Swarley",
        dndBeyondCharacterId: "141783776",
        fallbackData: {
            race: "High Elf",
            level: 6,
            hp: { current: 52, max: 52 },
            ac: 14,
            abilities: { str: 15, dex: 15, con: 14, int: 12, wis: 20, cha: 13 },
            attacks: [
                { name: "Longbow", bonus: 7, damage: "1d8+2 piercing" },
                { name: "Shortsword", bonus: 5, damage: "1d6+2 piercing" },
                { name: "Unarmed Strike", bonus: 5, damage: "3 bludgeoning" }
            ],
            proficiencies: {
                languages: ["Common", "Elvish", "Celestial", "Dwarvish", "Sylvan", "Common Sign Language"],
                weapons: ["Simple Weapons", "Martial Weapons"],
                tools: ["Playing Card Set"],
                armor: ["Light Armor", "Medium Armor", "Shields"]
            }
        }
    },
    player4: {
        name: "Trevor Adrieth",
        class: "Paladin",
        password: "TrevorRocks856",
        dndBeyondCharacterId: "138489091",
        fallbackData: {
            race: "Half-Elf",
            level: 6,
            hp: { current: 52, max: 52 },
            ac: 18,
            abilities: { str: 19, dex: 15, con: 14, int: 10, wis: 10, cha: 14 },
            attacks: [
                { name: "Sun Blade", bonus: 8, damage: "1d8+7 radiant" },
                { name: "Longbow", bonus: 5, damage: "1d8+2 piercing" },
                { name: "Longsword", bonus: 7, damage: "1d8+6 slashing" },
                { name: "Handaxe", bonus: 7, damage: "1d6+6 slashing" }
            ],
            proficiencies: {
                languages: ["Common", "Elvish", "Dwarvish"],
                weapons: ["Simple Weapons", "Martial Weapons", "Longsword"],
                tools: ["Playing Card Set", "Vehicles (Land)"],
                armor: ["Light Armor", "Medium Armor", "Heavy Armor", "Shields"]
            }
        }
    }
};
// Current logged-in player
let currentPlayer = null;
let characterData = null;
let currentNoteCategory = null;

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

    // Initialize dice roller
    initializeDiceRoller();
    
    // Initialize meteor shower on navigation
    initializeMeteorTransitions();
    
    // Load user theme
    loadUserTheme();
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

async function showDashboard() {
    const player = playerData[currentPlayer];
    
    // Hide login, show dashboard
    loginSection.style.display = 'none';
    playerDashboard.classList.add('active');
    
    // Update player info
    document.getElementById('playerName').textContent = `Welcome, ${player.name}`;
    document.getElementById('playerClass').textContent = player.class;
    
    // Set D&D Beyond link
    const dndBeyondUrl = `https://www.dndbeyond.com/characters/${player.dndBeyondCharacterId}`;
    document.getElementById('dndBeyondLink').href = dndBeyondUrl;
    
    // Load character data
    await loadCharacterData();
    
    // Initialize theme selector
    initializeThemeSelector();
    
    // Initialize note managers
    initializeNoteManagers();
    
    // Populate party list
    populatePartyList();
}

async function loadCharacterData() {
    const player = playerData[currentPlayer];
    characterData = player.fallbackData;
    displayCharacterSheet(characterData);
}

function displayCharacterSheet(data) {
    // Basic Info
    document.getElementById('charName').textContent = playerData[currentPlayer].name;
    document.getElementById('charRace').textContent = data.race || '-';
    document.getElementById('charClass').textContent = playerData[currentPlayer].class;
    document.getElementById('charLevel').textContent = data.level || '-';
    document.getElementById('charBackground').textContent = data.background || '-';
    
    // HP & AC
    document.getElementById('currentHP').textContent = data.hp.current;
    document.getElementById('maxHP').textContent = data.hp.max;
    document.getElementById('armorClass').textContent = data.ac;
    
    // Ability Scores
    const abilities = data.abilities;
    Object.keys(abilities).forEach(ability => {
        const score = abilities[ability];
        const modifier = Math.floor((score - 10) / 2);
        const modText = modifier >= 0 ? `+${modifier}` : modifier;
        
        document.getElementById(`${ability}Score`).textContent = score;
        document.getElementById(`${ability}Mod`).textContent = modText;
    });
    
    // Attacks
    const attacksList = document.getElementById('attacksList');
    attacksList.innerHTML = '';
    data.attacks.forEach(attack => {
        const attackDiv = document.createElement('div');
        attackDiv.className = 'attack-item';
        attackDiv.innerHTML = `
            <div class="attack-name">${attack.name}</div>
            <div class="attack-bonus">+${attack.bonus} to hit</div>
            <div class="attack-damage">${attack.damage}</div>
        `;
        attacksList.appendChild(attackDiv);
    });
    
    // Proficiencies
    const profList = document.getElementById('proficienciesList');
    profList.innerHTML = '';
    
    const proficiencies = data.proficiencies;
    Object.keys(proficiencies).forEach(type => {
        if (proficiencies[type].length > 0) {
            const profDiv = document.createElement('div');
            profDiv.className = 'prof-category';
            profDiv.innerHTML = `
                <div class="prof-type">${type.charAt(0).toUpperCase() + type.slice(1)}:</div>
                <div class="prof-items">${proficiencies[type].join(', ')}</div>
            `;
            profList.appendChild(profDiv);
        }
    });
}

// Meteor Shower Transition
function initializeMeteorTransitions() {
    // Add transition overlay
    const transitionDiv = document.createElement('div');
    transitionDiv.className = 'page-transition';
    transitionDiv.id = 'pageTransition';
    document.body.appendChild(transitionDiv);
    
    // Intercept navigation links
    document.querySelectorAll('a[href]').forEach(link => {
        // Skip external links and anchors
        if (link.href.startsWith(window.location.origin) && !link.href.includes('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetUrl = this.href;
                triggerMeteorShower(() => {
                    window.location.href = targetUrl;
                });
            });
        }
    });
}

function triggerMeteorShower(callback) {
    const transition = document.getElementById('pageTransition');
    transition.classList.add('active');
    
    // Create 20 meteors
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createMeteor();
        }, i * 50);
    }
    
    // Navigate after meteors
    setTimeout(() => {
        if (callback) callback();
    }, 1500);
}

function createMeteor() {
    const meteor = document.createElement('div');
    meteor.className = 'meteor';
    
    // Random starting position
    meteor.style.top = `${Math.random() * 50}%`;
    meteor.style.left = `${Math.random() * 100}%`;
    
    document.getElementById('pageTransition').appendChild(meteor);
    
    // Remove after animation
    setTimeout(() => {
        meteor.remove();
    }, 1500);
}

// Theme Customization
function initializeThemeSelector() {
    // Create theme selector if it doesn't exist
    const dashboard = document.getElementById('playerDashboard');
    if (!document.getElementById('themeSelector')) {
        const themeSection = document.createElement('div');
        themeSection.className = 'dashboard-section theme-selector';
        themeSection.id = 'themeSelector';
        themeSection.innerHTML = `
            <h4>🎨 Customize Your Theme</h4>
            <div class="theme-options">
                <button class="theme-btn" data-theme="default">Gold</button>
                <button class="theme-btn" data-theme="crimson">Crimson</button>
                <button class="theme-btn" data-theme="emerald">Emerald</button>
                <button class="theme-btn" data-theme="sapphire">Sapphire</button>
                <button class="theme-btn" data-theme="amethyst">Amethyst</button>
                <button class="theme-btn" data-theme="silver">Silver</button>
                <button class="theme-btn" data-theme="amber">Amber</button>
                <button class="theme-btn" data-theme="rose">Rose</button>
            </div>
        `;
        
        // Insert after dashboard header
        const header = document.querySelector('.dashboard-header');
        header.after(themeSection);
    }
    
    // Add event listeners
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            changeTheme(this.dataset.theme);
        });
    });
    
    // Load saved theme
    loadUserTheme();
}

function changeTheme(themeName) {
    document.body.setAttribute('data-theme', themeName);
    
    // Update active button
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.theme-btn[data-theme="${themeName}"]`).classList.add('active');
    
    // Save preference
    if (currentPlayer) {
        localStorage.setItem(`${currentPlayer}_theme`, themeName);
    }
}

function loadUserTheme() {
    if (currentPlayer) {
        const savedTheme = localStorage.getItem(`${currentPlayer}_theme`) || 'default';
        changeTheme(savedTheme);
    }
}

// Advanced Note Organization
function initializeNoteManagers() {
    const noteCategories = ['sessionNotes', 'inventoryNotes', 'relationshipNotes', 'theoriesNotes'];
    
    noteCategories.forEach(category => {
        setupNoteManager(category);
    });
}

function setupNoteManager(category) {
    const section = document.querySelector(`#${category}`).closest('.dashboard-section');
    
    // Create note manager UI
    const manager = document.createElement('div');
    manager.className = 'notes-manager';
    manager.innerHTML = `
        <div class="new-note-form">
            <input type="text" placeholder="Note title..." class="note-title-input" data-category="${category}">
            <button class="save-button new-note-btn" data-category="${category}">➕ Create New Note</button>
        </div>
        <div class="saved-notes-list" id="${category}-list"></div>
        <div class="note-editor" id="${category}-editor">
            <div class="note-editor-header">
                <span class="note-editor-title"></span>
                <button class="close-editor-btn">✕ Close</button>
            </div>
            <textarea class="notes-area" id="${category}-editor-text"></textarea>
            <button class="save-button save-edit-btn" data-category="${category}">💾 Save Changes</button>
        </div>
    `;
    
    const oldTextarea = document.getElementById(category);
    const oldButton = document.querySelector(`#save${category.charAt(0).toUpperCase() + category.slice(1, -5)}Btn`);
    if (oldTextarea) oldTextarea.remove();
    if (oldButton) oldButton.remove();
    
    section.appendChild(manager);
    
    // Load existing notes
    loadNotesList(category);
    
    // Event listeners
    manager.querySelector('.new-note-btn').addEventListener('click', () => createNewNote(category));
    manager.querySelector('.save-edit-btn').addEventListener('click', () => saveEditedNote(category));
    manager.querySelector('.close-editor-btn').addEventListener('click', () => closeNoteEditor(category));
}

function createNewNote(category) {
    const titleInput = document.querySelector(`.note-title-input[data-category="${category}"]`);
    const title = titleInput.value.trim();
    
    if (!title) {
        alert('Please enter a note title');
        return;
    }
    
    const noteId = Date.now();
    const note = {
        id: noteId,
        title: title,
        content: '',
        date: new Date().toLocaleDateString(),
        category: category
    };
    
    saveNote(note);
    titleInput.value = '';
    loadNotesList(category);
    editNote(category, noteId);
}

function saveNote(note) {
    const storageKey = `${currentPlayer}_notes_${note.category}`;
    let notes = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const existingIndex = notes.findIndex(n => n.id === note.id);
    if (existingIndex >= 0) {
        notes[existingIndex] = note;
    } else {
        notes.push(note);
    }
    
    localStorage.setItem(storageKey, JSON.stringify(notes));
}

function loadNotesList(category) {
    const storageKey = `${currentPlayer}_notes_${category}`;
    const notes = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const listContainer = document.getElementById(`${category}-list`);
    
    listContainer.innerHTML = '';
    
    notes.reverse().forEach(note => {
        const noteItem = document.createElement('div');
        noteItem.className = 'saved-note-item';
        noteItem.innerHTML = `
            <div class="saved-note-header">
                <div class="saved-note-title">${note.title}</div>
                <div class="saved-note-date">${note.date}</div>
            </div>
            <div class="saved-note-preview">${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</div>
            <div class="saved-note-actions">
                <button class="note-action-btn" onclick="editNote('${category}', ${note.id})">✏️ Edit</button>
                <button class="note-action-btn delete" onclick="deleteNote('${category}', ${note.id})">🗑️ Delete</button>
            </div>
        `;
        listContainer.appendChild(noteItem);
    });
}

function editNote(category, noteId) {
    const storageKey = `${currentPlayer}_notes_${category}`;
    const notes = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const note = notes.find(n => n.id === noteId);
    
    if (note) {
        const editor = document.getElementById(`${category}-editor`);
        const editorText = document.getElementById(`${category}-editor-text`);
        const editorTitle = editor.querySelector('.note-editor-title');
        
        editorTitle.textContent = note.title;
        editorText.value = note.content;
        editor.classList.add('active');
        editor.dataset.noteId = noteId;
        
        // Hide list
        document.getElementById(`${category}-list`).style.display = 'none';
        document.querySelector(`.new-note-form`).style.display = 'none';
    }
}

function saveEditedNote(category) {
    const editor = document.getElementById(`${category}-editor`);
    const noteId = parseInt(editor.dataset.noteId);
    const content = document.getElementById(`${category}-editor-text`).value;
    
    const storageKey = `${currentPlayer}_notes_${category}`;
    let notes = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const note = notes.find(n => n.id === noteId);
    
    if (note) {
        note.content = content;
        note.date = new Date().toLocaleDateString();
        localStorage.setItem(storageKey, JSON.stringify(notes));
        
        // Show success feedback
        const saveBtn = editor.querySelector('.save-edit-btn');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = '✓ Saved!';
        saveBtn.style.background = 'rgba(74, 222, 128, 0.2)';
        
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.background = '';
        }, 2000);
        
        loadNotesList(category);
    }
}

function closeNoteEditor(category) {
    const editor = document.getElementById(`${category}-editor`);
    editor.classList.remove('active');
    
    // Show list again
    document.getElementById(`${category}-list`).style.display = 'flex';
    document.querySelector('.new-note-form').style.display = 'flex';
}

function deleteNote(category, noteId) {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    const storageKey = `${currentPlayer}_notes_${category}`;
    let notes = JSON.parse(localStorage.getItem(storageKey) || '[]');
    notes = notes.filter(n => n.id !== noteId);
    localStorage.setItem(storageKey, JSON.stringify(notes));
    
    loadNotesList(category);
}

// Make functions globally available
window.editNote = editNote;
window.deleteNote = deleteNote;

// Dice Roller Functions
function initializeDiceRoller() {
    const diceBtns = document.querySelectorAll('.dice-btn');
    diceBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            rollDice(this.dataset.dice);
        });
    });
}

function rollDice(diceType) {
    const count = parseInt(document.getElementById('diceCount').value) || 1;
    const modifier = parseInt(document.getElementById('diceModifier').value) || 0;
    
    const diceSides = parseInt(diceType.substring(1));
    let rolls = [];
    let total = 0;
    
    for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * diceSides) + 1;
        rolls.push(roll);
        total += roll;
    }
    
    const finalTotal = total + modifier;
    
    animateDiceRoll(finalTotal);
    
    const breakdown = `${count}${diceType}: [${rolls.join(', ')}]${modifier !== 0 ? ` ${modifier >= 0 ? '+' : ''}${modifier}` : ''}`;
    document.getElementById('resultBreakdown').textContent = breakdown;
    
    addToHistory(diceType, count, modifier, finalTotal, rolls);
    
    const resultDisplay = document.getElementById('diceResultDisplay');
    resultDisplay.classList.add('roll-animation');
    setTimeout(() => {
        resultDisplay.classList.remove('roll-animation');
    }, 600);
}

function animateDiceRoll(finalResult) {
    const resultValue = document.getElementById('resultValue');
    let counter = 0;
    const duration = 500;
    const steps = 20;
    const increment = finalResult / steps;
    
    const animation = setInterval(() => {
        counter += increment;
        if (counter >= finalResult) {
            resultValue.textContent = finalResult;
            clearInterval(animation);
        } else {
            resultValue.textContent = Math.floor(counter);
        }
    }, duration / steps);
}

function addToHistory(diceType, count, modifier, result, rolls) {
    const historyList = document.getElementById('historyList');
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const rollText = `${count}${diceType}${modifier !== 0 ? (modifier >= 0 ? '+' : '') + modifier : ''}`;
    
    historyItem.innerHTML = `
        <span class="history-roll">${rollText}</span>
        <span class="history-result">${result}</span>
    `;
    
    const diceSides = parseInt(diceType.substring(1));
    if (diceType === 'd20') {
        if (rolls.includes(20)) {
            historyItem.classList.add('crit-success');
        } else if (rolls.includes(1)) {
            historyItem.classList.add('crit-fail');
        }
    }
    
    historyList.insertBefore(historyItem, historyList.firstChild);
    
    while (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
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

// Save before leaving
window.addEventListener('beforeunload', function(e) {
});


