import fs from 'fs';
import path from 'path';
import _root from '../../_root.js';
import { Request, Response } from 'express';

let audioFiles: Set<string> = new Set(
    fs.readdirSync(path.join(_root, '/public/audio'))
    .filter(f => f.endsWith('.mp3'))
    .map(f => f.slice(0, -4))
);

let availableSongs = fs.readdirSync(path.join(_root, '/public/lyrics'))
    .filter(f => f.endsWith('.lrc'))
    .filter(f => audioFiles.has(f.slice(0, -4)))
    .map(f => f.slice(0, -4));

audioFiles = new Set();

export { availableSongs };

export default (req: Request, res: Response) => {
    res.status(200).json(availableSongs);
}
