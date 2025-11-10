# 🎮 The Protectorate Campaign Dashboard - Quick Start

## ✨ What You've Got

A complete, dark fantasy D&D campaign website with:

### 📄 **7 Core Pages**
1. **index.html** - Epic landing page with campaign overview
2. **lore.html** - Comprehensive world history, magic system, and prophecies
3. **characters.html** - 18+ detailed NPCs with relationship statuses
4. **locations.html** - 13+ major locations across The Protectorate
5. **maps.html** - World geography and political divisions
6. **players.html** - Password-protected player hub with note-taking
7. **preview.html** - Standalone preview of the design

### 🎨 **Design Features**
- Animated starfield background
- Dragon Quest IX inspired aesthetic
- Dark fantasy theme (Dragon Age/Throne of Glass vibes)
- Golden accents and cinematic effects
- Fully responsive (works on mobile/tablet)
- Custom Google Fonts (Cinzel & Spectral)

### 🔐 **Player Hub Features**
- Password protection for each player
- Auto-saving session notes (localStorage)
- Inventory tracking
- Relationship/faction notes
- Theory & mystery documentation
- D&D Beyond character sheet integration
- Party member display

## 🚀 Immediate Next Steps

### 1. Upload to GitHub (5 minutes)
```
1. Go to: https://github.com/nerysmuller/Sentinels-Campaign-Dashboard
2. Click "Add file" → "Upload files"
3. Drag all files from /outputs folder
4. Commit changes
```

### 2. Enable GitHub Pages (2 minutes)
```
1. Go to repository Settings
2. Click "Pages" (left sidebar)
3. Select "main" branch
4. Save
5. Wait 1-2 minutes
6. Site live at: https://nerysmuller.github.io/Sentinels-Campaign-Dashboard/
```

### 3. Customize Player Data (10 minutes)
Edit `player-script.js` on GitHub:

```javascript
const playerData = {
    player1: {
        name: "Your PC Name Here",
        class: "Paladin 5",
        password: "change_me",
        sheetUrl: "https://www.dndbeyond.com/characters/YOUR_ID"
    },
    // ... add more players
};
```

## 📝 Content Customization Checklist

### Priority 1 - Essential Info
- [ ] Update player names & passwords in `player-script.js`
- [ ] Add D&D Beyond character sheet URLs
- [ ] Add actual player character names to dropdown
- [ ] Replace "DM: Nerys Muller" with your name (if different)

### Priority 2 - Campaign Content  
- [ ] Customize lore.html with your campaign history
- [ ] Update NPC names/descriptions in characters.html
- [ ] Modify locations to match your world
- [ ] Add custom maps or world map images

### Priority 3 - Polish
- [ ] Add session recaps to "Recent Updates" on index.html
- [ ] Upload custom map images
- [ ] Add campaign-specific NPCs
- [ ] Customize color scheme (optional)

## 🎯 Features Breakdown

### Password System
- **Default Password:** `"sentinel"` (change this!)
- Client-side authentication (fine for trusted groups)
- Session-based login (stays logged in until tab closes)
- Easy to update in one place

### Note System
- **Storage:** Browser localStorage (persistent)
- **Auto-save:** Every 30 seconds
- **Manual save:** Click save buttons
- **Backup:** Players should periodically copy important notes

### D&D Beyond Integration
Two options:
1. **Link to sheet** (easiest) - Just add URL
2. **Embed sheet** (limited by D&D Beyond) - Custom iframe solution

## 🔧 Advanced Customization

### Change Color Scheme
Edit `styles.css` variables:
```css
:root {
    --accent-gold: #d4af37;  /* Change to your color */
    --accent-purple: #8b5cf6; /* Player hub accent */
}
```

### Add New NPCs
Copy this template in `characters.html`:
```html
<div class="character-card">
    <h3>NPC Name</h3>
    <p class="character-title">Title/Role</p>
    <p class="character-description">Description...</p>
    <span class="character-status status-ally">Ally</span>
</div>
```

Status options: `status-ally`, `status-enemy`, `status-neutral`, `status-unknown`

### Add Map Images
1. Upload images to repository
2. Edit `maps.html`:
```html
<img src="your-map.png" alt="World Map" class="map-image">
```

## 📱 Mobile Experience

The site is fully responsive! Players can:
- View campaign info on phones
- Take notes on tablets  
- Access character sheets anywhere
- All features work on mobile browsers

## 🛠 Troubleshooting

**Q: Player can't login?**
- A: Check password in `player-script.js` matches what they're typing
- Clear browser cache and try again

**Q: Notes not saving?**
- A: Enable localStorage in browser settings
- Try a different browser (Chrome/Firefox recommended)

**Q: Site not showing on GitHub Pages?**
- A: Wait 2-5 minutes after enabling
- Check that `index.html` is in root directory
- Verify GitHub Pages is enabled in Settings

**Q: D&D Beyond sheet not embedding?**
- A: D&D Beyond restricts embedding - use direct links instead
- Or ask DM for custom iframe solution

## 🎭 Easter Eggs

Try the Konami code: ↑↑↓↓←→←→BA
(Creates a celestial particle effect!)

## 📊 File Inventory

**HTML Files (7):**
- index.html (main page)
- lore.html (world history)
- characters.html (NPC database)
- locations.html (places)
- maps.html (world geography)
- players.html (player hub)
- preview.html (design showcase)

**CSS Files (1):**
- styles.css (all styling)

**JavaScript Files (2):**
- script.js (general effects)
- player-script.js (player authentication & notes)

**Documentation (3):**
- README.md (full documentation)
- DEPLOY.md (GitHub deployment guide)
- THIS_FILE.md (quick start)

**Total:** 13 files, ready to deploy!

## 🎉 You're Ready!

Your campaign dashboard is complete and ready to launch. The design captures that epic Dragon Quest IX vibe while bringing in the dark, mature fantasy aesthetics of Dragon Age and Throne of Glass.

### What Makes This Special:
- **Professional Design** - Looks like a commercial game website
- **Fully Functional** - All features work out of the box
- **Easy to Customize** - Change content without coding knowledge
- **Player-Friendly** - Intuitive navigation and note-taking
- **Campaign-Focused** - Built specifically for D&D storytelling

Upload it, share the link with your players, and watch them explore the world you've created!

---

**Need Help?** Check the full README.md or create a GitHub issue.

**Happy Adventuring! ⚔️✨**
