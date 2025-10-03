const prisma = require('../prismaClient.js');
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

module.exports = {
    createUser,
    findUser
}
