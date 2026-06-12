export const initInterest = (ctx) => {
    const { modal, state, authenticated, requireLogin, showToast } = ctx;

    const el = {
        interest: modal.querySelector("[data-pv-interest]"),
        interestWrap: modal.querySelector("[data-pv-interest-wrap]"),
    };

    const setInterest = (sent) => {
        if (!el.interest) return;
        el.interest.disabled = sent;
        el.interest.textContent = sent ? "Ya mostraste interes" : "Me interesa obtenerla";
        el.interest.classList.toggle("opacity-60", sent);
        el.interest.classList.toggle("cursor-not-allowed", sent);
        el.interest.classList.toggle("cursor-pointer", !sent);
    };

    const loadInterest = async (img) => {
        if (!authenticated || state.currentOwner || !img || !img.id || img.license !== "copyright") {
            setInterest(false);
            return;
        }
        try {
            const res = await fetch(`/messages/interest/${img.id}`, { credentials: "include" });
            const data = await res.json().catch(() => ({}));
            setInterest(Boolean(data.exists));
        } catch {
            setInterest(false);
        }
    };

    el.interest && el.interest.addEventListener("click", async () => {
        if (!authenticated) return requireLogin();

        const img = state.images[state.index];
        if (!img || !img.id || el.interest.disabled) return;

        el.interest.disabled = true;

        try {
            const res = await fetch("/messages/interest", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageId: img.id }),
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                showToast(data.message || "No se pudo enviar tu interes.", "error");
                el.interest.disabled = false;
                return;
            }

            setInterest(true);
            showToast(data.message || "Le enviamos tu interes al autor! Lo vas a encontrar en tu bandeja de mensajes.", "success");
        } catch {
            showToast("Error de red.", "error");
            el.interest.disabled = false;
        }
    });

    ctx.onRender((img) => {
        if (el.interestWrap) el.interestWrap.classList.toggle("hidden", img.license !== "copyright");
        loadInterest(img);
    });
};
