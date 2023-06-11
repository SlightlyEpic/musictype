import { Router } from 'express';

import getSongList from './apiRoutes/getSongList.js';
import getSongMetadata from './apiRoutes/getSongMetadata.js';

let router = Router();

router.get('/getSongList', getSongList);
router.get('/getSongMetadata/:name?', getSongMetadata);

export default router;
