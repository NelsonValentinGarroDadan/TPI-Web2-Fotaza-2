const list = document.querySelector("[data-notif-list]");

if (list) {
    const hideReadAll = () => {
        document.querySelector("[data-read-all-wrap]")?.remove();
    };

    const markItemRead = (item) => {
        item.dataset.read = "true";
        item.classList.remove("bg-blue-l/10");
        item.classList.add("bg-white");
        item.querySelector("[data-notif-dot]")?.remove();
        item.querySelector("[data-notif-read]")?.remove();
    };

    const readOne = async (item) => {
        const id = item.dataset.id;
        try {
            const res = await fetch(`/notifications/${id}/read`, {
                method: "PATCH",
                credentials: "include",
            });
            if (!res.ok) return window.showToast?.("No se pudo marcar como leida.", "error");
            markItemRead(item);
            if (!list.querySelector("[data-notif][data-read='false']")) hideReadAll();
            window.refreshNotifBadge?.();
        } catch {
            window.showToast?.("Error de red.", "error");
        }
    };

    const readAll = async () => {
        try {
            const res = await fetch("/notifications/read-all", {
                method: "PATCH",
                credentials: "include",
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) return window.showToast?.(data.message || "No se pudo completar la accion.", "error");
            list.querySelectorAll("[data-notif][data-read='false']").forEach(markItemRead);
            hideReadAll();
            window.setNotifBadge?.(0);
            window.showToast?.(data.message || "Listo.", "success");
        } catch {
            window.showToast?.("Error de red.", "error");
        }
    };

    list.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-notif-read]");
        if (!btn) return;
        e.preventDefault();
        const item = btn.closest("[data-notif]");
        if (item) readOne(item);
    });

    document.querySelector("[data-notif-read-all]")?.addEventListener("click", readAll);
}
