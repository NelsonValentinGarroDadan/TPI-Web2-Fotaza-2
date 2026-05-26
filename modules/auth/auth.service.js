require('dotenv').config();
const bcrypt = require("bcrypt"); 
const authRepository = require("./auth.repository");
const AppError = require("../../errors/appError");
module.exports = {
    register: async ( user  ) => {
        const userExist = await authRepository.getUserByNickName(user.nickname); 
        
        if(userExist) throw new AppError(400, `El nickname'${user.nickname}' ya esta en uso , intenta con otro.`)

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(user.password, salt);

        return authRepository.createUser({ ...user , password : hashPass});
    },
};