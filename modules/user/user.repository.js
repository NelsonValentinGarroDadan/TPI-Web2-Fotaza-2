const { User } = require("../../models/index");

module.exports = {
    getProfileById: (id) => User.findByPk(id, {
        attributes: ['id', 'nickname', 'biography', 'profile_img'],
    }),

    getUserByNickName: (nickname) => User.findOne({ where: { nickname } }),

    createUser: (user) => User.create(user),

    updateUser: (id, data) => User.update(data, { where: { id } }),
};
