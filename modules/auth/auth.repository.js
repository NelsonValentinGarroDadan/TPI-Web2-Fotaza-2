const { User } = require("../../models/index");
module.exports = {
    getUserByNickName : (nickname) => {
        return User.findOne({ where : { nickname }})
    },
};