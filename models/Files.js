const prisma = require('../prismaClient.js');

async function getFiles(folderId) {
    return await prisma.file.findMany({
        where: {
            folderId
        }
    });
}

async function createFile(name, url, folderId) {
    return await prisma.file.create({
        data: {
            name,
            url,
            folderId
        }
    });
}

// Update a file (e.g. rename or change URL) do i even need this?
async function updateFile(fileId, data) {
    return await prisma.file.update({
        where: {
            id: fileId
        },
        data
    });
}

async function deleteFile(fileId) {
    return await prisma.file.delete({
        where: {
            id: fileId
        }
    });
}

module.exports = {
    getFiles,
    createFile,
    updateFile,
    deleteFile,
};
