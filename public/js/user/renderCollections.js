export const renderCollections = (panel) => {
    if (!panel || panel.dataset.ready === "1") return;
    panel.dataset.ready = "1";

    const form = panel.querySelector("[data-collection-form]");
    const nameInput = panel.querySelector("[data-collection-name]");
    const errorEl = panel.querySelector("[data-collection-error]");
    const newBtn = panel.querySelector("[data-collection-new]");
    const cancelBtn = panel.querySelector("[data-collection-cancel]");

    const modal = document.querySelector("[data-collection-modal]");
    const modalTitle = modal?.querySelector("[data-collection-modal-title]");
    const modalClose = modal?.querySelector("[data-collection-modal-close]");
    const modalBackdrop = modal?.querySelector("[data-collection-modal-backdrop]");
    const groups = modal ? modal.querySelectorAll("[data-collection-group]") : [];

    const openModal = (id, name) => {
        if (!modal) return;
        if (modalTitle) modalTitle.textContent = name || "Coleccion";
        groups.forEach((g) => g.classList.toggle("hidden", g.dataset.id !== String(id)));
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.add("hidden");
        modal.classList.remove("flex");
        document.body.style.overflow = "";
    };

    newBtn?.addEventListener("click", () => {
        form.classList.remove("hidden");
        nameInput.focus();
    });

    cancelBtn?.addEventListener("click", () => {
        form.classList.add("hidden");
        nameInput.value = "";
        errorEl.textContent = "";
    });

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        errorEl.textContent = "";

        const name = nameInput.value.trim();
        if (!name) {
            errorEl.textContent = "Ingresa un nombre.";
            return;
        }

        try {
            const res = await fetch("/collections", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                errorEl.textContent = data.message || "No se pudo crear la coleccion.";
                return;
            }

            window.location.reload();
        } catch {
            errorEl.textContent = "Error de red.";
        }
    });

    panel.querySelectorAll("[data-collection-delete]").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            e.stopPropagation();
            if (!confirm("Eliminar esta coleccion? Las publicaciones no se borran.")) return;

            try {
                const res = await fetch(`/collections/${btn.dataset.id}`, {
                    method: "DELETE",
                    credentials: "include",
                });
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    window.showToast?.(data.message || "No se pudo eliminar.", "error");
                    return;
                }

                window.location.reload();
            } catch {
                window.showToast?.("Error de red.", "error");
            }
        });
    });

    panel.querySelectorAll("[data-collection-open]").forEach((btn) => {
        btn.addEventListener("click", () => openModal(btn.dataset.id, btn.dataset.name));
    });

    modalClose?.addEventListener("click", closeModal);
    modalBackdrop?.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) closeModal();
    });
};
