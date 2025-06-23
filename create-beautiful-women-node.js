// Simple script to create placeholder image files for Beautiful Women category
const fs = require('fs');
const path = require('path');

const beautifulWomen = [
    'emma-watson', 'scarlett-johansson', 'gal-gadot', 'margot-robbie', 
    'jennifer-lawrence', 'angelina-jolie', 'charlize-theron', 'natalie-portman',
    'anne-hathaway', 'emma-stone', 'blake-lively', 'mila-kunis',
    'jessica-alba', 'megan-fox', 'keira-knightley', 'rachel-mcadams',
    'zendaya', 'taylor-swift', 'ariana-grande', 'selena-gomez',
    'bella-hadid', 'gigi-hadid', 'kendall-jenner', 'hailey-bieber',
    'emily-ratajkowski', 'adriana-lima', 'candice-swanepoel', 'miranda-kerr',
    'karlie-kloss', 'rosie-huntington', 'irina-shayk', 'dua-lipa',
    'rihanna', 'beyonce', 'jennifer-lopez', 'priyanka-chopra',
    'deepika-padukone', 'aishwarya-rai', 'freida-pinto', 'lupita-nyongo',
    'zoe-saldana', 'thandie-newton', 'halle-berry', 'monica-bellucci',
    'penelope-cruz', 'salma-hayek', 'fan-bingbing', 'liu-yifei'
];

// Create the directory
const dir = path.join(__dirname, 'images', 'beautiful-women');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// Create simple placeholder SVG files (which browsers can display as images)
beautifulWomen.forEach((name, index) => {
    const displayName = name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const colors = [
        '#FF1493', // Deep Pink
        '#FF69B4', // Hot Pink
        '#FFB6C1', // Light Pink
        '#FFC0CB', // Pink
        '#DA70D6', // Orchid
        '#DDA0DD', // Plum
        '#EE82EE', // Violet
        '#FF6347'  // Tomato
    ];
    
    const color = colors[index % colors.length];
    
    const svg = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0.8" />
            </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#grad${index})"/>
        <circle cx="200" cy="150" r="60" fill="white" opacity="0.3"/>
        <text x="200" y="300" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle" stroke="#000" stroke-width="1">${displayName}</text>
        <text x="200" y="350" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" opacity="0.8">Beautiful Women</text>
    </svg>`;
    
    const filename = path.join(dir, `${name}.jpg`);
    
    // For now, create SVG files that browsers can display
    // In a real scenario, you'd want to use actual photos
    fs.writeFileSync(filename.replace('.jpg', '.svg'), svg);
    console.log(`Created placeholder: ${name}.svg`);
});

console.log(`\nCreated ${beautifulWomen.length} placeholder images in ${dir}`);
console.log('Note: These are SVG placeholders. In production, replace with actual photos.');
