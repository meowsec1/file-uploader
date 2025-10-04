const db = require('../models/Folders.js');
const sharedLinkDb = require('../models/SharedLink.js');
const crypto = require('crypto');
const s3Utils = require('../utils/s3Utils.js');

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
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array()
            })
        }
        const { name } = req.body;
        const userId = req.user.id;
        const folder = await db.createFolder(userId, name);
        res.json({
            success: true,
            data: folder,
        });
    }
]

async function getFolder(req, res) {
    const userId = req.user.id;
    const folderId = Number(req.params.folderId);
    const folder = await db.getFolder(userId, folderId);
    res.json({
        success: true,
        data: folder
    })
}

async function getFolders(req, res) {
    const userId = req.user.id;
    const folders = await db.getFolders(userId);
    res.json({
        success: true,
        data: folders
    });
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
        res.json({
            success: true,
            data: updatedFolder
        });
    }
]

async function deleteFolder(req, res) {
    const userId = req.user.id;
    const folderId = Number(req.params.folderId);
    const deletedFolder = await db.deleteFolder(userId, folderId);
    res.json({
        success: true,
        data: { id: deletedFolder.id }
    });
}



async function createShareLink(req, res) {
    const userId = req.user.id;
    const folderId = Number(req.params.folderId);
    
    // create a hash
    const hash = crypto.randomUUID();

    const expiresAt = new Date(new Date().setDate(new Date().getDate() + 1)); // tomorrow

    const sharedLink = await sharedLinkDb.createSharedLink(userId, folderId, hash, expiresAt);
    console.log(sharedLink);

    res.json({
        success: true,
        data: sharedLink,
    })

}

async function getSharedFolder(req, res) {
    const hash = req.params.hash

    const data = await sharedLinkDb.getSharedFolderData(hash);
    console.log(data)
    console.log(data.files)
    

    const filesWithUrls = await Promise.all(
        data.files.map(async (file) => {
          const url = await s3Utils.getPresignedUrl(file.key);
          return {
            id: file.id,
            name: file.name,
            url,
          };
        })
      );

    res.json({
        success: true,
        data: { ...data, files: filesWithUrls }
    })
}

module.exports = {
    createFolder,
    getFolders,
    getFolder,
    updateFolder,
    deleteFolder,
    createShareLink,
    getSharedFolder,
}
