const buildQueueItem = (image) => ({
    imageId: image.id,
    url: image.url,
    license: image.license,
    publication: {
        id: image.publication.id,
        title: image.publication.title,
        description: image.publication.description,
        createdAt: image.publication.createdAt,
    },
    author: {
        id: image.publication.author.id,
        nickname: image.publication.author.nickname,
        profile_img: image.publication.author.profile_img,
        active: image.publication.author.active,
    },
    reports: image.reports
        .map((r) => ({
            id: r.id,
            reason: r.reason,
            description: r.description,
            createdAt: r.createdAt,
            reporter: r.user ? r.user.nickname : "usuario",
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    reportCount: image.reports.length,
});

module.exports = { buildQueueItem };
