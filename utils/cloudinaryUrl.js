const UPLOAD_MARKER = "/upload/";

const transform = (url, segment) => {
    if (!url || typeof url !== "string") return url;

    const at = url.indexOf(UPLOAD_MARKER);
    if (at === -1) return url;

    const head = url.slice(0, at + UPLOAD_MARKER.length);
    const tail = url.slice(at + UPLOAD_MARKER.length);

    return `${head}${segment}/${tail}`;
};

const PRESETS = {
    card: "c_fill,g_auto,w_640,h_480,f_auto,q_auto",
    detail: "c_limit,w_1600,f_auto,q_auto",
    avatar: "c_fill,g_face,w_320,h_320,f_auto,q_auto",
};

module.exports = {
    transform,
    cardImage: (url) => transform(url, PRESETS.card),
    detailImage: (url) => transform(url, PRESETS.detail),
    avatarImage: (url) => transform(url, PRESETS.avatar),
};
