const { Publication, Image, Tag } = require("../../models");

module.exports = {
    createPublication: (data, transaction) => Publication.create(data, { transaction }),

    createImage: (data, transaction) => Image.create(data, { transaction }),

    findOrCreateTag: (title, transaction) =>
        Tag.findOrCreate({ where: { title }, transaction }).then(([tag]) => tag),
};
