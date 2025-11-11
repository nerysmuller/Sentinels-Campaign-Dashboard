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

    // Initialize dice roller
    initializeDiceRoller();
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
    
    // Load saved notes
    loadNotes();
    
    // Populate party list
    populatePartyList();
}

async function loadCharacterData() {
    const player = playerData[currentPlayer];
    
    // Try to fetch from D&D Beyond (this is a placeholder - actual implementation would need CORS proxy)
    // For now, we'll use fallback data
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
    
    // Roll the dice
    for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * diceSides) + 1;
        rolls.push(roll);
        total += roll;
    }
    
    const finalTotal = total + modifier;
    
    // Animate the result
    animateDiceRoll(finalTotal);
    
    // Display breakdown
    const breakdown = `${count}${diceType}: [${rolls.join(', ')}]${modifier !== 0 ? ` ${modifier >= 0 ? '+' : ''}${modifier}` : ''}`;
    document.getElementById('resultBreakdown').textContent = breakdown;
    
    // Add to history
    addToHistory(diceType, count, modifier, finalTotal, rolls);
    
    // Play sound effect (visual feedback)
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
    
    // Add critical styling
    const diceSides = parseInt(diceType.substring(1));
    if (diceType === 'd20') {
        if (rolls.includes(20)) {
            historyItem.classList.add('crit-success');
        } else if (rolls.includes(1)) {
            historyItem.classList.add('crit-fail');
        }
    }
    
    historyList.insertBefore(historyItem, historyList.firstChild);
    
    // Keep only last 10 rolls
    while (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
}

// Note Saving Functions
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

// Save before leaving
window.addEventListener('beforeunload', function(e) {
    if (currentPlayer) {
        ['sessionNotes', 'inventoryNotes', 'relationshipNotes', 'theoriesNotes'].forEach(saveNotes);
    }
});
