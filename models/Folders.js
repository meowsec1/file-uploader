const prisma = require('../config/prismaClient.js');

async function getFolders(userId) {
  return await prisma.folder.findMany({
    where: { userId },
  });
}

async function getFolder(userId, folderId) {
  return await prisma.folder.findFirst({
    where: {
      id: folderId,
      userId,
    },
  });
}

async function createFolder(userId, name) {
  return await prisma.folder.create({
    data: {
      name,
      userId,
    },
  });
}

async function updateFolder(userId, folderId, name) {
  const updated = await prisma.folder.updateMany({
    where: {
      id: folderId,
      userId,
    },
    data: { name },
  });
  return updated.count;
}

async function deleteFolder(userId, folderId) {
  const folder = await prisma.folder.findFirst({
    where: {
      id: folderId,
      userId
    }
  });
  
  if (!folder) return null;
  
  return await prisma.folder.delete({
    where: { id: folderId }
  });
}

module.exports = {
  getFolders,
  getFolder,
  createFolder,
  updateFolder,
  deleteFolder,
};
