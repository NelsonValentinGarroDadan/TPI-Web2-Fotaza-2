const modal = document.querySelector("[data-pub-modal]");

if (modal) {
    const el = {
        backdrop: modal.querySelector("[data-modal-backdrop]"),
        close: modal.querySelector("[data-modal-close]"),
        title: modal.querySelector("[data-pv-title]"),
        image: modal.querySelector("[data-pv-image]"),
        bg: modal.querySelector("[data-pv-bg]"),
        prev: modal.querySelector("[data-pv-prev]"),
        next: modal.querySelector("[data-pv-next]"),
        counter: modal.querySelector("[data-pv-counter]"),
        authorImg: modal.querySelector("[data-pv-author-img]"),
        authorName: modal.querySelector("[data-pv-author-name]"),
        profileLink: modal.querySelector("[data-pv-profile-link]"),
        description: modal.querySelector("[data-pv-description]"),
        tags: modal.querySelector("[data-pv-tags]"),
        stars: modal.querySelector("[data-pv-stars]"),
        rating: modal.querySelector("[data-pv-rating]"),
        ratingCount: modal.querySelector("[data-pv-rating-count]"),
        comments: modal.querySelector("[data-pv-comments]"),
        commentsCount: modal.querySelector("[data-pv-comments-count]"),
    };

    let images = [];
    let index = 0;

    const stars = (rating) => {
        const full = Math.round(rating);
        return "★".repeat(full) + "☆".repeat(Math.max(0, 5 - full));
    };

    const renderCarousel = () => {
        const single = images.length <= 1;
        [el.prev, el.next, el.counter].forEach((node) => node && node.classList.toggle("hidden", single));

        if (!images.length) {
            el.image.removeAttribute("src");
            if (el.bg) el.bg.removeAttribute("src");
            return;
        }
        el.image.src = images[index];
        if (el.bg) el.bg.src = images[index];
        if (el.counter) el.counter.textContent = `${index + 1} / ${images.length}`;
    };

    const renderTags = (tags) => {
        el.tags.innerHTML = "";
        (tags || []).forEach((tag) => {
            const chip = document.createElement("span");
            chip.className = "px-2 py-0.5 text-xs text-black bg-win-gray-l/40 border border-black";
            chip.textContent = `#${tag}`;
            el.tags.appendChild(chip);
        });
    };

    const renderComments = (comments) => {
        if (!el.comments) return;
        el.comments.innerHTML = "";
        (comments || []).forEach((c) => {
            const item = document.createElement("div");
            item.className = "bg-win-gray-l/30 border border-win-gray p-2";

            const head = document.createElement("div");
            head.className = "flex items-center justify-between";

            const author = document.createElement("span");
            author.className = "text-sm font-bold text-black";
            author.textContent = `@${c.author || "usuario"}`;

            const date = document.createElement("span");
            date.className = "text-xs text-black opacity-60";
            date.textContent = c.date || "";

            const content = document.createElement("p");
            content.className = "text-sm text-black";
            content.textContent = c.content || "";

            head.append(author, date);
            item.append(head, content);
            el.comments.appendChild(item);
        });
    };

    const open = (data, owner) => {
        if (el.title) el.title.textContent = data.title || "Publicacion";
        el.description.textContent = data.description || "Sin descripcion";
        renderTags(data.tags);

        const author = data.author || {};
        el.authorName.textContent = `@${author.nickname || "usuario"}`;
        el.authorImg.src = author.profile_img || "/imgs/profile_img_default.png";
        if (el.profileLink) el.profileLink.href = author.id ? `/profile/${author.id}` : "#";

        const rating = data.rating || 0;
        el.stars.textContent = stars(rating);
        el.rating.textContent = rating;
        el.ratingCount.textContent = `(${data.ratingsCount || 0})`;

        const comments = data.comments || [];
        if (el.commentsCount) el.commentsCount.textContent = comments.length;
        renderComments(comments);

        modal.querySelectorAll("[data-hide-owner]").forEach((node) => node.classList.toggle("hidden", owner));

        images = data.images || [];
        index = 0;
        renderCarousel();

        modal.classList.remove("hidden");
        modal.classList.add("flex");
        document.body.style.overflow = "hidden";
    };

    const close = () => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
        document.body.style.overflow = "";
    };

    el.prev && el.prev.addEventListener("click", () => {
        index = (index - 1 + images.length) % images.length;
        renderCarousel();
    });

    el.next && el.next.addEventListener("click", () => {
        index = (index + 1) % images.length;
        renderCarousel();
    });

    el.close && el.close.addEventListener("click", close);
    el.backdrop && el.backdrop.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.classList.contains("hidden")) close();
    });

    document.querySelectorAll("[data-pub]").forEach((root) => {
        const card = root.querySelector("[data-card]");
        if (!card) return;

        card.addEventListener("click", () => {
            let data = {};
            try {
                data = JSON.parse(root.dataset.publication || "{}");
            } catch {
                data = {};
            }
            open(data, root.dataset.owner === "true");
        });
    });
}
