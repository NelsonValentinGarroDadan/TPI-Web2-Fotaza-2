export const sendReport = async (type, id, payload) => {
    const url = type === "comment"
        ? `/reports/comments/${id}`
        : `/reports/images/${id}`;

    const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const result = await res.json().catch(() => ({}));
    return { ok: res.ok, result };
};
