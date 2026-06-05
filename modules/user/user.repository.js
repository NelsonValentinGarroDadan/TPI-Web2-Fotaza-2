const { User } = require("../../models/index");

module.exports = {
    getProfileById: (id) => User.findByPk(id, {
        attributes: ['id', 'nickname', 'biography', 'profile_img'],
    }),

    getUserByNickName: (nickname) => User.findOne({ where: { nickname } }),

    isFollowing: async (followerId, followedId) => {
        const viewer = await User.findByPk(followerId);
        if (!viewer) return false;
        return viewer.hasFollowing(followedId);
    },

    follow: async (followerId, followedId) => {
        const viewer = await User.findByPk(followerId);
        await viewer.addFollowing(followedId);
    },

    unfollow: async (followerId, followedId) => {
        const viewer = await User.findByPk(followerId);
        await viewer.removeFollowing(followedId);
    },

    createUser: (user) => User.create(user),

    updateUser: (id, data) => User.update(data, { where: { id } }),
};
