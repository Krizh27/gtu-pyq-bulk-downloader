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
    bannerSpeed: 4, // Speed of the scrolling meme banner (default: 12, higher is faster)
    banners: [
        "Kal se pakka padhunga.",
        "Ye last reel hai, iske baad seedha syllabus complete.",
        "9:00 baje ka plan tha 9:13 hogai ab shubh muhrat gaya",
        "tere pass to zameen hai , kyu tension leraha",
        "baap ki dukan hai to sahi",
        "bhai uski to shaddi hojayegi tera kya hoga?",
        "reel dekhne se ghar nhi chalta",
        "ab ye line he padhta rahega kya",
        "jo padhna hai wo padh",
        "chal bhai light bandh kar dusro ko sone de",
        "tere to attendence bhi kum hai laadle",
        "darna mat bhai me baitha hu (ghar pe)",
        "whatsapp group mat kholna sab padhke aye hai distract karne",
        "tu kaha meri baat manega khol le whatsapp",
        "uski story pe like to karde padhne se pehele",
        "Alooo Leelooo ye yaad karle future me kaam ayega",
        "hall ticket ki xerox karvai?",
        "tu sale pen kharid pehele kal likhega kaise?",
        "pani ki bottle leke jaa bhai dusre ki khali karne me kya maza ata hai?",
        "tere to internal marks bhi kum hai",
        "8hr ki nind lele bhai ab kuch nhi hosakta",
        "subhe uthke dekhlena ab"
    ],

    // ----------------------------------------------------
    // TIME-BASED EXAM MESSAGES (PANIC METER)
    // ----------------------------------------------------
    // Change this mock date to test different panic states (Format: YYYY-MM-DD)
    // Exam date is set dynamically in the app based on this config
    examDate: "2026-08-11",

    panicLevels: {
        relaxed: {
            color: "#4ade80", // Green
            label: "[ PANIC LEVEL: CHILL ]",
            media: "/assets/memes/cr7_meme.gif"
        },
        warning: {
            color: "#facc15", // Yellow
            label: "[ PANIC LEVEL: AWARENESS ]",
            media: "/assets/memes/jack-oggy-juice-kahan-gaya.gif"
        },
        panic: {
            color: "#f97316", // Orange
            label: "[ PANIC LEVEL: PANIC ]",
            media: "/assets/memes/abhijeet-cid-meme.gif"
        },
        critical: {
            color: "#ef4444", // Red
            label: "[ PANIC LEVEL: SPEEDRUN MODE ]",
            media: "/assets/memes/praying.gif"
        }
    },

    examMessages: {
        earlyBird: [
            "Oho bhai. Itni jaldi paper dhoond raha hai?",
            "Iss baar toppr banne ka plan hai?"
        ],
        oneMonth: [
            "Abhi to bohot time hai, assignment likh",
            "wo reel bheji hai react to karde bhai"
        ],
        oneWeek: [
            "aree sir abhi to ek week hai, aap badme ana",
            "dukan se saaman leke aa phir padhna."
        ],
        oneDay: [
            "ek din me kitna he padhlega",
            "syllabus se deleted topic to nhi padhraha na?"
        ],
        examDay: [
            "next sem dedena bhai",
            "23 marks ka to padhle bhai"
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
};
