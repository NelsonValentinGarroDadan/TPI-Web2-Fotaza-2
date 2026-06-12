const userRepository = require("./user.repository");
const notificationService = require("../notification/notification.service");
const AppError = require("../../errors/appError");
const { avatarImage } = require("../../utils/cloudinaryUrl");

module.exports = {
    getProfile: async (id) => {
        const user = await userRepository.getProfileById(id);

        if (!user) throw new AppError(404, "Usuario no encontrado");
 
        const [followers, following] = await Promise.all([
            user.countFollowers(),
            user.countFollowing(),
        ]);

        return { ...user.toJSON(), profile_img: avatarImage(user.profile_img), followers, following };
    },

    getPublicProfile: async (targetId, viewerId) => {
        const user = await userRepository.getProfileById(targetId);

        if (!user) throw new AppError(404, "Usuario no encontrado");

        const [followers, following, isFollowing] = await Promise.all([
            user.countFollowers(),
            user.countFollowing(),
            userRepository.isFollowing(viewerId, targetId),
        ]);

        return { ...user.toJSON(), profile_img: avatarImage(user.profile_img), followers, following, isFollowing };
    },

    follow: async (viewerId, targetId) => {
        if (viewerId === targetId) throw new AppError(400, "No podes seguirte a vos mismo.");

        const target = await userRepository.getProfileById(targetId);
        if (!target) throw new AppError(404, "Usuario no encontrado");

        const already = await userRepository.isFollowing(viewerId, targetId);
        if (!already) {
            await userRepository.follow(viewerId, targetId);
            notificationService.notify({
                recipientId: targetId,
                actorId: viewerId,
                type: "follow",
            });
        }

        return { isFollowing: true };
    },

    unfollow: async (viewerId, targetId) => {
        await userRepository.unfollow(viewerId, targetId);

        return { isFollowing: false };
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
