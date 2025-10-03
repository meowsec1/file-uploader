const prisma = require('../prismaClient.js');


async function getFolders(userId) {
    const folders = await prisma.folder.findMany({
        where: {
            userId
        }
    })
    return folders;
}

async function createFolder(name, userId) {
    const folder = await prisma.folder.create({
        data: {
            name,
            userId,
        }
    })
    return folder;
}

async function updateFolder(folderId, title) {
    const updatedFolder = await prisma.folder.update({
        where: {
            id: folderId
        },
        data: {
            name: title
        }
    })
    return updatedFolder;
}

async function deleteFolder(folderId) {
    const deletedFolder = await prisma.folder.delete({
        where: {
            id: folderId
        }
    })
    return deletedFolder;
}

module.exports = {
    getFolders,
    createFolder,
    updateFolder,
    deleteFolder,
}