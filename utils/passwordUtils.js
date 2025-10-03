const bcrypt = require('bcrypt');

async function genHashedPassword(plainPassword) {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    return hashedPassword;
}


async function verifyPassword(plainPassword, hashedPassword) {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
}

module.exports = {
    genHashedPassword,
    verifyPassword,
}
