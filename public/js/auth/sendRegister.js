export const sendRegister = async (data) => {
    try {
        const res = await fetch("/autentication/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
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