const { Report } = require("../../models");

module.exports = {
    createReport: (data) => Report.create(data),

    findImageReport: (userId, imageId) =>
        Report.findOne({ where: { user_id: userId, image_id: imageId } }),

    findCommentReport: (userId, commentId) =>
        Report.findOne({ where: { user_id: userId, comment_id: commentId } }),
};
