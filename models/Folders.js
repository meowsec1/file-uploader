const prisma = require('../config/prismaClient.js');


async function getFolder(folderId) {
    const folder = await prisma.folder.findUnique({
        where: {
            id: folderId
        }
    })
    return folder;
}

async function getFolders(userId) {
    const folders = await prisma.folder.findMany({
        where: {
            userId
        }
    })
    return folders;
}

async function createFolder(userId, name) {
    const folder = await prisma.folder.create({
        data: {
            name,
            userId,
        }
    })
    return folder;
}

async function updateFolder(userId, folderId, name) {
    const updatedFolder = await prisma.folder.update({
        where: {
            id: folderId,
            userId
        },
        data: {
            name
        }
    })
    return updatedFolder;
}

async function deleteFolder(userId, folderId) {
    const deletedFolder = await prisma.folder.delete({
        where: {
            id: folderId,
            userId
        }
    })
    return deletedFolder;
}

module.exports = {
    getFolder,
    getFolders,
    createFolder,
    updateFolder,
    deleteFolder,
}