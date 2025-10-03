const db = require('../models/Files.js');
const folderDb = require('../models/Folders.js');
const s3Utils = require('../utils/s3Utils.js');

async function getFiles(req, res) {
    const userId = req.user.id;
    const folderId = Number(req.params.folderId);

    const files = await db.getFiles(userId, folderId);
    const urls = await Promise.all(files.map(async (file) => {
        return await s3Utils.getPresignedUrl(file.key);
    }))

    res.send(urls);
}

async function createFile(req, res) {
    const userId = req.user.id;
    const folderId = Number(req.params.folderId);
    const name = req.file.originalname;

    const key = `uploads/${userId}/${folderId}/${Date.now()}--${name}`;

    // upload to s3
    s3Utils.uploadFile(req.file, key);

    const folder = await folderDb.getFolder(folderId)
    if (!folder || folder.userId !== userId) {
        return res.status(403).json({ error: "You do not own this folder" });
    }

    const file = await db.createFile(folderId, name, key);
    res.json(file);
}

async function deleteFile(req, res) {
    const userId = req.user.id;
    const fileId = Number(req.params.fileId);

    // should delete file from aws first
    const file = await db.getFile(userId, fileId);
    const key = file.key;
    await s3Utils.deleteFile(key);
    console.log("Deleted from AWS");

    const deleted = await db.deleteFile(userId, fileId);
    if (!deleted) {
        return res.status(404).json({ error: "File not found or unauthorized" });
    }

    res.json({ message: "File deleted" });
}

module.exports = {
    getFiles,
    createFile,
    deleteFile,
}
