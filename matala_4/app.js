//מגישים דניאל ברששת ולאון מברין
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // נקה את הנתיב מפרמטרים והסר /templates/ אם הוא קיים ב-URL
    let safeUrl = req.url.replace(/^\/templates/, '');

    // ברירת מחדל לדף הבית
    if (safeUrl === '/' || safeUrl === '') {
        safeUrl = '/page.html';
    }

    // בנה את הנתיב המלא לקובץ בתוך תיקיית templates
    const filePath = path.join(__dirname, 'templates', safeUrl);

    // זיהוי סוג הקובץ (Content-Type)
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'text/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // קריאת הקובץ והחזרתו
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>404 - הקובץ לא נמצא</h1>');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`שגיאת שרת: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
