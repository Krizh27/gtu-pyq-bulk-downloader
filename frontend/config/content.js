/**
 * ====================================
 *  THE MEME ENGINE CONFIGURATION FILE
 * ====================================
 * 
 * Edit this file to change the personality of the application.
 * You DO NOT need to touch the HTML, CSS, or JS logic to add memes!
 */

const CONTENT = {
    // ----------------------------------------------------
    // BACKGROUND VIDEO REELS
    // Set enabled to false to temporarily hide a video
    // ----------------------------------------------------
    reels: [
        {
            id: 1,
            title: "Matrix Cat",
            url: "https://videos.pexels.com/video-files/853889/853889-hd_1920_1080_25fps.mp4", // Using abstract neon lights as placeholder
            enabled: true
        },
        {
            id: 2,
            title: "Programming Meme",
            url: "https://videos.pexels.com/video-files/3129595/3129595-uhd_2560_1440_30fps.mp4", // Keyboard typing placeholder
            enabled: true
        }
    ],

    // ----------------------------------------------------
    // ROTATING BANNERS
    // These scroll at the top of the screen
    // ----------------------------------------------------
    banners: [
        "Kal se pakka padhunga.",
        "Ye last reel hai, iske baad seedha syllabus complete.",
        "Paper mil jayega. Confidence nahi.",
        "GTU: Where hope comes to die, but passing marks survive."
    ],

    // ----------------------------------------------------
    // TIME-BASED EXAM MESSAGES (PANIC METER)
    // ----------------------------------------------------
    // Change this mock date to test different panic states (Format: YYYY-MM-DD)
    // Exam date is set dynamically in the app based on this config
    examDate: "2026-06-18",

    panicLevels: {
        relaxed: {
            color: "#4ade80", // Green
            label: "[ PANIC LEVEL: CHILL ]"
        },
        warning: {
            color: "#facc15", // Yellow
            label: "[ PANIC LEVEL: AWARENESS ]"
        },
        panic: {
            color: "#f97316", // Orange
            label: "[ PANIC LEVEL: PANIC ]"
        },
        critical: {
            color: "#ef4444", // Red
            label: "[ PANIC LEVEL: SPEEDRUN MODE ]"
        }
    },

    examMessages: {
        earlyBird: [
            "Oho bhai. Itni jaldi paper dhoond raha hai?",
            "Iss baar topper banne ka plan hai?"
        ],
        oneMonth: [
            "Abhi bhi chance hai.",
            "Reels kam, revision zyada."
        ],
        oneWeek: [
            "Thoda panic allowed hai.",
            "Syllabus dekhne ka time aa gaya hai."
        ],
        oneDay: [
            "Welcome to the annual GTU speedrun.",
            "One night fight. May the odds be ever in your favor."
        ],
        examDay: [
            "Bhagwan bharose mode activated.",
            "Jo hoga dekha jayega. Print nikal aur padh."
        ]
    },

    // ----------------------------------------------------
    // SUBJECT SPECIFIC ROASTS
    // Triggered instantly when a user types a specific code
    // ----------------------------------------------------
    subjectMemes: {
        "3140702": [
            "DAA detected. Graph se zyada life cyclic lag rahi hai?"
        ],
        "3140705": [
            "OS detected. Deadlock sirf processes me nahi hai."
        ],
        "3150703": [
            "ADA? Dynamic Programming in syllabus, but static progress in life."
        ],
        "3110005": [
            "BEE. Resistance is futile."
        ]
    },

    // ----------------------------------------------------
    // DOWNLOAD SUCCESS MESSAGES
    // Displayed after the ZIP is successfully created
    // ----------------------------------------------------
    downloadMessages: [
        "Papers acquired successfully. Ab padh bhi le.",
        "Mission complete. Syllabus complete karna abhi baaki hai.",
        "Downloads done. Excuses unavailable.",
        "ZIP file ready. Folder banake bhool mat jana."
    ]
    ,

    // ----------------------------------------------------
    // PAPER MEDIA (images / gifs / videos)
    // Map labels to media or set a default media shown under each label.
    // Edit `overrides` to customize per-label media easily.
    // ----------------------------------------------------
    paperMedia: {
        // Default media shown when no per-label override exists
        default: {
            type: "image",
            url: "homelander-im-better.gif"
        },

        // Overrides: use the exact label string (as rendered) to target a specific paper
        overrides: {
            "Summer 2022": {
                type: "gif",
                url: "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"
            },
            "Winter 2021": {
                type: "video",
                url: "https://videos.pexels.com/video-files/854176/854176-hd_1920_1080_30fps.mp4"
            }
        }
    }
};
