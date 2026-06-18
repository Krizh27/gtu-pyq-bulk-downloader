const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.replace(search, replace);
    }
    fs.writeFileSync(filePath, content);
}

const filesToRename = [
    'src/app.ts',
    'src/index.ts',
    'src/lib/logger.ts',
    'src/routes/health.ts',
    'src/routes/index.ts',
    'src/routes/pyq/index.ts',
    'src/api/index.ts',
    'src/api/generated/api.ts'
];

for (const file of filesToRename) {
    const fullPath = path.join('backend', file);
    if (fs.existsSync(fullPath)) {
        fs.renameSync(fullPath, fullPath.replace('.ts', '.js'));
    }
}

if (fs.existsSync('backend/src/api/generated/types')) {
    fs.rmSync('backend/src/api/generated/types', { recursive: true, force: true });
}

replaceInFile('backend/src/app.js', [
    [/import express, \{ type Express \} from "express";/, 'import express from "express";'],
    [/const app: Express = express\(\);/, 'const app = express();'],
    [/\.\/routes"/, './routes/index.js"'],
    [/\.\/lib\/logger"/, './lib/logger.js"']
]);

replaceInFile('backend/src/index.js', [
    [/\.\/app"/, './app.js"'],
    [/\.\/lib\/logger"/, './lib/logger.js"']
]);

replaceInFile('backend/src/routes/index.js', [
    [/import \{ Router, type IRouter \} from "express";/, 'import { Router } from "express";'],
    [/const router: IRouter = Router\(\);/, 'const router = Router();'],
    [/\.\/health"/, './health.js"'],
    [/\.\/pyq"/, './pyq/index.js"']
]);

replaceInFile('backend/src/routes/health.js', [
    [/import \{ Router, type IRouter \} from "express";/, 'import { Router } from "express";'],
    [/const router: IRouter = Router\(\);/, 'const router = Router();'],
    [/\.\.\/api"/, '../api/index.js"']
]);

replaceInFile('backend/src/routes/pyq/index.js', [
    [/import \{ Router, type IRouter \} from "express";/, 'import { Router } from "express";'],
    [/const router: IRouter = Router\(\);/, 'const router = Router();'],
    [/\.\.\/\.\.\/api"/, '../../api/index.js"'],
    [/function generateUrls\([\s\S]*?\): string\[\] \{/, `/**\n * @param {string} subjectCode\n * @param {string} course\n * @param {number} startYear\n * @param {number} endYear\n * @param {string[]} sessions\n * @returns {string[]}\n */\nfunction generateUrls(\n  subjectCode,\n  course,\n  startYear,\n  endYear,\n  sessions\n) {`],
    [/const urls: string\[\] = \[\];/, 'const urls = [];'],
    [/async \(req, res\): Promise<void> => \{/, 'async (req, res) => {']
]);

replaceInFile('backend/src/api/index.js', [
    [/export \* from "\.\/generated\/api";/, 'export * from "./generated/api.js";'],
    [/export \* from "\.\/generated\/types";\n/, '']
]);

console.log('Conversion successful!');
