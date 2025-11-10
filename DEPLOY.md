# GitHub Pages Deployment Guide

## Quick Deploy to Your Repository

### Step 1: Upload Files to Your Repository

1. Go to https://github.com/nerysmuller/Sentinels-Campaign-Dashboard
2. Click "Add file" → "Upload files"
3. Upload all these files:
   - index.html
   - lore.html
   - characters.html
   - locations.html
   - maps.html
   - players.html
   - styles.css
   - script.js
   - player-script.js
   - README.md

### Step 2: Enable GitHub Pages

1. Go to repository Settings
2. Click "Pages" in the left sidebar
3. Under "Source", select "main" branch
4. Click "Save"
5. Wait 1-2 minutes for deployment
6. Your site will be live at: https://nerysmuller.github.io/Sentinels-Campaign-Dashboard/

### Step 3: Customize Player Data

1. Edit `player-script.js` directly on GitHub:
   - Click the file
   - Click the pencil icon (Edit)
   - Update player names, classes, and passwords
   - Add D&D Beyond character sheet URLs
   - Commit changes

2. Changes will automatically deploy to your live site!

## Alternative: Use Git Commands

If you're comfortable with Git:

```bash
cd Sentinels-Campaign-Dashboard
git add .
git commit -m "Initial campaign dashboard setup"
git push origin main
```

Then enable GitHub Pages in repository settings.

## Customizing for Your Campaign

### Update Player Information
Edit `player-script.js` - lines 2-25

### Add Your NPCs
Edit `characters.html` - add new character cards

### Add Your Locations  
Edit `locations.html` - add new location cards

### Update Lore
Edit `lore.html` - customize the story

### Add Maps
1. Upload map images to repository
2. Edit `maps.html` to reference your images:
   ```html
   <img src="your-map.png" alt="Map" class="map-image">
   ```

## Testing Locally

Simply open `index.html` in your browser. No server needed!

## Troubleshooting

**Problem:** Player login not working
- Check that passwords in `player-script.js` match what you're entering
- Clear browser cache and try again

**Problem:** Notes not saving
- Check browser localStorage permissions
- Try a different browser
- Make sure JavaScript is enabled

**Problem:** Site not showing on GitHub Pages
- Wait 2-5 minutes after enabling Pages
- Check that `index.html` is in the root directory
- Verify GitHub Pages is enabled in Settings

## Getting Help

If you need help customizing the dashboard, check the README.md file or create an issue in the repository!
