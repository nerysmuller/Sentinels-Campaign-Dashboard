# The Protectorate - Sentinels Campaign Dashboard

A dark fantasy D&D campaign hub inspired by Dragon Quest IX, Dragon Age, and Throne of Glass aesthetics.

## 🎮 Features

- **Immersive Dark Fantasy UI** - Animated starfield background, golden accents, and cinematic styling
- **Campaign Lore Hub** - Comprehensive world history, magic system, and prophecies
- **NPC Database** - Detailed character profiles with relationship tracking
- **Location Guide** - Major cities, dungeons, and mysterious places across The Protectorate
- **Interactive Maps** - World geography and points of interest
- **Password-Protected Player Sections** - Each player has private access to:
  - Session note-taking (auto-saved to browser)
  - Character sheet links/embeds
  - Inventory tracking
  - Relationship & faction notes
  - Theory & mystery documentation

## 📁 File Structure

```
sentinels-campaign-dashboard/
├── index.html              # Main landing page
├── lore.html              # Campaign history and world lore
├── characters.html        # NPC database
├── locations.html         # Key locations in The Protectorate
├── maps.html              # World maps and geography
├── players.html           # Password-protected player hub
├── styles.css             # All styling (dark fantasy theme)
├── script.js              # General animations and effects
├── player-script.js       # Player authentication and note-saving
└── README.md             # This file
```

## 🚀 Setup Instructions

### Quick Start

1. **Download/Clone the repository**
   ```bash
   git clone https://github.com/nerysmuller/Sentinels-Campaign-Dashboard.git
   cd Sentinels-Campaign-Dashboard
   ```

2. **Open `index.html` in your browser**
   - No server required! Just double-click the file.
   - For best experience, use Chrome, Firefox, or Edge.

3. **Host on GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select main branch as source
   - Your site will be live at: `https://nerysmuller.github.io/Sentinels-Campaign-Dashboard/`

## 🎨 Customization Guide

### Player Characters

Edit `player-script.js` to customize player information:

```javascript
const playerData = {
    player1: {
        name: "Actual Character Name",
        class: "Fighter 5 / Paladin 3",
        password: "custom_password",
        sheetUrl: "https://www.dndbeyond.com/characters/YOUR_CHARACTER_ID"
    },
    // Add more players...
};
```

### Adding Content

**New NPCs (characters.html):**
```html
<div class="character-card">
    <h3>NPC Name</h3>
    <p class="character-title">Title/Role</p>
    <p class="character-description">Description here...</p>
    <span class="character-status status-ally">Ally</span>
</div>
```

**New Locations (locations.html):**
```html
<div class="location-card">
    <h3>Location Name</h3>
    <p class="location-type">Type of Location</p>
    <p class="location-description">Description here...</p>
</div>
```

### Color Scheme

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-dark: #0a0a0f;        /* Main background */
    --accent-gold: #d4af37;         /* Primary accent */
    --accent-blue: #4a90e2;         /* Secondary accent */
    --accent-purple: #8b5cf6;       /* Player hub accent */
    --accent-red: #dc2626;          /* Danger/enemy */
    --text-light: #e8e8e8;         /* Main text */
    --text-dim: #a0a0a0;           /* Secondary text */
}
```

### Adding Maps

Replace placeholder content in `maps.html` with actual images:

```html
<div class="map-container">
    <h3>Your Map Title</h3>
    <img src="path/to/your/map.png" alt="Map description" class="map-image">
</div>
```

## 🔐 Player Hub System

### Password Setup
- Default password for all characters: `"sentinel"`
- Change passwords in `player-script.js`
- Passwords are checked client-side (suitable for trusted groups)

### Note Storage
- All notes save to browser's localStorage
- Automatic save every 30 seconds
- Manual save buttons available
- Data persists between sessions
- **Important:** Notes are stored locally - players should backup important information!

### D&D Beyond Integration

The dashboard supports two methods:

**Method 1: Direct Links**
```javascript
sheetUrl: "https://www.dndbeyond.com/characters/YOUR_CHARACTER_ID"
```

**Method 2: Embedded Sheets (if available)**
Some character sheets can be embedded using iframes, but D&D Beyond has restrictions. Contact your DM for custom solutions.

## 🎯 DQ9 Integration

The world design is inspired by Dragon Quest IX's Protectorate setting:

- **The Observatory** → The World Tree (central hub)
- **Celestrian Realm** → Celestrian history and divine powers
- **Various Towns** → Major cities (Lumina, Stormhaven, etc.)
- **Grottos** → Mysterious dungeons and ruins
- **World Map** → Adapted for dark fantasy aesthetic

Key differences:
- Darker tone (Dragon Age/Throne of Glass intensity)
- Political intrigue and moral complexity
- Horror and dark fantasy elements
- Adult themes appropriate for mature campaigns

## 📝 Content Guidelines

When adding content, maintain the tone:

- **Epic yet personal** - Grand scope with intimate character moments
- **Dark but hopeful** - Grim situations with potential for heroism
- **Mystery-driven** - Leave questions unanswered for players to explore
- **Player-focused** - Content should enhance player agency and choice

## 🛠 Technical Notes

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (may need localStorage permissions)
- Mobile: Responsive design works on tablets and phones

### Performance
- Lightweight (no external dependencies except fonts)
- Animated background is performant but can be disabled if needed
- Auto-saves are throttled to avoid performance issues

### Future Enhancements
Potential additions for future versions:
- [ ] Initiative tracker
- [ ] Dice roller integration
- [ ] Session calendar/scheduler
- [ ] Shared party inventory
- [ ] DM-only admin panel
- [ ] Export/import notes feature
- [ ] Real-time collaborative editing

## 🎭 Easter Eggs

Try entering the Konami code (↑↑↓↓←→←→BA) for a celestial surprise!

## 📜 Credits

**Campaign Design:** Nerys Muller  
**World Inspiration:** Dragon Quest IX (Square Enix)  
**Aesthetic Inspiration:** Dragon Age (BioWare), Throne of Glass (Sarah J. Maas)  
**Font:** Cinzel & Spectral (Google Fonts)

## 📄 License

This is a personal campaign project. Feel free to fork and adapt for your own campaigns!

Dragon Quest IX and related trademarks are property of Square Enix.
Dragon Age is property of BioWare/Electronic Arts.

---

**May your dice roll true and your adventures be legendary! ⚔️**
