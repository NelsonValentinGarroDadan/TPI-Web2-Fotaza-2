const bcrypt = require("bcrypt");
const userRepository = require("../user/user.repository");
const AppError = require("../../errors/appError");
const { sign } = require("../../config/jwt");
module.exports = {
    register: async ( user  ) => {
        const userExist = await userRepository.getUserByNickName(user.nickname);

        if(userExist) throw new AppError(400, `El nickname'${user.nickname}' ya esta en uso , intenta con otro.`)

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(user.password, salt);


        return userRepository.createUser({ ...user , password : hashPass, profile_img: user.profile_img});
    },
    login: async (credentials) => {
        const userFound = await userRepository.getUserByNickName(credentials.nickname);

        if(!userFound) throw new AppError(400, "Nickname o contraseña incorrecta");

        if(!await bcrypt.compare(credentials.password,userFound.password)) throw new AppError(400, "Nickname o contraseña incorrecta");

        const token = sign({ id: userFound.id, is_admin: userFound.is_admin });

        return { token , user: { nickname: userFound.nickname, profile_img: userFound.profile_img, is_admin: userFound.is_admin}};
    },
};