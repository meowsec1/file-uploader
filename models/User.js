const prisma = require('../config/prismaClient.js');
const passwordUtils = require('../utils/passwordUtils.js');


async function createUser(username, password) {
    const user = await prisma.user.create({
    data: {
        username,
        hashedPassword: await passwordUtils.genHashedPassword(password),
    },
    })
    return user;
}

async function findUser(username) {
    const user = await prisma.user.findUnique({
        where : {
            username: username
        }
    })
    return user;
}

async function findUserById(id) {
    return prisma.user.findUnique({
        where: { id },
        // include: { profile: true, roles: true } // automatically get related data
    });
}

module.exports = {
    createUser,
    findUser,
    findUserById,
}
