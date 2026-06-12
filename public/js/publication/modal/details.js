export const initDetails = (ctx) => {
    const { modal } = ctx;

    const el = {
        title: modal.querySelector("[data-pv-title]"),
        description: modal.querySelector("[data-pv-description]"),
        tags: modal.querySelector("[data-pv-tags]"),
        authorImg: modal.querySelector("[data-pv-author-img]"),
        authorName: modal.querySelector("[data-pv-author-name]"),
        profileLink: modal.querySelector("[data-pv-profile-link]"),
        edit: modal.querySelector("[data-pv-edit]"),
    };

    const renderTags = (tags) => {
        el.tags.innerHTML = "";
        (tags || []).forEach((tag) => {
            const chip = document.createElement("a");
            chip.href = `/search?q=${encodeURIComponent(`#${tag}`)}`;
            chip.className = "px-2 py-0.5 text-xs text-black bg-win-gray-l/40 border border-black hover:bg-win-gray-l cursor-pointer";
            chip.textContent = `#${tag}`;
            el.tags.appendChild(chip);
        });
    };

    ctx.onOpen((data, owner) => {
        if (el.title) el.title.textContent = data.title || "Publicacion";
        el.description.textContent = data.description || "Sin descripcion";
        renderTags(data.tags);

        const author = data.author || {};
        el.authorName.textContent = `@${author.nickname || "usuario"}`;
        el.authorImg.src = author.profile_img || "/imgs/profile_img_default.png";
        if (el.profileLink) el.profileLink.href = author.id ? `/profile/${author.id}` : "#";

        modal.querySelectorAll("[data-hide-owner]").forEach((node) => node.classList.toggle("hidden", owner));

        if (el.edit) {
            const canEdit = Boolean(owner && data.canEdit && data.id);
            el.edit.classList.toggle("hidden", !canEdit);
            el.edit.classList.toggle("flex", canEdit);
            if (canEdit) el.edit.href = `/upload/${data.id}/edit`;
        }
    });
};
