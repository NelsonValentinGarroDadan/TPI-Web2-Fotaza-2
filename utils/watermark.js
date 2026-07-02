const sharp = require("sharp");

const escapeXml = (text) =>
    text.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]));

const signBuffer = async (buffer, text) => {
    const image = sharp(buffer);
    const { width = 800, height = 600 } = await image.metadata();

    const fontSize = Math.max(18, Math.round(width / 25));
    const pad = Math.round(fontSize * 0.6);
    const stroke = Math.max(1, Math.round(fontSize / 14));

    const svg = `<svg width="${width}" height="${height}">
        <text x="${width - pad}" y="${height - pad}" text-anchor="end"
            font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold"
            fill="#ffffff" fill-opacity="0.85"
            stroke="#000000" stroke-opacity="0.6" stroke-width="${stroke}" paint-order="stroke">${escapeXml(text)}</text>
    </svg>`;

    return image
        .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
        .toBuffer();
};

module.exports = { signBuffer, escapeXml };
