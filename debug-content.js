const fs = require('fs');
const path = require('path');

const CONTENT_PATH = path.join(process.cwd(), 'content', 'tutoring.md');

try {
    if (!fs.existsSync(CONTENT_PATH)) {
        console.error('Content file not found at:', CONTENT_PATH);
        process.exit(1);
    }

    const fileContent = fs.readFileSync(CONTENT_PATH, 'utf-8');
    console.log('File read successfully. Size:', fileContent.length);

    //Regex from lib/content.ts
    const chapterRegex = /^# ?(\d+)장\.? ?(.*)$/gm;

    const matches = Array.from(fileContent.matchAll(chapterRegex));
    console.log('Matches found:', matches.length);

    for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        console.log(`Match ${i}: ID=${match[1]}, Title=${match[2]}`);
    }

    if (matches.length === 0) {
        console.error("No chapters found! Regex might be wrong or file encoding issue.");
        process.exit(1);
    }

    console.log('Parsing check passed.');
} catch (error) {
    console.error('Error during parsing:', error);
    process.exit(1);
}
