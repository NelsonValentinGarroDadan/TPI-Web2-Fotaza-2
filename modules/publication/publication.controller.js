const publicationService = require("./publication.service.js");
const userRepository = require("../user/user.repository.js");

const PAGE_SIZE = 6;

const paginate = (items, page) => {
    const start = (page - 1) * PAGE_SIZE;
    return {
        items: items.slice(start, start + PAGE_SIZE),
        hasMore: start + PAGE_SIZE < items.length,
    };
};

const pageParam = (req) => Math.max(1, Number(req.query.page) || 1);

const parseSearch = (q) => {
    const tags = [];
    const keywords = [];

    (q || "")
        .split(/\s+/)
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((token) => {
            if (token.startsWith("#")) {
                const tag = token.slice(1).toLowerCase();
                if (tag) tags.push(tag);
            } else {
                keywords.push(token.toLowerCase());
            }
        });

    return { tags, keywords };
};

const searchFilters = (req) => {
    const q = req.query.q || "";
    const { tags, keywords } = parseSearch(q);
    const minRating = req.query.minRating !== undefined && req.query.minRating !== ""
        ? Number(req.query.minRating)
        : undefined;
    const maxRating = req.query.maxRating !== undefined && req.query.maxRating !== ""
        ? Number(req.query.maxRating)
        : undefined;

    return { q, tags, keywords, minRating, maxRating };
};

const searchEndpoint = (filters) => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (Number.isFinite(filters.minRating)) params.set("minRating", filters.minRating);
    if (Number.isFinite(filters.maxRating)) params.set("maxRating", filters.maxRating);
    const qs = params.toString();
    return qs ? `/feed/search?${qs}` : "/feed/search";
};

module.exports = {
    homeRenderView: async (req, res) => {
        if (!req.user) return res.redirect("/foryou");

        const all = await publicationService.getFollowingFeed(req.user.id, {
            viewerId: req.user.id,
        });
        const { items, hasMore } = paginate(all, 1);

        res.render("publication/home.pug", { publications: items, hasMore, endpoint: "/feed/following" });
    },

    followingFeed: async (req, res) => {
        if (!req.user) return res.send("");

        const all = await publicationService.getFollowingFeed(req.user.id, {
            viewerId: req.user.id,
        });
        const { items } = paginate(all, pageParam(req));

        if (!items.length) return res.send("");
        res.render("components/cardsList.pug", { publications: items });
    },

    forYouRenderView: async (req, res) => {
        const all = await publicationService.getForYouFeed({
            authenticated: Boolean(req.user),
            viewerId: req.user?.id,
        });
        const { items, hasMore } = paginate(all, 1);

        res.render("publication/foryou.pug", { publications: items, hasMore, endpoint: "/feed/foryou" });
    },

    forYouFeed: async (req, res) => {
        const all = await publicationService.getForYouFeed({
            authenticated: Boolean(req.user),
            viewerId: req.user?.id,
        });
        const { items } = paginate(all, pageParam(req));

        if (!items.length) return res.send("");
        res.render("components/cardsList.pug", { publications: items });
    },

    searchRenderView: async (req, res) => {
        const filters = searchFilters(req);

        const all = await publicationService.getSearchFeed(filters, {
            authenticated: Boolean(req.user),
            viewerId: req.user?.id,
        });
        const { items, hasMore } = paginate(all, 1);

        res.render("publication/search.pug", {
            publications: items,
            hasMore,
            endpoint: searchEndpoint(filters),
            q: filters.q,
            minRating: req.query.minRating || "",
            maxRating: req.query.maxRating || "",
        });
    },

    searchFeed: async (req, res) => {
        const filters = searchFilters(req);

        const all = await publicationService.getSearchFeed(filters, {
            authenticated: Boolean(req.user),
            viewerId: req.user?.id,
        });
        const { items } = paginate(all, pageParam(req));

        if (!items.length) return res.send("");
        res.render("components/cardsList.pug", { publications: items });
    },

    uploadRenderView: async (req, res) => {
        const author = await userRepository.getProfileById(req.user.id);

        res.render("publication/upload.pug", { author, mode: "create", publication: null });
    },

    editRenderView: async (req, res) => {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) return res.redirect("/profile");

        const [author, publication] = await Promise.all([
            userRepository.getProfileById(req.user.id),
            publicationService.getPublicationForEdit(id, req.user.id),
        ]);

        if (!publication.canEdit) return res.redirect("/profile");

        res.render("publication/upload.pug", { author, mode: "edit", publication });
    },

    updatePublication: async (req, res) => {
        let meta = [];
        try {
            meta = JSON.parse(req.body.meta || "[]");
        } catch {
            meta = [];
        }

        const commentsEnabled = req.body.commentsEnabled === undefined
            ? undefined
            : req.body.commentsEnabled === "true";

        const result = await publicationService.updatePublication(
            Number(req.params.id),
            req.user.id,
            { title: req.body.title, description: req.body.description, tags: req.body.tags, commentsEnabled },
            req.files,
            meta
        );

        res.status(200).send({ id: result.id, message: "Publicacion actualizada!" });
    },

    createPublication: async (req, res) => {
        let meta = [];
        try {
            meta = JSON.parse(req.body.meta || "[]");
        } catch {
            meta = [];
        }

        const commentsEnabled = req.body.commentsEnabled === undefined
            ? undefined
            : req.body.commentsEnabled === "true";

        const publication = await publicationService.createPublication(
            req.user.id,
            { title: req.body.title, description: req.body.description, tags: req.body.tags, commentsEnabled },
            req.files,
            meta
        );

        res.status(201).send({ id: publication.id, message: "Publicacion creada!" });
    },

    rateImage: async (req, res) => {
        const result = await publicationService.rateImage(
            Number(req.params.id),
            req.user.id,
            req.body.value
        );

        res.status(201).send({ ...result, message: "Calificacion registrada!" });
    },

    createComment: async (req, res) => {
        const comment = await publicationService.createComment(
            Number(req.params.id),
            req.user.id,
            req.body.content
        );

        res.status(201).send({ comment, message: "Comentario publicado!" });
    },

    deleteComment: async (req, res) => {
        const result = await publicationService.deleteReportedComment(
            Number(req.params.id),
            req.user.id
        );

        res.status(200).send({ ...result, message: "Comentario eliminado." });
    },

    takedown: async (req, res) => {
        const result = await publicationService.takedown(Number(req.params.id));

        res.status(200).send({
            ...result,
            message: result.accountBlocked
                ? "Publicacion dada de baja. La cuenta del usuario fue inactivada."
                : "Publicacion dada de baja.",
        });
    },
};
