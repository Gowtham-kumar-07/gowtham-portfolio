════════════════════════════════════════════════
  Reel Creator Portfolio — File Guide
════════════════════════════════════════════════

FOLDER STRUCTURE
----------------
portfolio/
├── index.html          ← Public website (share this)
├── admin.html          ← YOUR private video manager (never share this URL)
├── css/
│   └── style.css       ← All styling
├── js/
│   ├── main.js         ← Public JS (loads videos, no edit controls)
│   ├── admin.js        ← Admin JS (all edit logic)
│   └── videos.json     ← Video URLs (edit via admin panel, then export)
├── assets/             ← Drop your local .mp4 / .webm files here
└── README.txt          ← This file

HOW TO ADD / CHANGE VIDEOS
---------------------------
1. Open admin.html in your browser (keep this URL private)
2. Paste a YouTube / Vimeo URL — OR — click "Pick File" for a local video
   (for local files, copy the .mp4 into the assets/ folder)
3. Click "Set Video" — preview updates immediately
4. Click "Export videos.json" → save the file into the js/ folder
5. Refresh index.html — visitors now see your videos

SUPPORTED VIDEO SOURCES
------------------------
• YouTube  — https://youtu.be/xxx  or  https://youtube.com/watch?v=xxx
• YouTube Shorts — https://youtube.com/shorts/xxx
• Vimeo    — https://vimeo.com/123456789
• Local file — place .mp4/.webm in assets/ folder, use path: assets/filename.mp4

DEPLOYING ONLINE
-----------------
Upload the entire portfolio/ folder to any web host
(Netlify, Vercel, GitHub Pages, cPanel, etc.).
Only share your domain/index.html with visitors.
Keep admin.html bookmarked privately — never link to it publicly.

════════════════════════════════════════════════
