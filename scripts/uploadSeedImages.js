require("dotenv").config();
const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const dir = path.join(__dirname, "seed-images");
const manifest = path.join(__dirname, "seed-images.json");

const run = async () => {
    if (!fs.existsSync(dir)) {
        console.error(`No existe la carpeta. Crea ${dir} y pone ahi las imagenes.`);
        process.exit(1);
    }

    const files = fs
        .readdirSync(dir)
        .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
        .sort();

    if (!files.length) {
        console.error(`No hay imagenes en ${dir}.`);
        process.exit(1);
    }

    const urls = [];
    for (const file of files) {
        const res = await cloudinary.uploader.upload(path.join(dir, file), { folder: "fotaza/seed" });
        console.log(`subida: ${file} -> ${res.secure_url}`);
        urls.push(res.secure_url);
    }

    fs.writeFileSync(manifest, JSON.stringify(urls, null, 2));
    console.log(`\n${urls.length} imagenes subidas. Manifest guardado en ${manifest}`);
};

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
