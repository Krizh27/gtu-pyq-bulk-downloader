# Content Management Guide

The GTU PYQ Downloader is now powered by a **Meme Engine Architecture**. All text, jokes, banners, and background videos are completely decoupled from the application logic. 

This means anyone can update the personality of the app without knowing how the backend APIs or ZIP creation works!

## The Source of Truth
All content lives in exactly one file:
`frontend/config/content.js`

### 1. Managing Background Reels (`reels`)
To add a new background video, simply append an object to the `reels` array:
```javascript
{
    id: 3,
    title: "Sad Student",
    url: "link-to-your-mp4-file.mp4",
    enabled: true // Set to false to hide this video from the random pool
}
```

### 2. Managing the Panic Meter (`examDate` & `examMessages`)
The "Panic Meter" calculates how many days are left until the exam and chooses the appropriate message category (`earlyBird`, `oneMonth`, `oneWeek`, `oneDay`, `examDay`).
- Edit `CONTENT.examDate` to set the date of the next major GTU exam.
- Add strings to the arrays inside `CONTENT.examMessages` to expand the joke pool.

### 3. Adding Subject Roasts (`subjectMemes`)
Want to make fun of a specific subject? Just add the 7-digit GTU subject code as a key to the `subjectMemes` dictionary:
```javascript
subjectMemes: {
    "3140702": ["DAA detected. Graph se zyada life cyclic lag rahi hai?"],
    "1234567": ["Your custom joke here!"]
}
```

### 4. Updating Banners & Download Text
- Add quotes to the `CONTENT.banners` array to see them rotate at the top of the screen.
- Add quotes to `CONTENT.downloadMessages` to randomize the success text after a ZIP download.
