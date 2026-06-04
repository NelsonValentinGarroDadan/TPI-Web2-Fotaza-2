const userRepository = require("./user.repository");
const AppError = require("../../errors/appError");

module.exports = {
    getProfile: async (id) => {
        const user = await userRepository.getProfileById(id);

        if (!user) throw new AppError(404, "Usuario no encontrado");

        // mixins generados por las asociaciones belongsToMany de User
        const [followers, following] = await Promise.all([
            user.countFollowers(),
            user.countFollowing(),
        ]);

        return { ...user.toJSON(), followers, following };
    },

    updateProfile: async (id, data) => {
        const fields = {};

        if (data.nickname !== undefined) {
            const userExist = await userRepository.getUserByNickName(data.nickname);

            if (userExist && userExist.id !== id)
                throw new AppError(400, `El nickname '${data.nickname}' ya esta en uso, intenta con otro.`);

            fields.nickname = data.nickname;
        }

        if (data.biography !== undefined) fields.biography = data.biography;

        if (data.profile_img !== undefined) fields.profile_img = data.profile_img;

        await userRepository.updateUser(id, fields);

        return userRepository.getProfileById(id);
    },
};
