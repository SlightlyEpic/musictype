import fs from 'fs';
import path from 'path';
import _root from '../../_root.js'
import getMP3Duration from 'get-mp3-duration';
import { availableSongs } from './getSongList.js';

import { Request, Response } from 'express';
import type { songMetadata } from '@mytypes/song.d.ts';

let metaMap: { [key: string]: songMetadata } = {};

for(let song of availableSongs) {
    metaMap[song] = {
        name: song,
        length: getMP3Duration(fs.readFileSync(path.join(_root, `/public/audio/${song}.mp3`))),
        songURL: `/audio/${song}.mp3`,
        lyricsURL: `/lyrics/${song}.lrc`,
        imageURL: fs.readFileSync(path.join(_root, `/public/lyrics/${song}.lrc`)).toString().split('\n', 2)[0].split(' ', 2)[1]
    };
}

export default (req: Request, res: Response) => {
    if(req.params.name && !availableSongs.includes(req.params.name)) return res.status(404).json({ error: 'Song does not exist' });
    
    if(!req.params.name) return res.status(200).json(metaMap);
    res.status(200).json(metaMap[req.params.name]);
}
