export const initCollections = (ctx) => {
    const { modal, state, authenticated, requireLogin, showToast } = ctx;

    const el = {
        saveWrap: modal.querySelector("[data-pv-save-wrap]"),
        save: modal.querySelector("[data-pv-save]"),
        savePop: modal.querySelector("[data-pv-save-pop]"),
        saveList: modal.querySelector("[data-pv-save-list]"),
        saveForm: modal.querySelector("[data-pv-save-form]"),
        saveName: modal.querySelector("[data-pv-save-name]"),
        saveIconAdd: modal.querySelector("[data-pv-save-add]"),
        saveIconRemove: modal.querySelector("[data-pv-save-remove]"),
    };

    let saveOpen = false;
    let savedCollections = [];

    const updateSaveIcon = () => {
        const count = savedCollections.filter((c) => c.saved).length;
        const saved = count > 0;

        if (el.saveIconAdd) el.saveIconAdd.classList.toggle("hidden", saved);
        if (el.saveIconRemove) el.saveIconRemove.classList.toggle("hidden", !saved);
        if (el.saveForm) el.saveForm.classList.toggle("hidden", saved);
        if (el.save) {
            el.save.title = saved
                ? `Guardada en ${count} coleccion${count > 1 ? "es" : ""} — gestionar`
                : "Guardar en coleccion";
        }
    };

    const toggleSave = async (collection, iconEl) => {
        const pubId = state.currentData?.id;
        if (!pubId) return;

        const method = collection.saved ? "DELETE" : "POST";
        const url = collection.saved
            ? `/collections/${collection.id}/publications/${pubId}`
            : `/collections/${collection.id}/publications`;

        try {
            const res = await fetch(url, {
                method,
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: collection.saved ? undefined : JSON.stringify({ publicationId: pubId }),
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                showToast(data.message || "No se pudo guardar.", "error");
                return;
            }

            collection.saved = !collection.saved;
            iconEl.textContent = collection.saved ? "Quitar" : "Guardar";
            iconEl.classList.toggle("text-red-500", collection.saved);
            iconEl.classList.toggle("text-blue-l", !collection.saved);
            updateSaveIcon();
            showToast(collection.saved ? "Guardado en la coleccion." : "Quitado de la coleccion.", "success");
        } catch {
            showToast("Error de red.", "error");
        }
    };

    const renderSaveList = (collections) => {
        if (!el.saveList) return;
        el.saveList.innerHTML = "";

        if (!collections.length) {
            const empty = document.createElement("p");
            empty.className = "text-xs text-black opacity-60 px-1";
            empty.textContent = "No tenes colecciones. Crea una abajo.";
            el.saveList.appendChild(empty);
            return;
        }

        collections.forEach((c) => {
            const row = document.createElement("button");
            row.type = "button";
            row.className = "flex items-center justify-between gap-2 px-2 py-1 text-sm text-black hover:bg-win-gray/20 cursor-pointer text-left";

            const name = document.createElement("span");
            name.className = "truncate min-w-0";
            name.textContent = c.name;

            const action = document.createElement("span");
            action.className = `shrink-0 font-bold text-xs ${c.saved ? "text-red-500" : "text-blue-l"}`;
            action.textContent = c.saved ? "Quitar" : "Guardar";

            row.append(name, action);
            row.addEventListener("click", () => toggleSave(c, action));
            el.saveList.appendChild(row);
        });
    };

    const loadCollections = async () => {
        if (!state.currentData?.id) {
            savedCollections = [];
            renderSaveList(savedCollections);
            updateSaveIcon();
            return;
        }
        try {
            const res = await fetch(`/collections?publicationId=${state.currentData.id}`, { credentials: "include" });
            const data = await res.json().catch(() => ({ collections: [] }));
            savedCollections = data.collections || [];
        } catch {
            savedCollections = [];
        }
        renderSaveList(savedCollections);
        updateSaveIcon();
    };

    const closeSavePop = () => {
        saveOpen = false;
        if (el.savePop) el.savePop.classList.add("hidden");
    };

    el.save && el.save.addEventListener("click", () => {
        if (!authenticated) return requireLogin();

        saveOpen = !saveOpen;
        if (el.savePop) el.savePop.classList.toggle("hidden", !saveOpen);
    });

    document.addEventListener("click", (e) => {
        if (!saveOpen || !el.saveWrap) return;
        if (!el.saveWrap.contains(e.target)) closeSavePop();
    });

    el.saveForm && el.saveForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!authenticated) return requireLogin();

        const name = (el.saveName && el.saveName.value || "").trim();
        if (!name || !state.currentData?.id) return;

        try {
            const res = await fetch("/collections", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                showToast(data.message || "No se pudo crear la coleccion.", "error");
                return;
            }

            el.saveName.value = "";

            await fetch(`/collections/${data.collection.id}/publications`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ publicationId: state.currentData.id }),
            });

            await loadCollections();
            showToast("Coleccion creada y publicacion guardada.", "success");
        } catch {
            showToast("Error de red.", "error");
        }
    });

    ctx.onOpen((data, owner) => {
        const canSave = authenticated && !owner;
        if (el.saveWrap) el.saveWrap.classList.toggle("hidden", !canSave);
        closeSavePop();
        savedCollections = [];
        updateSaveIcon();
        if (canSave && data.id) loadCollections();
    });

    ctx.onClose(closeSavePop);
};
