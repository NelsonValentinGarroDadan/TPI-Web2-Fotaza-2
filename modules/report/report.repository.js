const { Op, fn, col, where } = require("sequelize");
const { Report, Image, Publication, User } = require("../../models");

const DISTINCT_REPORTERS_THRESHOLD = 3;

module.exports = {
    createReport: (data) => Report.create(data),

    findImageReport: (userId, imageId) =>
        Report.findOne({ where: { user_id: userId, image_id: imageId } }),

    findCommentReport: (userId, commentId) =>
        Report.findOne({ where: { user_id: userId, comment_id: commentId } }),

    getFlaggedImageIds: async () => {
        const rows = await Report.findAll({
            attributes: ["image_id"],
            where: { image_id: { [Op.ne]: null } },
            group: ["image_id"],
            having: where(fn("COUNT", fn("DISTINCT", col("user_id"))), { [Op.gt]: DISTINCT_REPORTERS_THRESHOLD }),
            raw: true,
        });

        return rows.map((r) => r.image_id);
    },

    getImagesWithReports: (imageIds) =>
        imageIds.length
            ? Image.findAll({
                where: { id: { [Op.in]: imageIds } },
                attributes: ["id", "url", "license", "publication_id"],
                include: [
                    {
                        model: Publication,
                        as: "publication",
                        where: { deleted: false },
                        required: true,
                        attributes: ["id", "title", "description", "createdAt"],
                        include: [{
                            model: User,
                            as: "author",
                            attributes: ["id", "nickname", "profile_img", "active"],
                        }],
                    },
                    {
                        model: Report,
                        as: "reports",
                        attributes: ["id", "reason", "description", "createdAt"],
                        include: [{ model: User, as: "user", attributes: ["id", "nickname"] }],
                    },
                ],
                order: [["id", "DESC"]],
            })
            : Promise.resolve([]),

    deleteImageReports: (imageId) =>
        Report.destroy({ where: { image_id: imageId } }),

    deleteReport: (id) =>
        Report.destroy({ where: { id } }),

    getReportById: (id) => Report.findByPk(id),

    isImageStillFlagged: async (imageId) => {
        const reporters = await Report.count({
            where: { image_id: imageId },
            distinct: true,
            col: "user_id",
        });

        return reporters > DISTINCT_REPORTERS_THRESHOLD;
    },
};
