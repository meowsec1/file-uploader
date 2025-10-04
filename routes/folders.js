const { Router } = require('express');
const passport = require('passport');


const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

const foldersController = require('../controllers/foldersController.js');
const filesController = require('../controllers/filesController.js');

const authenticateJwt = require('../middleware/authenticateJwt.js');

const foldersRouter = Router();

const shareRouter = Router();

shareRouter.get('/share/:hash', foldersController.getSharedFolder);


foldersRouter.get('/', authenticateJwt, foldersController.getFolders);
foldersRouter.post('/', authenticateJwt, foldersController.createFolder);
foldersRouter.put('/:folderId', authenticateJwt, foldersController.updateFolder);
foldersRouter.delete('/:folderId', authenticateJwt, foldersController.deleteFolder);

foldersRouter.get('/:folderId', authenticateJwt, foldersController.getFolder);

foldersRouter.post('/:folderId/new', authenticateJwt, foldersController.createShareLink);


foldersRouter.get('/:folderId/files', authenticateJwt, filesController.getFiles);
foldersRouter.post('/:folderId/files', authenticateJwt, upload.single('file'), filesController.createFile);
// foldersRouter.put()
foldersRouter.delete('/:folderId/files/:fileId', authenticateJwt, filesController.deleteFile);



module.exports = {
    foldersRouter,
    shareRouter,
};
