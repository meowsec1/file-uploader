const prisma = require('../prismaClient.js');

async function createSharedLink(url, expiresAt, folderId, userId) {
    return await prisma.sharedLink.create({
        data: {
            url,
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

module.exports = {
    createSharedLink,
    deleteSharedLink,
}