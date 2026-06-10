require("dotenv").config();
const bcrypt = require("bcrypt");
const { sequelize, User, Publication, Image, Tag, Rating, Comment } = require("../models");

const PASSWORD = "Password123!";

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
        'TRUNCATE TABLE "Ratings","Comments","images_tags","Images","Tags","Publications","Followers","Users" RESTART IDENTITY CASCADE;'
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
            const url = pool[imgCursor % pool.length];
            imgCursor++;

            const license = p.license || "sin_copyright";
            const image = await Image.create({
                publication_id: pub.id,
                url,
                text_markwater: license === "copyright" ? author.nickname : null,
                license,
                order_number: k,
            });
            await image.addTags(tagInstances);

            allImages.push({ image, authorId: author.id });
        }
    }

    for (let i = 0; i < allImages.length; i++) {
        const { image, authorId } = allImages[i];
        const raters = users.filter((u) => u.id !== authorId);
        const howMany = 2 + (i % Math.min(3, raters.length));

        for (let j = 0; j < howMany; j++) {
            const rater = raters[(i + j) % raters.length];
            const value = 1 + ((i + j * 2) % 5);
            await Rating.create({ user_id: rater.id, image_id: image.id, value });
        }
    }

    for (let i = 0; i < allImages.length; i++) {
        if (i % 2 !== 0) continue;
        const { image, authorId } = allImages[i];
        const commenters = users.filter((u) => u.id !== authorId);
        const commenter = commenters[i % commenters.length];
        await Comment.create({
            user_id: commenter.id,
            image_id: image.id,
            content: COMMENTS[i % COMMENTS.length],
        });
    }

    for (const [a, b] of FOLLOWS) {
        await users[a].addFollowing(users[b].id);
    }

    console.log("Seed completo.");
    console.log(`  usuarios: ${users.length} (password para todos: ${PASSWORD})`);
    console.log(`  publicaciones: ${PUBLICATIONS.length}`);
    console.log(`  imagenes: ${allImages.length}${IMAGE_URLS.length ? "" : " (placeholders picsum, completa IMAGE_URLS para usar las tuyas)"}`);

    await sequelize.close();
};

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
