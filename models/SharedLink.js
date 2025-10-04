const prisma = require('../config/prismaClient.js');

async function createSharedLink(userId, folderId, hash, expiresAt) {
    return await prisma.sharedLink.create({
        data: {
            hash,
            expiresAt,
            folderId,
            userId
        }
    });
}

async function deleteSharedLink(linkId) {
    return await prisma.sharedLink.delete({
        where: { id: linkId }
    });
}

async function getSharedFolderData(hash) {
    const sharedLink = await prisma.sharedLink.findFirst({
        where: {
            hash,
            expiresAt: {
                gt: new Date()
            }
        },
        include: {
            folder: {
                include: {
                    files: true
                }
            }
        }
    });
    
    if (!sharedLink) return null;
    
    return sharedLink.folder;
}


module.exports = {
    createSharedLink,
    deleteSharedLink,
    getSharedFolderData,
}