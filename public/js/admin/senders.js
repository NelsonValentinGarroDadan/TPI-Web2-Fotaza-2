export const sendTakedown = async (publicationId) => {
    const res = await fetch(`/upload/${publicationId}`, {
        method: "DELETE",
        credentials: "include",
    });

    const result = await res.json().catch(() => ({}));
    return { ok: res.ok, result };
};

export const sendDismiss = async (imageId) => {
    const res = await fetch(`/reports/images/${imageId}`, {
        method: "DELETE",
        credentials: "include",
    });

    const result = await res.json().catch(() => ({}));
    return { ok: res.ok, result };
};

export const sendDismissReport = async (reportId) => {
    const res = await fetch(`/reports/${reportId}`, {
        method: "DELETE",
        credentials: "include",
    });

    const result = await res.json().catch(() => ({}));
    return { ok: res.ok, result };
};
