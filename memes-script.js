// Meme Management System
class MemeManager {
    constructor() {
        this.sessionMemes = this.loadData('sessionMemes') || [];
        this.characterMemes = this.loadData('characterMemes') || {};
        this.burnBook = this.loadData('burnBook') || [];
        this.npcs = this.loadData('npcs') || { fame: [], shame: [], deceased: [], question: [] };
        this.quotes = this.loadData('quotes') || [];
        this.diceJail = this.loadData('diceJail') || [];
        
        this.init();
    }

    loadData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error loading data:', e);
            return null;
        }
    }

    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving data:', e);
            alert('Storage limit reached! Consider deleting some old memes.');
        }
    }

    init() {
        this.setupUploadAreas();
        this.setupSessionMemes();
        this.setupCharacterMemes();
        this.setupBurnBook();
        this.setupNPCs();
        this.setupQuotes();
        this.setupDiceJail();
        this.renderAll();
    }

    setupUploadAreas() {
        // Session Memes Upload
        const sessionArea = document.getElementById('sessionUploadArea');
        const sessionInput = document.getElementById('sessionMemeInput');
        
        sessionArea.addEventListener('click', () => sessionInput.click());
        sessionArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            sessionArea.classList.add('dragover');
        });
        sessionArea.addEventListener('dragleave', () => {
            sessionArea.classList.remove('dragover');
        });
        sessionArea.addEventListener('drop', (e) => {
            e.preventDefault();
            sessionArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleImageUpload(files[0], sessionInput);
            }
        });

        // Character Memes Upload
        const characterArea = document.getElementById('characterUploadArea');
        const characterInput = document.getElementById('characterMemeInput');
        
        characterArea.addEventListener('click', () => characterInput.click());
        characterArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            characterArea.classList.add('dragover');
        });
        characterArea.addEventListener('dragleave', () => {
            characterArea.classList.remove('dragover');
        });
        characterArea.addEventListener('drop', (e) => {
            e.preventDefault();
            characterArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleImageUpload(files[0], characterInput);
            }
        });

        // Burn Book Upload
        const burnBookArea = document.getElementById('burnBookUploadArea');
        const burnBookInput = document.getElementById('burnBookInput');
        
        burnBookArea.addEventListener('click', () => burnBookInput.click());
        burnBookArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            burnBookArea.classList.add('dragover');
        });
        burnBookArea.addEventListener('dragleave', () => {
            burnBookArea.classList.remove('dragover');
        });
        burnBookArea.addEventListener('drop', (e) => {
            e.preventDefault();
            burnBookArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleImageUpload(files[0], burnBookInput);
            }
        });
    }

    handleImageUpload(file, inputElement) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                inputElement.files = file;
                inputElement.dataset.imageData = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    setupSessionMemes() {
        document.getElementById('uploadSessionMeme').addEventListener('click', () => {
            const input = document.getElementById('sessionMemeInput');
            const caption = document.getElementById('sessionCaption').value;
            const sessionNum = document.getElementById('sessionNumber').value;

            if (!input.files[0]) {
                alert('Please select an image!');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const meme = {
                    id: Date.now(),
                    image: e.target.result,
                    caption: caption,
                    session: sessionNum || 'General',
                    date: new Date().toLocaleDateString()
                };

                this.sessionMemes.push(meme);
                this.saveData('sessionMemes', this.sessionMemes);
                this.renderSessionMemes();

                // Clear inputs
                input.value = '';
                document.getElementById('sessionCaption').value = '';
                document.getElementById('sessionNumber').value = '';
            };
            reader.readAsDataURL(input.files[0]);
        });
    }

    setupCharacterMemes() {
        document.getElementById('uploadCharacterMeme').addEventListener('click', () => {
            const input = document.getElementById('characterMemeInput');
            const caption = document.getElementById('characterCaption').value;
            const character = document.getElementById('characterSelect').value;

            if (!character) {
                alert('Please select a character!');
                return;
            }

            if (!input.files[0]) {
                alert('Please select an image!');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                if (!this.characterMemes[character]) {
                    this.characterMemes[character] = [];
                }

                const meme = {
                    id: Date.now(),
                    image: e.target.result,
                    caption: caption,
                    date: new Date().toLocaleDateString()
                };

                this.characterMemes[character].push(meme);
                this.saveData('characterMemes', this.characterMemes);
                this.renderCharacterMemes();

                // Clear inputs
                input.value = '';
                document.getElementById('characterCaption').value = '';
            };
            reader.readAsDataURL(input.files[0]);
        });
    }

    setupBurnBook() {
        document.getElementById('uploadBurnBook').addEventListener('click', () => {
            const input = document.getElementById('burnBookInput');
            const caption = document.getElementById('burnBookCaption').value;

            if (!input.files[0]) {
                alert('Please select an image!');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const meme = {
                    id: Date.now(),
                    image: e.target.result,
                    caption: caption,
                    date: new Date().toLocaleDateString()
                };

                this.burnBook.push(meme);
                this.saveData('burnBook', this.burnBook);
                this.renderBurnBook();

                // Clear inputs
                input.value = '';
                document.getElementById('burnBookCaption').value = '';
            };
            reader.readAsDataURL(input.files[0]);
        });
    }

    setupNPCs() {
        document.getElementById('addNPC').addEventListener('click', () => {
            const name = document.getElementById('npcName').value.trim();
            const status = document.getElementById('npcStatus').value;

            if (!name) {
                alert('Please enter an NPC name!');
                return;
            }

            const npc = {
                id: Date.now(),
                name: name,
                date: new Date().toLocaleDateString()
            };

            this.npcs[status].push(npc);
            this.saveData('npcs', this.npcs);
            this.renderNPCs();

            // Clear input
            document.getElementById('npcName').value = '';
        });
    }

    setupQuotes() {
        document.getElementById('addQuote').addEventListener('click', () => {
            const text = document.getElementById('quoteText').value.trim();
            const author = document.getElementById('quoteAuthor').value.trim();

            if (!text) {
                alert('Please enter a quote!');
                return;
            }

            const quote = {
                id: Date.now(),
                text: text,
                author: author || 'Unknown',
                date: new Date().toLocaleDateString()
            };

            this.quotes.push(quote);
            this.saveData('quotes', this.quotes);
            this.renderQuotes();

            // Clear inputs
            document.getElementById('quoteText').value = '';
            document.getElementById('quoteAuthor').value = '';
        });
    }

    setupDiceJail() {
        document.getElementById('addDice').addEventListener('click', () => {
            const crime = document.getElementById('diceCrime').value.trim();

            if (!crime) {
                alert('Please describe the crime!');
                return;
            }

            const dice = {
                id: Date.now(),
                crime: crime,
                date: new Date().toLocaleDateString()
            };

            this.diceJail.push(dice);
            this.saveData('diceJail', this.diceJail);
            this.renderDiceJail();

            // Clear input
            document.getElementById('diceCrime').value = '';
        });
    }

    renderSessionMemes() {
        const container = document.getElementById('sessionMemesContainer');
        
        if (this.sessionMemes.length === 0) {
            container.innerHTML = '<div class="empty-state">No memes yet! Be the first to upload one!</div>';
            return;
        }

        // Group by session
        const bySession = {};
        this.sessionMemes.forEach(meme => {
            const session = meme.session || 'General';
            if (!bySession[session]) bySession[session] = [];
            bySession[session].push(meme);
        });

        container.innerHTML = '';
        Object.keys(bySession).sort().reverse().forEach(session => {
            const sessionDiv = document.createElement('div');
            sessionDiv.innerHTML = `<h3>${session}</h3>`;
            
            const grid = document.createElement('div');
            grid.className = 'meme-grid';
            
            bySession[session].forEach(meme => {
                grid.appendChild(this.createMemeCard(meme, 'sessionMemes'));
            });
            
            sessionDiv.appendChild(grid);
            container.appendChild(sessionDiv);
        });
    }

    renderCharacterMemes() {
        const container = document.getElementById('characterMemesContainer');
        
        if (Object.keys(this.characterMemes).length === 0) {
            container.innerHTML = '<div class="empty-state">No character roasts yet! Time to call out your friends!</div>';
            return;
        }

        container.innerHTML = '';
        Object.keys(this.characterMemes).forEach(character => {
            const characterDiv = document.createElement('div');
            const characterName = character.charAt(0).toUpperCase() + character.slice(1);
            characterDiv.innerHTML = `<h3>🎭 ${characterName}</h3>`;
            
            const grid = document.createElement('div');
            grid.className = 'meme-grid';
            
            this.characterMemes[character].forEach(meme => {
                grid.appendChild(this.createMemeCard(meme, 'characterMemes', character));
            });
            
            characterDiv.appendChild(grid);
            container.appendChild(characterDiv);
        });
    }

    renderBurnBook() {
        const container = document.getElementById('burnBookContainer');
        
        if (this.burnBook.length === 0) {
            container.innerHTML = '<div class="empty-state">The Burn Book is empty... for now 🔥</div>';
            return;
        }

        container.innerHTML = '';
        this.burnBook.forEach(meme => {
            container.appendChild(this.createMemeCard(meme, 'burnBook'));
        });
    }

    renderNPCs() {
        const fameList = document.getElementById('npcFameList');
        const shameList = document.getElementById('npcShameList');
        const deceasedList = document.getElementById('npcDeceasedList');
        const questionList = document.getElementById('npcQuestionList');

        fameList.innerHTML = this.npcs.fame.length > 0 
            ? this.npcs.fame.map(npc => this.createNPCBadge(npc, 'fame')).join('') 
            : '<div class="empty-state">No NPCs in the Hall of Fame yet</div>';

        shameList.innerHTML = this.npcs.shame.length > 0 
            ? this.npcs.shame.map(npc => this.createNPCBadge(npc, 'shame')).join('') 
            : '<div class="empty-state">No NPCs in the Hall of Shame yet</div>';

        deceasedList.innerHTML = this.npcs.deceased.length > 0 
            ? this.npcs.deceased.map(npc => this.createNPCBadge(npc, 'deceased')).join('') 
            : '<div class="empty-state">No deceased NPCs... yet</div>';

        questionList.innerHTML = this.npcs.question.length > 0 
            ? this.npcs.question.map(npc => this.createNPCBadge(npc, 'question')).join('') 
            : '<div class="empty-state">All NPCs accounted for</div>';
    }

    renderQuotes() {
        const container = document.getElementById('quotesContainer');
        
        if (this.quotes.length === 0) {
            container.innerHTML = '<div class="empty-state">No quotes yet! Add some legendary moments!</div>';
            return;
        }

        container.innerHTML = this.quotes.map(quote => `
            <div class="quote-list">
                <div class="quote-item">${quote.text}</div>
                <div class="meme-meta">- ${quote.author}, ${quote.date}</div>
                <button class="delete-button" onclick="memeManager.deleteQuote(${quote.id})" style="position: relative; top: 0; right: 0; margin-top: 10px;">×</button>
            </div>
        `).join('');
    }

    renderDiceJail() {
        const container = document.getElementById('diceJailContainer');
        
        if (this.diceJail.length === 0) {
            container.innerHTML = '<div class="empty-state">No dice in jail... suspiciously well-behaved!</div>';
            return;
        }

        container.innerHTML = this.diceJail.map(dice => `
            <div class="dice-card">
                <div class="dice-emoji">🎲</div>
                <div class="dice-crime">${dice.crime}</div>
                <div class="meme-meta" style="margin-top: 10px;">${dice.date}</div>
                <button class="delete-button" onclick="memeManager.releaseDice(${dice.id})">×</button>
            </div>
        `).join('');
    }

    createMemeCard(meme, type, subtype = null) {
        const card = document.createElement('div');
        card.className = 'meme-card';
        
        card.innerHTML = `
            <button class="delete-button" onclick="memeManager.deleteMeme(${meme.id}, '${type}', '${subtype}')">×</button>
            <img src="${meme.image}" alt="Meme" class="meme-image">
            <div class="meme-caption">${meme.caption || ''}</div>
            <div class="meme-meta">${meme.date}</div>
        `;
        
        return card;
    }

    createNPCBadge(npc, status) {
        return `
            <div class="npc-badge">
                ${npc.name}
                <button class="delete-badge" onclick="memeManager.deleteNPC(${npc.id}, '${status}')">×</button>
            </div>
        `;
    }

    deleteMeme(id, type, subtype) {
        if (!confirm('Delete this meme?')) return;

        if (type === 'characterMemes' && subtype && subtype !== 'null') {
            this.characterMemes[subtype] = this.characterMemes[subtype].filter(m => m.id !== id);
            if (this.characterMemes[subtype].length === 0) {
                delete this.characterMemes[subtype];
            }
        } else {
            this[type] = this[type].filter(m => m.id !== id);
        }

        this.saveData(type, this[type]);
        this.renderAll();
    }

    deleteNPC(id, status) {
        if (!confirm('Remove this NPC?')) return;
        
        this.npcs[status] = this.npcs[status].filter(n => n.id !== id);
        this.saveData('npcs', this.npcs);
        this.renderNPCs();
    }

    deleteQuote(id) {
        if (!confirm('Delete this quote?')) return;
        
        this.quotes = this.quotes.filter(q => q.id !== id);
        this.saveData('quotes', this.quotes);
        this.renderQuotes();
    }

    releaseDice(id) {
        if (!confirm('Release this dice from jail?')) return;
        
        this.diceJail = this.diceJail.filter(d => d.id !== id);
        this.saveData('diceJail', this.diceJail);
        this.renderDiceJail();
    }

    renderAll() {
        this.renderSessionMemes();
        this.renderCharacterMemes();
        this.renderBurnBook();
        this.renderNPCs();
        this.renderQuotes();
        this.renderDiceJail();
    }
}

// Initialize when page loads
let memeManager;
document.addEventListener('DOMContentLoaded', () => {
    memeManager = new MemeManager();
});
