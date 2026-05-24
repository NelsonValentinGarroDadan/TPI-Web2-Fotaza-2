const bcrypt = require("bcrypt"); 
const authRepository = require("./auth.repository");
const AppError = require("../../errors/appError");
module.exports = {
    register: async ( nickname  ) => {
        const userExist = await authRepository.getUserByNickName(nickname);
        if(userExist) throw AppError(400, `'${nickname}' ya esta en uso , elige otro nickname.`)
        console.log(userExist);
    },
};