import express from 'express';
import path from 'path';
import cors from 'cors';
import _root from './_root.js';

import apiRouter from '@routers/api.js';

let app = express();

if(import.meta.env.PROD) app.use(cors());
app.use('/api', apiRouter);
app.use(express.static(path.join(_root, '/public')));
if(import.meta.env.PROD) app.use(express.static(path.join(_root, '/clientDist')));

if(import.meta.env.PROD) app.get('/', (req, res) => res.sendFile('/clientDist/index.html', { root: _root }));
// app.get('/favicon.ico', (req, res) => res.sendFile('https://avatars.githubusercontent.com/u/42976178'));

if(import.meta.env.PROD) {
    app.listen(3000, () => {
        console.log('Listening on http://localhost:3000');
    })
}

export const viteNodeApp = app;
