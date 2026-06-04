export const sendUpdateProfile = async (data) => {
    try {
        const res = await fetch("/profile", {
            method: "PATCH",
            credentials: "include",
            body: data
        });

        const result = await res.json();

        return {
            ok: res.ok,
            status: res.status,
            data: result
        };

    } catch (err) {
        return {
            ok: false,
            status: 0,
            data: { message: "Network error" }
        };
    }
};
