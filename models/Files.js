const prisma = require('../config/prismaClient.js');

async function getFiles(userId, folderId) {
    return await prisma.file.findMany({
        where: {
            folderId,
            folder: { userId }
        }
    });
}

async function getFile(userId, fileId) {
    return await prisma.file.findFirst({
        where: {
            id: fileId, 
            folder: { userId }
        }
    })
}

async function createFile(folderId, name, key) {
    return await prisma.file.create({
        data: {
            folderId,
            name,
            key,
        }
    });
}

// is this required?
async function updateFile(userId, fileId, data) {
    const updated = await prisma.file.updateMany({
        where: {
            id: fileId,
            folder: { userId } // ✅ Only updates if folder belongs to user
        },
        data
    });
    return updated.count; // 0 if nothing updated
}


async function deleteFile(userId, fileId) {
    // First verify ownership
    const file = await prisma.file.findFirst({
        where: {
            id: fileId,
            folder: { userId }
        }
    });
    
    if (!file) return null;
    
    // Then delete
    return await prisma.file.delete({
        where: { id: fileId }
    });
}

module.exports = {
    getFiles,
    getFile,
    createFile,
    updateFile,
    deleteFile,
};
