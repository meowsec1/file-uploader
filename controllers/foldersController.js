const db = require('../models/Folders.js');
const { body, validationResult } = require('express-validator');

const validateFolder = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3, max: 20 }).withMessage('Name must be between 3 and 20 characters')
        .isAlphanumeric().withMessage('Name must contain only letters and numbers'),
]

const createFolder = [
    validateFolder,
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { name } = req.body;
        const userId = req.user.id;
        const folder = await db.createFolder(userId, name);
        res.send(folder);
    }
]

async function getFolders(req, res) {
    const userId = req.user.id;
    const folders = await db.getFolders(userId);
    res.send(folders);
}

const updateFolder = [
    validateFolder,
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const userId = req.user.id;
        const folderId = Number(req.params.folderId);
        const { name } = req.body
        const updatedFolder = await db.updateFolder(userId, folderId, name);
        res.send(updatedFolder);
    }
]

async function deleteFolder(req, res) {
    const userId = req.user.id;
    const folderId = Number(req.params.folderId);
    const deletedFolder = await db.deleteFolder(userId, folderId);
    res.send(deletedFolder);
}

module.exports = {
    createFolder,
    getFolders,
    updateFolder,
    deleteFolder,
}
