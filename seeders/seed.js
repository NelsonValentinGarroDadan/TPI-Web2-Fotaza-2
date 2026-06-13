require("dotenv").config();
const bcrypt = require("bcrypt");
const cloudinary = require("../config/cloudinary");
const { signBuffer } = require("../utils/watermark");
const { sequelize, User, Publication, Image, Tag, Rating, Comment, Collection, Report, Conversation, Message, Notification } = require("../models");

const PASSWORD = "Password123!";

const fetchBuffer = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`No se pudo descargar ${url} (${res.status})`);
    return Buffer.from(await res.arrayBuffer());
};

const uploadSeedBuffer = (buffer) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "fotaza/seed" },
            (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(buffer);
    });

const resolveImageUrl = async (sourceUrl, text) => {
    if (!text) return sourceUrl;
    const signed = await signBuffer(await fetchBuffer(sourceUrl), text);
    const uploaded = await uploadSeedBuffer(signed);
    return uploaded.secure_url;
};

const IMAGE_URLS = [
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066377/fotaza/seed/rsppiufxbziyltndewmk.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066379/fotaza/seed/griugeevjrdeyakyj6ox.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066382/fotaza/seed/mozk05az3qoj3jejpb8f.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066386/fotaza/seed/dw0pobvmzh1nhkwq34vp.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066387/fotaza/seed/dx68qtixloyidbbtxekk.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066390/fotaza/seed/z4ae6n9qptw2wzspcdrs.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066394/fotaza/seed/r5ajtvqfjyafr9ba3zia.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066396/fotaza/seed/s2bf7fwohii7v7uc1dkt.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066399/fotaza/seed/j23oditv0j3gpe8cocmv.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066402/fotaza/seed/jyvsuzx25z4lq6rvmn7u.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066404/fotaza/seed/pszyewerlgvbgrsdajrr.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066408/fotaza/seed/nycirvezsruhakrulujv.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066410/fotaza/seed/efq8e6b6fslqrbugkmws.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066412/fotaza/seed/rznl3kksz5f49cgmlu5d.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066415/fotaza/seed/y5rvyo13ihtcbkbgvvnb.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066417/fotaza/seed/sxvcchgkzmexbeui5zrr.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066420/fotaza/seed/osdcpl2ktk7va2c8n4rf.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066424/fotaza/seed/onmcyi6ssxrbkicdmfad.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066427/fotaza/seed/afrv0j9z25qikxg6jj9c.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066428/fotaza/seed/p1ekrcax0h9a5kaa5uuy.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066431/fotaza/seed/hky71mbzuckmkkiojrr2.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066433/fotaza/seed/g3prw4e2zmczustqhgde.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066435/fotaza/seed/vhoxlnjuyabz7okb8x6d.jpg",
    "https://res.cloudinary.com/dkoff52tr/image/upload/v1781066437/fotaza/seed/k4xva80sufll6o5yfead.jpg",
];

const imagePool = () =>
    IMAGE_URLS.length
        ? IMAGE_URLS
        : Array.from({ length: 24 }, (_, i) => `https://picsum.photos/seed/fotaza${i + 1}/1200/900`);

const USERS = [
    { nickname: "admin", is_admin: true, biography: "Validador de contenidos / administrador del sitio." },
    { nickname: "ana", biography: "Fotografa de paisajes y atardeceres." },
    { nickname: "beto", biography: "Ciudad, arquitectura y vida urbana." },
    { nickname: "caro", biography: "Retratos y blanco y negro." },
    { nickname: "dami", biography: "Naturaleza, fauna y aventura." },
    { nickname: "eli", biography: "Viajera, fotos de todo el mundo." },
];

const PUBLICATIONS = [
    { author: 1, title: "Atardecer en la costa", description: "Tarde dorada sobre el mar.", tags: ["atardecer", "mar", "paisaje"], images: 2, license: "sin_copyright" },
    { author: 1, title: "Montañas al amanecer", description: "Primera luz sobre la cordillera.", tags: ["montaña", "amanecer", "paisaje"], images: 3, license: "sin_copyright" },
    { author: 1, title: "Lago espejo", description: "Reflejos perfectos en el agua.", tags: ["lago", "paisaje", "naturaleza"], images: 1, license: "copyright" },
    { author: 2, title: "Luces de la ciudad", description: "La city de noche desde un mirador.", tags: ["ciudad", "noche", "arquitectura"], images: 2, license: "sin_copyright" },
    { author: 2, title: "Geometria urbana", description: "Lineas y formas entre edificios.", tags: ["arquitectura", "ciudad", "abstracto"], images: 2, license: "copyright" },
    { author: 3, title: "Miradas", description: "Serie de retratos en estudio.", tags: ["retrato", "estudio", "personas"], images: 3, license: "sin_copyright" },
    { author: 3, title: "Blanco y negro", description: "Contrastes y texturas en monocromo.", tags: ["retrato", "blanco-y-negro", "personas"], images: 1, license: "sin_copyright" },
    { author: 4, title: "Fauna salvaje", description: "Animales en su habitat.", tags: ["fauna", "naturaleza", "animales"], images: 2, license: "sin_copyright" },
    { author: 4, title: "Bosque profundo", description: "Caminata entre arboles centenarios.", tags: ["bosque", "naturaleza", "verde"], images: 2, license: "sin_copyright" },
    { author: 5, title: "Postales de viaje", description: "Lugares que visite este año.", tags: ["viaje", "paisaje", "ciudad"], images: 3, license: "sin_copyright" },
    { author: 5, title: "Playas escondidas", description: "Rincones de arena y mar.", tags: ["playa", "mar", "viaje"], images: 1, license: "copyright" },
    { author: 0, title: "Galeria destacada", description: "Seleccion del equipo de Fotaza.", tags: ["destacado", "varios"], images: 2, license: "sin_copyright" },
];

const COMMENTS = [
    "Que buena toma!",
    "Me encanta la luz.",
    "Espectacular composicion.",
    "Esta me la guardo de referencia.",
    "Increibles colores.",
    "La quiero para mi coleccion.",
    "Tremendo encuadre.",
    "Me transmite mucha paz.",
];

const FOLLOWS = [
    [1, 2], [1, 3], [1, 4],
    [2, 1], [2, 5],
    [3, 1], [3, 2],
    [4, 5], [4, 1],
    [5, 1], [5, 2], [5, 3],
    [0, 1], [0, 2],
];

const seed = async () => {
    await sequelize.authenticate();

    await sequelize.query(
        'TRUNCATE TABLE "Notifications","Messages","Conversations","Reports","collections_publications","Collections","Ratings","Comments","images_tags","Images","Tags","Publications","Followers","Users" RESTART IDENTITY CASCADE;'
    );

    const hash = await bcrypt.hash(PASSWORD, await bcrypt.genSalt(10));
    const users = await User.bulkCreate(
        USERS.map((u) => ({
            nickname: u.nickname,
            password: hash,
            biography: u.biography,
            profile_img: null,
            is_admin: Boolean(u.is_admin),
            active: true,
        })),
        { returning: true }
    );

    const tagTitles = [...new Set(PUBLICATIONS.flatMap((p) => p.tags))];
    const tags = {};
    for (const title of tagTitles) {
        const [tag] = await Tag.findOrCreate({ where: { title } });
        tags[title] = tag;
    }

    const pool = imagePool();
    let imgCursor = 0;
    const allImages = [];
    const createdPublications = [];
    const notifications = [];
    const pushNotification = (data) =>
        notifications.push({ ...data, read_at: notifications.length % 3 === 0 ? new Date() : null });

    for (const p of PUBLICATIONS) {
        const author = users[p.author];
        const pub = await Publication.create({
            user_id: author.id,
            title: p.title,
            description: p.description,
            comments_enabled: true,
            deleted: false,
        });

        const tagInstances = p.tags.map((t) => tags[t]);

        for (let k = 0; k < p.images; k++) {
            const sourceUrl = pool[imgCursor % pool.length];
            imgCursor++;

            const license = p.license || "sin_copyright";
            const text = license === "copyright" ? author.nickname : null;
            const url = await resolveImageUrl(sourceUrl, text);

            const image = await Image.create({
                publication_id: pub.id,
                url,
                text_markwater: text,
                license,
                order_number: k,
            });
            await image.addTags(tagInstances);

            allImages.push({ image, authorId: author.id });
        }

        createdPublications.push(pub);
    }

    for (let i = 0; i < allImages.length; i++) {
        const { image, authorId } = allImages[i];
        const raters = users.filter((u) => u.id !== authorId);
        const howMany = 2 + (i % Math.min(3, raters.length));

        for (let j = 0; j < howMany; j++) {
            const rater = raters[(i + j) % raters.length];
            const value = 1 + ((i + j * 2) % 5);
            await Rating.create({ user_id: rater.id, image_id: image.id, value });

            if (j === 0)
                pushNotification({ user_id: authorId, actor_id: rater.id, type: "rating", image_id: image.id });
        }
    }

    const allComments = [];
    for (let i = 0; i < allImages.length; i++) {
        if (i % 2 !== 0) continue;
        const { image, authorId } = allImages[i];
        const commenters = users.filter((u) => u.id !== authorId);
        const commenter = commenters[i % commenters.length];
        const comment = await Comment.create({
            user_id: commenter.id,
            image_id: image.id,
            content: COMMENTS[i % COMMENTS.length],
        });
        allComments.push({ comment, authorId, commenterId: commenter.id });
        pushNotification({ user_id: authorId, actor_id: commenter.id, type: "comment", image_id: image.id });
    }

    for (const [a, b] of FOLLOWS) {
        await users[a].addFollowing(users[b].id);
        pushNotification({ user_id: users[b].id, actor_id: users[a].id, type: "follow", image_id: null });
    }

    const COLLECTIONS = [
        { owner: 1, name: "Favoritos", pubs: [1, 5, 7] },
        { owner: 1, name: "Inspiracion", pubs: [3, 8] },
        { owner: 2, name: "Paisajes", pubs: [0, 1, 9] },
        { owner: 3, name: "Ideas", pubs: [4, 6] },
    ];

    for (const c of COLLECTIONS) {
        const collection = await Collection.create({
            user_id: users[c.owner].id,
            name: c.name,
        });
        for (const idx of c.pubs) {
            if (createdPublications[idx]) await collection.addPublication(createdPublications[idx].id);
        }
    }

    // Denuncias de imagenes (motivo + descripcion). Las publicaciones con denuncias quedan bloqueadas para edicion.
    // La imagen idx 5 junta 4 denuncias de usuarios distintos (supera el umbral de 3 -> cola del validador).
    const IMAGE_REPORTS = [
        { imageIdx: 0, reporter: 2, reason: "inapropiado", description: "La imagen no corresponde con la descripcion de la publicacion." },
        { imageIdx: 0, reporter: 3, reason: "spam", description: "Parece contenido repetido o spam." },
        { imageIdx: 5, reporter: 2, reason: "derechos", description: "Creo que esta imagen infringe derechos de autor." },
        { imageIdx: 5, reporter: 3, reason: "inapropiado", description: "Contenido inapropiado para la comunidad." },
        { imageIdx: 5, reporter: 4, reason: "otro", description: "No deberia estar publicada." },
        { imageIdx: 5, reporter: 5, reason: "violencia", description: "Contiene contenido sensible." },
    ];

    let imageReports = 0;
    for (const r of IMAGE_REPORTS) {
        const target = allImages[r.imageIdx];
        if (!target) continue;
        await Report.create({
            user_id: users[r.reporter].id,
            image_id: target.image.id,
            reason: r.reason,
            description: r.description,
        });
        imageReports++;
    }

    // Denuncia de un comentario: la revisa el autor de la publicacion desde su perfil.
    let commentReports = 0;
    const firstComment = allComments[0];
    if (firstComment) {
        const reporter = users.find((u) => u.id !== firstComment.commenterId && u.id !== firstComment.authorId);
        if (reporter) {
            await Report.create({
                user_id: reporter.id,
                comment_id: firstComment.comment.id,
                reason: "inapropiado",
                description: "El comentario tiene lenguaje ofensivo.",
            });
            commentReports++;
            pushNotification({ user_id: firstComment.authorId, actor_id: reporter.id, type: "report", image_id: firstComment.comment.image_id });
        }
    }

    const flaggedUser = users[2];
    let deletedScenarioPubs = 0;
    let blockScenarioReports = 0;

    for (let k = 0; k < 2; k++) {
        const deletedPub = await Publication.create({
            user_id: flaggedUser.id,
            title: k === 0 ? "Sesion sin permiso" : "Reposteo no autorizado",
            description: "Publicacion dada de baja por el validador.",
            comments_enabled: true,
            deleted: true,
        });
        await Image.create({
            publication_id: deletedPub.id,
            url: pool[imgCursor++ % pool.length],
            text_markwater: null,
            license: "sin_copyright",
            order_number: 0,
        });
        deletedScenarioPubs++;
    }

    const flaggedPub = await Publication.create({
        user_id: flaggedUser.id,
        title: "Material en revision",
        description: "Publicacion con denuncias pendientes de revision.",
        comments_enabled: true,
        deleted: false,
    });
    const flaggedImage = await Image.create({
        publication_id: flaggedPub.id,
        url: pool[imgCursor++ % pool.length],
        text_markwater: null,
        license: "sin_copyright",
        order_number: 0,
    });

    const flaggedReporters = users.filter((u) => u.id !== flaggedUser.id).slice(0, 2);
    for (const reporter of flaggedReporters) {
        await Report.create({
            user_id: reporter.id,
            image_id: flaggedImage.id,
            reason: "inapropiado",
            description: "El contenido no respeta las normas de la comunidad.",
        });
        blockScenarioReports++;
    }

    const CHAT = [
        "Hola! Me interesa obtener esta imagen.",
        "Hola! Si, claro. Que uso le queres dar?",
        "Es para la portada de un blog de viajes. Cuanto saldria la licencia?",
        "Te paso los detalles por aca y arreglamos un precio.",
    ];

    const copyrightImages = allImages.filter((x) => x.image.license === "copyright");
    let conversationCount = 0;
    let messageCount = 0;

    for (let i = 0; i < copyrightImages.length; i++) {
        const { image, authorId } = copyrightImages[i];
        const buyer = users.find((u) => u.id !== authorId);
        if (!buyer) continue;

        const conversation = await Conversation.create({
            image_id: image.id,
            buyer_id: buyer.id,
            seller_id: authorId,
        });
        conversationCount++;
        pushNotification({ user_id: authorId, actor_id: buyer.id, type: "interest", image_id: image.id });

        const howMany = 2 + (i % 3);
        for (let j = 0; j < howMany; j++) {
            const fromBuyer = j % 2 === 0;
            await Message.create({
                conversation_id: conversation.id,
                sender_id: fromBuyer ? buyer.id : authorId,
                image_id: j === 0 ? image.id : null,
                content: CHAT[j % CHAT.length],
                read_at: j < howMany - 1 ? new Date() : null,
            });
            messageCount++;
        }
    }

    if (notifications.length) await Notification.bulkCreate(notifications);

    console.log("Seed completo.");
    console.log(`  usuarios: ${users.length} (password para todos: ${PASSWORD})`);
    console.log(`  publicaciones: ${PUBLICATIONS.length}`);
    console.log(`  imagenes: ${allImages.length}${IMAGE_URLS.length ? "" : " (placeholders picsum, completa IMAGE_URLS para usar las tuyas)"}`);
    console.log(`  colecciones: 4`);
    console.log(`  denuncias: ${imageReports} de imagenes, ${commentReports} de comentarios`);
    console.log(`  escenario bloqueo (${flaggedUser.nickname}): ${deletedScenarioPubs} publicaciones borradas + 1 publicacion con ${blockScenarioReports} denuncias`);
    console.log(`  conversaciones: ${conversationCount}, mensajes: ${messageCount}`);
    console.log(`  notificaciones: ${notifications.length}`);

    await sequelize.close();
};

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
