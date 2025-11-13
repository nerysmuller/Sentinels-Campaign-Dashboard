// Player data configuration
const playerData = {
    player1: {
        name: "Althaea Liadon",
        class: "Druid 7",
        password: "sentinel",
        dndBeyondCharacterId: "123456789",
        fallbackData: {
            race: "Half-Elf",
            level: 7,
            background: "Sage",
            hp: { current: 51, max: 51 },
            ac: 18,
            abilities: { str: 13, dex: 15, con: 13, int: 10, wis: 19, cha: 16 },
            attacks: [
                { name: "Handflame", bonus: 7, damage: "1d10+4 fire" },
                { name: "Inflict Wounds", bonus: 7, damage: "3d10 necrotic" },
                { name: "Guiding Bolt", bonus: 7, damage: "4d6 radiant" },
                { name: "Fallen Wounds", bonus: 0, damage: "1d8+0 psychic" }
            ],
            proficiencies: {
                languages: ["Common", "Elvish", "Celestial", "Draconic"],
                weapons: ["Simple Weapons", "Martial Weapons"],
                tools: ["Playing Card Set"],
                armor: ["Light Armor", "Medium Armor", "Shields"]
            }
        }
    },
    player2: {
        name: "Artyom Tonare",
        class: "Cleric 7",
        password: "sentinel",
        dndBeyondCharacterId: "123456790",
        fallbackData: {
            race: "Tiefling",
            level: 7,
            background: "Acolyte",
            hp: { current: 46, max: 46 },
            ac: 18,
            abilities: { str: 12, dex: 16, con: 13, int: 10, wis: 18, cha: 14 },
            attacks: [
                { name: "Guiding Bolt", bonus: 7, damage: "4d6 radiant" },
                { name: "Sacred Flame", bonus: 7, damage: "2d8 radiant" },
                { name: "Rapier", bonus: 4, damage: "1d8+3 piercing" }
            ],
            proficiencies: {
                languages: ["Common", "Infernal", "Celestial"],
                weapons: ["Simple Weapons", "Rapier"],
                tools: ["None"],
                armor: ["Light Armor", "Medium Armor", "Heavy Armor", "Shields"]
            }
        }
    },
    player3: {
        name: "Kova Liadon",
        class: "Ranger 7",
        password: "sentinel",
        dndBeyondCharacterId: "123456791",
        fallbackData: {
            race: "Half-Elf",
            level: 7,
            background: "Outlander",
            hp: { current: 56, max: 56 },
            ac: 17,
            abilities: { str: 16, dex: 18, con: 14, int: 10, wis: 15, cha: 12 },
            attacks: [
                { name: "Longbow", bonus: 7, damage: "1d8+4 piercing" },
                { name: "Longsword", bonus: 6, damage: "1d8+3 slashing" },
                { name: "Hunter's Mark", bonus: 7, damage: "+1d6" }
            ],
            proficiencies: {
                languages: ["Common", "Elvish", "Sylvan"],
                weapons: ["Simple Weapons", "Martial Weapons"],
                tools: ["None"],
                armor: ["Light Armor", "Medium Armor", "Shields"]
            }
        }
    },
    player4: {
        name: "Trevor Adrieth",
        class: "Rogue 7",
        password: "sentinel",
        dndBeyondCharacterId: "123456792",
        fallbackData: {
            race: "Human",
            level: 7,
            background: "Criminal",
            hp: { current: 45, max: 45 },
            ac: 16,
            abilities: { str: 10, dex: 20, con: 12, int: 14, wis: 13, cha: 10 },
            attacks: [
                { name: "Rapier", bonus: 8, damage: "1d8+5 piercing" },
                { name: "Shortbow", bonus: 8, damage: "1d6+5 piercing" },
                { name: "Sneak Attack", bonus: 0, damage: "+4d6" }
            ],
            proficiencies: {
                languages: ["Common", "Thieves' Cant"],
                weapons: ["Simple Weapons", "Hand Crossbows", "Longswords", "Rapiers", "Shortswords"],
                tools: ["Thieves' Tools", "Disguise Kit"],
                armor: ["Light Armor"]
            }
        }
    }
};

let currentPlayer = null;
let characterData = null;

// DOM Elements
const loginSection = document.getElementById('loginSection');
const playerDashboard = document.getElementById('playerDashboard');
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const logoutBtn = document.getElementById('logoutBtn');

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedPlayer = sessionStorage.getItem('currentPlayer');
    if (savedPlayer && playerData[savedPlayer]) {
        currentPlayer = savedPlayer;
        showDashboard();
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });

    logoutBtn.addEventListener('click', handleLogout);

    initializeDiceRoller();
    initializeMeteorTransitions();
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
    
    loginSection.style.display = 'none';
    playerDashboard.classList.add('active');
    
    document.getElementById('playerName').textContent = `Welcome, ${player.name}`;
    document.getElementById('playerClass').textContent = player.class;
    
    const dndBeyondUrl = `https://www.dndbeyond.com/characters/${player.dndBeyondCharacterId}`;
    document.getElementById('dndBeyondLink').href = dndBeyondUrl;
    
    await loadCharacterData();
    initializeThemeSelector();
    initializeNoteManagers();
    populatePartyList();
}

async function loadCharacterData() {
    const player = playerData[currentPlayer];
    characterData = player.fallbackData;
    displayCharacterSheet(characterData);
}

function displayCharacterSheet(data) {
    document.getElementById('charName').textContent = playerData[currentPlayer].name;
    document.getElementById('charRace').textContent = data.race || '-';
    document.getElementById('charClass').textContent = playerData[currentPlayer].class;
    document.getElementById('charLevel').textContent = data.level || '-';
    document.getElementById('charBackground').textContent = data.background || '-';
    
    document.getElementById('currentHP').textContent = data.hp.current;
    document.getElementById('maxHP').textContent = data.hp.max;
    document.getElementById('armorClass').textContent = data.ac;
    
    const abilities = data.abilities;
    Object.keys(abilities).forEach(ability => {
        const score = abilities[ability];
        const modifier = Math.floor((score - 10) / 2);
        const modText = modifier >= 0 ? `+${modifier}` : modifier;
        
        document.getElementById(`${ability}Score`).textContent = score;
        document.getElementById(`${ability}Mod`).textContent = modText;
    });
    
    const attacksList = document.getElementById('attacksList');
    attacksList.innerHTML = '';
    data.attacks.forEach(attack => {
        const attackDiv = document.createElement('div');
        attackDiv.className = 'attack-item';
        attackDiv.innerHTML = `
            <div class="attack-name">${attack.name}</div>
            <div class="attack-bonus">${attack.bonus > 0 ? '+' : ''}${attack.bonus} to hit</div>
            <div class="attack-damage">${attack.damage}</div>
        `;
        attacksList.appendChild(attackDiv);
    });
    
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
    document.querySelectorAll('a[href]').forEach(link => {
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
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createMeteor();
        }, i * 50);
    }
    
    setTimeout(() => {
        if (callback) callback();
    }, 1500);
}

function createMeteor() {
    const meteor = document.createElement('div');
    meteor.className = 'meteor';
    
    meteor.style.top = `${Math.random() * 50}%`;
    meteor.style.left = `${Math.random() * 100}%`;
    
    document.getElementById('pageTransition').appendChild(meteor);
    
    setTimeout(() => {
        meteor.remove();
    }, 1500);
}

// Theme Customization
function initializeThemeSelector() {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            changeTheme(this.dataset.theme);
        });
    });
    
    loadUserTheme();
}

function changeTheme(themeName) {
    document.body.setAttribute('data-theme', themeName);
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.theme-btn[data-theme="${themeName}"]`).classList.add('active');
    
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
    const noteCategories = [
        { id: 'sessionNotes', title: 'Session Notes' },
        { id: 'inventoryNotes', title: 'Important Items' },
        { id: 'relationshipNotes', title: 'Relationships' },
        { id: 'theoriesNotes', title: 'Theories & Mysteries' }
    ];
    
    noteCategories.forEach(category => {
        setupNoteManager(category.id, category.title);
    });
}

function setupNoteManager(categoryId, categoryTitle) {
    const section = document.getElementById(`${categoryId}Section`);
    
    const manager = document.createElement('div');
    manager.className = 'notes-manager';
    manager.innerHTML = `
        <div class="new-note-form">
            <input type="text" placeholder="Note title..." class="note-title-input" data-category="${categoryId}">
            <button class="save-button new-note-btn" data-category="${categoryId}">Create New Note</button>
        </div>
        <div class="saved-notes-list" id="${categoryId}-list"></div>
        <div class="note-editor" id="${categoryId}-editor">
            <div class="note-editor-header">
                <span class="note-editor-title"></span>
                <button class="close-editor-btn">Close</button>
            </div>
            <textarea class="notes-area" id="${categoryId}-editor-text"></textarea>
            <button class="save-button save-edit-btn" data-category="${categoryId}">Save Changes</button>
        </div>
    `;
    
    section.appendChild(manager);
    
    loadNotesList(categoryId);
    
    manager.querySelector('.new-note-btn').addEventListener('click', () => createNewNote(categoryId));
    manager.querySelector('.save-edit-btn').addEventListener('click', () => saveEditedNote(categoryId));
    manager.querySelector('.close-editor-btn').addEventListener('click', () => closeNoteEditor(categoryId));
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
                <button class="note-action-btn" onclick="window.editNote('${category}', ${note.id})">Edit</button>
                <button class="note-action-btn delete" onclick="window.deleteNote('${category}', ${note.id})">Delete</button>
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
        
        const saveBtn = editor.querySelector('.save-edit-btn');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Saved!';
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

// Celestial Star Chart Page Transition
function triggerMeteorShower(callback) {
    const transition = document.getElementById('pageTransition');
    if (!transition) return callback();
    
    transition.classList.add('active');
    
    // Create constellation pattern
    createCelestialConstellation();
    
    setTimeout(() => {
        if (callback) callback();
    }, 1500);
}

function createCelestialConstellation() {
    const transition = document.getElementById('pageTransition');
    if (!transition) return;
    
    // Define star positions for constellation pattern
    const stars = [
        { x: 20, y: 20 },
        { x: 35, y: 15 },
        { x: 50, y: 25 },
        { x: 65, y: 20 },
        { x: 80, y: 30 },
        { x: 30, y: 50 },
        { x: 45, y: 55 },
        { x: 60, y: 48 },
        { x: 75, y: 60 }
    ];
    
    // Create stars
    stars.forEach((pos, index) => {
        setTimeout(() => {
            const star = document.createElement('div');
            star.className = 'celestial-star';
            star.style.left = `${pos.x}%`;
            star.style.top = `${pos.y}%`;
            transition.appendChild(star);
            
            // Remove after animation
            setTimeout(() => star.remove(), 1500);
        }, index * 80);
    });
    
    // Draw constellation lines connecting stars
    setTimeout(() => {
        for (let i = 0; i < stars.length - 1; i++) {
            setTimeout(() => {
                const line = document.createElement('div');
                line.className = 'constellation-line';
                
                const x1 = stars[i].x;
                const y1 = stars[i].y;
                const x2 = stars[i + 1].x;
                const y2 = stars[i + 1].y;
                
                const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
                
                line.style.left = `${x1}%`;
                line.style.top = `${y1}%`;
                line.style.width = `${length}%`;
                line.style.transform = `rotate(${angle}deg)`;
                
                transition.appendChild(line);
                
                setTimeout(() => line.remove(), 1200);
            }, i * 100);
        }
    }, 400);
}
