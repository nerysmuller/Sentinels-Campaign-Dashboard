import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// ============================================
// IMPORTANT: REPLACE THIS WITH YOUR FIREBASE CONFIG
// Get this from Firebase Console > Project Settings > Your Apps
// ============================================
const firebaseConfig = {
    apiKey: "AIzaSyAwKQhvdvFsML0sD1Fox0x0Y1PasF8xkyM",
    authDomain: "sentinels-campaign.firebaseapp.com",
    projectId: "sentinels-campaign",
    storageBucket: "sentinels-campaign.firebasestorage.app",
    messagingSenderId: "1056018288604",
    appId: "1:1056018288604:web:66a2eb7bc4374bd35c4919"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

class FirebaseMemeManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupUploadAreas();
        this.setupEventListeners();
        this.subscribeToRealtimeUpdates();
    }

    // ============================================
    // UPLOAD AREA SETUP (Drag & Drop)
    // ============================================
    setupUploadAreas() {
        const uploadAreas = [
            { area: 'sessionUploadArea', input: 'sessionMemeInput' },
            { area: 'characterUploadArea', input: 'characterMemeInput' },
            { area: 'burnBookUploadArea', input: 'burnBookInput' }
        ];

        uploadAreas.forEach(({ area, input }) => {
            const uploadArea = document.getElementById(area);
            const fileInput = document.getElementById(input);

            uploadArea.addEventListener('click', (e) => {
                if (e.target === uploadArea || e.target.classList.contains('upload-icon') || e.target.classList.contains('upload-text')) {
                    fileInput.click();
                }
            });

            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0 && files[0].type.startsWith('image/')) {
                    fileInput.files = files;
                }
            });
        });
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    setupEventListeners() {
        // Session Memes
        document.getElementById('uploadSessionMeme').addEventListener('click', () => this.uploadSessionMeme());

        // Character Memes
        document.getElementById('uploadCharacterMeme').addEventListener('click', () => this.uploadCharacterMeme());

        // Burn Book
        document.getElementById('uploadBurnBook').addEventListener('click', () => this.uploadBurnBook());

        // NPCs
        document.getElementById('addNPC').addEventListener('click', () => this.addNPC());

        // Quotes
        document.getElementById('addQuote').addEventListener('click', () => this.addQuote());

        // Dice Jail
        document.getElementById('addDice').addEventListener('click', () => this.addDice());
    }

    // ============================================
    // UPLOAD SESSION MEME
    // ============================================
    async uploadSessionMeme() {
        const fileInput = document.getElementById('sessionMemeInput');
        const caption = document.getElementById('sessionCaption').value.trim();
        const sessionNumber = document.getElementById('sessionNumber').value.trim() || 'General';
        const spinner = document.getElementById('sessionSpinner');
        const errorDiv = document.getElementById('sessionError');

        if (!fileInput.files[0]) {
            this.showError(errorDiv, 'Please select an image!');
            return;
        }

        try {
            spinner.classList.add('active');
            errorDiv.classList.remove('active');

            // Upload image to Firebase Storage
            const imageUrl = await this.uploadImage(fileInput.files[0], 'session-memes');

            // Save to Firestore
            await addDoc(collection(db, 'sessionMemes'), {
                imageUrl,
                caption,
                session: sessionNumber,
                timestamp: new Date(),
                date: new Date().toLocaleDateString()
            });

            // Clear form
            fileInput.value = '';
            document.getElementById('sessionCaption').value = '';
            document.getElementById('sessionNumber').value = '';
            
            spinner.classList.remove('active');
        } catch (error) {
            console.error('Error uploading session meme:', error);
            this.showError(errorDiv, 'Failed to upload meme. Please try again.');
            spinner.classList.remove('active');
        }
    }

    // ============================================
    // UPLOAD CHARACTER MEME
    // ============================================
    async uploadCharacterMeme() {
        const fileInput = document.getElementById('characterMemeInput');
        const caption = document.getElementById('characterCaption').value.trim();
        const character = document.getElementById('characterSelect').value;
        const spinner = document.getElementById('characterSpinner');
        const errorDiv = document.getElementById('characterError');

        if (!character) {
            this.showError(errorDiv, 'Please select a character!');
            return;
        }

        if (!fileInput.files[0]) {
            this.showError(errorDiv, 'Please select an image!');
            return;
        }

        try {
            spinner.classList.add('active');
            errorDiv.classList.remove('active');

            const imageUrl = await this.uploadImage(fileInput.files[0], 'character-memes');

            await addDoc(collection(db, 'characterMemes'), {
                imageUrl,
                caption,
                character,
                timestamp: new Date(),
                date: new Date().toLocaleDateString()
            });

            fileInput.value = '';
            document.getElementById('characterCaption').value = '';
            spinner.classList.remove('active');
        } catch (error) {
            console.error('Error uploading character meme:', error);
            this.showError(errorDiv, 'Failed to upload meme. Please try again.');
            spinner.classList.remove('active');
        }
    }

    // ============================================
    // UPLOAD BURN BOOK
    // ============================================
    async uploadBurnBook() {
        const fileInput = document.getElementById('burnBookInput');
        const caption = document.getElementById('burnBookCaption').value.trim();
        const spinner = document.getElementById('burnBookSpinner');
        const errorDiv = document.getElementById('burnBookError');

        if (!fileInput.files[0]) {
            this.showError(errorDiv, 'Please select an image!');
            return;
        }

        try {
            spinner.classList.add('active');
            errorDiv.classList.remove('active');

            const imageUrl = await this.uploadImage(fileInput.files[0], 'burn-book');

            await addDoc(collection(db, 'burnBook'), {
                imageUrl,
                caption,
                timestamp: new Date(),
                date: new Date().toLocaleDateString()
            });

            fileInput.value = '';
            document.getElementById('burnBookCaption').value = '';
            spinner.classList.remove('active');
        } catch (error) {
            console.error('Error uploading burn book:', error);
            this.showError(errorDiv, 'Failed to upload. Please try again.');
            spinner.classList.remove('active');
        }
    }

    // ============================================
    // ADD NPC
    // ============================================
    async addNPC() {
        const name = document.getElementById('npcName').value.trim();
        const status = document.getElementById('npcStatus').value;

        if (!name) {
            alert('Please enter an NPC name!');
            return;
        }

        try {
            await addDoc(collection(db, 'npcs'), {
                name,
                status,
                timestamp: new Date(),
                date: new Date().toLocaleDateString()
            });

            document.getElementById('npcName').value = '';
        } catch (error) {
            console.error('Error adding NPC:', error);
            alert('Failed to add NPC. Please try again.');
        }
    }

    // ============================================
    // ADD QUOTE
    // ============================================
    async addQuote() {
        const text = document.getElementById('quoteText').value.trim();
        const author = document.getElementById('quoteAuthor').value.trim() || 'Unknown';

        if (!text) {
            alert('Please enter a quote!');
            return;
        }

        try {
            await addDoc(collection(db, 'quotes'), {
                text,
                author,
                timestamp: new Date(),
                date: new Date().toLocaleDateString()
            });

            document.getElementById('quoteText').value = '';
            document.getElementById('quoteAuthor').value = '';
        } catch (error) {
            console.error('Error adding quote:', error);
            alert('Failed to add quote. Please try again.');
        }
    }

    // ============================================
    // ADD DICE
    // ============================================
    async addDice() {
        const crime = document.getElementById('diceCrime').value.trim();

        if (!crime) {
            alert('Please describe the crime!');
            return;
        }

        try {
            await addDoc(collection(db, 'diceJail'), {
                crime,
                timestamp: new Date(),
                date: new Date().toLocaleDateString()
            });

            document.getElementById('diceCrime').value = '';
        } catch (error) {
            console.error('Error adding dice:', error);
            alert('Failed to imprison dice. Please try again.');
        }
    }

    // ============================================
    // UPLOAD IMAGE TO FIREBASE STORAGE
    // ============================================
    async uploadImage(file, folder) {
        const fileName = `${folder}/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, fileName);
        
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        
        return url;
    }

    // ============================================
    // DELETE FUNCTIONS
    // ============================================
    async deleteMeme(id, collectionName, imageUrl) {
        if (!confirm('Delete this meme?')) return;

        try {
            // Delete from Firestore
            await deleteDoc(doc(db, collectionName, id));

            // Delete image from Storage
            if (imageUrl) {
                const imageRef = ref(storage, imageUrl);
                await deleteObject(imageRef).catch(() => {
                    // Image might not exist, that's okay
                });
            }
        } catch (error) {
            console.error('Error deleting meme:', error);
            alert('Failed to delete. Please try again.');
        }
    }

    async deleteNPC(id) {
        if (!confirm('Remove this NPC?')) return;

        try {
            await deleteDoc(doc(db, 'npcs', id));
        } catch (error) {
            console.error('Error deleting NPC:', error);
            alert('Failed to delete. Please try again.');
        }
    }

    async deleteQuote(id) {
        if (!confirm('Delete this quote?')) return;

        try {
            await deleteDoc(doc(db, 'quotes', id));
        } catch (error) {
            console.error('Error deleting quote:', error);
            alert('Failed to delete. Please try again.');
        }
    }

    async releaseDice(id) {
        if (!confirm('Release this dice from jail?')) return;

        try {
            await deleteDoc(doc(db, 'diceJail', id));
        } catch (error) {
            console.error('Error releasing dice:', error);
            alert('Failed to release. Please try again.');
        }
    }

    // ============================================
    // REAL-TIME UPDATES
    // ============================================
    subscribeToRealtimeUpdates() {
        // Session Memes
        const sessionQuery = query(collection(db, 'sessionMemes'), orderBy('timestamp', 'desc'));
        onSnapshot(sessionQuery, (snapshot) => {
            const memes = [];
            snapshot.forEach((doc) => {
                memes.push({ id: doc.id, ...doc.data() });
            });
            this.renderSessionMemes(memes);
        });

        // Character Memes
        const characterQuery = query(collection(db, 'characterMemes'), orderBy('timestamp', 'desc'));
        onSnapshot(characterQuery, (snapshot) => {
            const memes = [];
            snapshot.forEach((doc) => {
                memes.push({ id: doc.id, ...doc.data() });
            });
            this.renderCharacterMemes(memes);
        });

        // Burn Book
        const burnBookQuery = query(collection(db, 'burnBook'), orderBy('timestamp', 'desc'));
        onSnapshot(burnBookQuery, (snapshot) => {
            const memes = [];
            snapshot.forEach((doc) => {
                memes.push({ id: doc.id, ...doc.data() });
            });
            this.renderBurnBook(memes);
        });

        // NPCs
        const npcsQuery = query(collection(db, 'npcs'), orderBy('timestamp', 'desc'));
        onSnapshot(npcsQuery, (snapshot) => {
            const npcs = { fame: [], shame: [], deceased: [], question: [] };
            snapshot.forEach((doc) => {
                const data = { id: doc.id, ...doc.data() };
                npcs[data.status].push(data);
            });
            this.renderNPCs(npcs);
        });

        // Quotes
        const quotesQuery = query(collection(db, 'quotes'), orderBy('timestamp', 'desc'));
        onSnapshot(quotesQuery, (snapshot) => {
            const quotes = [];
            snapshot.forEach((doc) => {
                quotes.push({ id: doc.id, ...doc.data() });
            });
            this.renderQuotes(quotes);
        });

        // Dice Jail
        const diceQuery = query(collection(db, 'diceJail'), orderBy('timestamp', 'desc'));
        onSnapshot(diceQuery, (snapshot) => {
            const dice = [];
            snapshot.forEach((doc) => {
                dice.push({ id: doc.id, ...doc.data() });
            });
            this.renderDiceJail(dice);
        });
    }

    // ============================================
    // RENDER FUNCTIONS
    // ============================================
    renderSessionMemes(memes) {
        const container = document.getElementById('sessionMemesContainer');

        if (memes.length === 0) {
            container.innerHTML = '<div class="empty-state">No memes yet! Be the first to upload one!</div>';
            return;
        }

        // Group by session
        const bySession = {};
        memes.forEach(meme => {
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

    renderCharacterMemes(memes) {
        const container = document.getElementById('characterMemesContainer');

        if (memes.length === 0) {
            container.innerHTML = '<div class="empty-state">No character roasts yet! Time to call out your friends!</div>';
            return;
        }

        // Group by character
        const byCharacter = {};
        memes.forEach(meme => {
            if (!byCharacter[meme.character]) byCharacter[meme.character] = [];
            byCharacter[meme.character].push(meme);
        });

        container.innerHTML = '';
        Object.keys(byCharacter).forEach(character => {
            const characterDiv = document.createElement('div');
            const characterName = character.charAt(0).toUpperCase() + character.slice(1);
            characterDiv.innerHTML = `<h3>🎭 ${characterName}</h3>`;

            const grid = document.createElement('div');
            grid.className = 'meme-grid';

            byCharacter[character].forEach(meme => {
                grid.appendChild(this.createMemeCard(meme, 'characterMemes'));
            });

            characterDiv.appendChild(grid);
            container.appendChild(characterDiv);
        });
    }

    renderBurnBook(memes) {
        const container = document.getElementById('burnBookContainer');

        if (memes.length === 0) {
            container.innerHTML = '<div class="empty-state">The Burn Book is empty... for now 🔥</div>';
            return;
        }

        container.innerHTML = '';
        memes.forEach(meme => {
            container.appendChild(this.createMemeCard(meme, 'burnBook'));
        });
    }

    renderNPCs(npcs) {
        const fameList = document.getElementById('npcFameList');
        const shameList = document.getElementById('npcShameList');
        const deceasedList = document.getElementById('npcDeceasedList');
        const questionList = document.getElementById('npcQuestionList');

        fameList.innerHTML = npcs.fame.length > 0
            ? npcs.fame.map(npc => this.createNPCBadge(npc)).join('')
            : '<div class="empty-state">No NPCs in the Hall of Fame yet</div>';

        shameList.innerHTML = npcs.shame.length > 0
            ? npcs.shame.map(npc => this.createNPCBadge(npc)).join('')
            : '<div class="empty-state">No NPCs in the Hall of Shame yet</div>';

        deceasedList.innerHTML = npcs.deceased.length > 0
            ? npcs.deceased.map(npc => this.createNPCBadge(npc)).join('')
            : '<div class="empty-state">No deceased NPCs... yet</div>';

        questionList.innerHTML = npcs.question.length > 0
            ? npcs.question.map(npc => this.createNPCBadge(npc)).join('')
            : '<div class="empty-state">All NPCs accounted for</div>';
    }

    renderQuotes(quotes) {
        const container = document.getElementById('quotesContainer');

        if (quotes.length === 0) {
            container.innerHTML = '<div class="empty-state">No quotes yet! Add some legendary moments!</div>';
            return;
        }

        container.innerHTML = quotes.map(quote => `
            <div class="quote-list">
                <div class="quote-item">${this.escapeHtml(quote.text)}</div>
                <div class="meme-meta">- ${this.escapeHtml(quote.author)}, ${quote.date}</div>
                <button class="delete-button" onclick="memeManager.deleteQuote('${quote.id}')" style="position: relative; top: 0; right: 0; margin-top: 10px;">×</button>
            </div>
        `).join('');
    }

    renderDiceJail(dice) {
        const container = document.getElementById('diceJailContainer');

        if (dice.length === 0) {
            container.innerHTML = '<div class="empty-state">No dice in jail... suspiciously well-behaved!</div>';
            return;
        }

        container.innerHTML = dice.map(die => `
            <div class="dice-card">
                <div class="dice-emoji">🎲</div>
                <div class="dice-crime">${this.escapeHtml(die.crime)}</div>
                <div class="meme-meta" style="margin-top: 10px;">${die.date}</div>
                <button class="delete-button" onclick="memeManager.releaseDice('${die.id}')">×</button>
            </div>
        `).join('');
    }

    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    createMemeCard(meme, collectionName) {
        const card = document.createElement('div');
        card.className = 'meme-card';

        card.innerHTML = `
            <button class="delete-button" onclick="memeManager.deleteMeme('${meme.id}', '${collectionName}', '${meme.imageUrl}')">×</button>
            <img src="${meme.imageUrl}" alt="Meme" class="meme-image">
            <div class="meme-caption">${this.escapeHtml(meme.caption || '')}</div>
            <div class="meme-meta">${meme.date}</div>
        `;

        return card;
    }

    createNPCBadge(npc) {
        return `
            <div class="npc-badge">
                ${this.escapeHtml(npc.name)}
                <button class="delete-badge" onclick="memeManager.deleteNPC('${npc.id}')">×</button>
            </div>
        `;
    }

    showError(errorDiv, message) {
        errorDiv.textContent = message;
        errorDiv.classList.add('active');
        setTimeout(() => {
            errorDiv.classList.remove('active');
        }, 5000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when page loads
let memeManager;
document.addEventListener('DOMContentLoaded', () => {
    memeManager = new FirebaseMemeManager();
});

// Make memeManager globally accessible for onclick handlers
window.memeManager = memeManager;
