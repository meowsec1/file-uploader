const { Router } = require('express');
const passport = require('passport');


const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

const foldersController = require('../controllers/foldersController.js');
const filesController = require('../controllers/filesController.js');

const foldersRouter = Router();


foldersRouter.get('/', passport.authenticate('jwt', { session: false }), foldersController.getFolders);
foldersRouter.post('/', passport.authenticate('jwt', { session: false }), foldersController.createFolder);
foldersRouter.put('/:folderId', passport.authenticate('jwt', { session: false }), foldersController.updateFolder);
foldersRouter.delete('/:folderId', passport.authenticate('jwt', { session: false }), foldersController.deleteFolder);


foldersRouter.get('/:folderId/files', passport.authenticate('jwt', { session: false }), filesController.getFiles);
foldersRouter.post('/:folderId/files', passport.authenticate('jwt', { session: false }), upload.single('file'), filesController.createFile);
// foldersRouter.put()
foldersRouter.delete('/:folderId/files/:fileId', passport.authenticate('jwt', { session: false }), filesController.deleteFile);

module.exports = foldersRouter;
