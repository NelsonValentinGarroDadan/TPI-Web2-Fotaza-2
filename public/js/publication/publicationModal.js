const modal = document.querySelector("[data-pub-modal]");

if (modal) {
    const el = {
        backdrop: modal.querySelector("[data-modal-backdrop]"),
        close: modal.querySelector("[data-modal-close]"),
        edit: modal.querySelector("[data-pv-edit]"),
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
        rateBox: modal.querySelector("[data-pv-rate-box]"),
        rate: modal.querySelector("[data-pv-rate]"),
        rateConfirm: modal.querySelector("[data-pv-rate-confirm]"),
        ratedMsg: modal.querySelector("[data-pv-rated-msg]"),
        comments: modal.querySelector("[data-pv-comments]"),
        commentsCount: modal.querySelector("[data-pv-comments-count]"),
    };

    let images = [];
    let index = 0;
    let currentData = null;
    let currentRoot = null;
    let currentOwner = false;
    let selected = 0;

    const stars = (rating) => {
        const full = Math.round(rating);
        return "★".repeat(full) + "☆".repeat(Math.max(0, 5 - full));
    };

    const rateStars = [];

    const paintRate = (n) => {
        rateStars.forEach((s, i) => {
            s.textContent = i < n ? "★" : "☆";
            s.classList.toggle("text-yellow-500", i < n);
            s.classList.toggle("text-win-gray", i >= n);
        });
    };

    if (el.rate) {
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement("span");
            star.className = "text-win-gray cursor-pointer";
            star.textContent = "☆";
            star.addEventListener("mouseenter", () => paintRate(i));
            star.addEventListener("click", () => {
                selected = i;
                paintRate(i);
                if (el.rateConfirm) el.rateConfirm.classList.remove("hidden");
            });
            rateStars.push(star);
            el.rate.appendChild(star);
        }
        el.rate.addEventListener("mouseleave", () => paintRate(selected));
    }

    const renderRating = (img, owner) => {
        const rating = img.rating || 0;
        el.stars.textContent = stars(rating);
        el.rating.textContent = rating;
        el.ratingCount.textContent = `(${img.ratingsCount || 0})`;

        selected = 0;
        paintRate(0);
        if (el.rateConfirm) el.rateConfirm.classList.add("hidden");

        const rated = Boolean(img.rated);
        if (el.rateBox) el.rateBox.classList.toggle("hidden", owner || rated);
        if (el.ratedMsg) {
            el.ratedMsg.classList.toggle("hidden", owner || !rated);
            if (rated) el.ratedMsg.textContent = `Ya calificaste con ${img.myRating} ★`;
        }
    };

    const renderCarousel = () => {
        const single = images.length <= 1;
        [el.prev, el.next, el.counter].forEach((node) => node && node.classList.toggle("hidden", single));

        if (!images.length) {
            el.image.removeAttribute("src");
            if (el.bg) el.bg.removeAttribute("src");
            return;
        }
        const img = images[index];
        el.image.src = img.url;
        if (el.bg) el.bg.src = img.url;
        if (el.counter) el.counter.textContent = `${index + 1} / ${images.length}`;
        renderRating(img, currentOwner);
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

        const comments = data.comments || [];
        if (el.commentsCount) el.commentsCount.textContent = comments.length;
        renderComments(comments);

        modal.querySelectorAll("[data-hide-owner]").forEach((node) => node.classList.toggle("hidden", owner));

        if (el.edit) {
            const canEdit = Boolean(owner && data.canEdit && data.id);
            el.edit.classList.toggle("hidden", !canEdit);
            el.edit.classList.toggle("flex", canEdit);
            if (canEdit) el.edit.href = `/upload/${data.id}/edit`;
        }

        currentOwner = owner;
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

    el.rateConfirm && el.rateConfirm.addEventListener("click", async () => {
        const img = images[index];
        if (!img || !img.id || !selected) return;

        el.rateConfirm.classList.add("hidden");

        try {
            const res = await fetch(`/upload/images/${img.id}/rating`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ value: selected }),
            });
            const result = await res.json().catch(() => ({}));

            if (!res.ok) {
                window.showToast?.(result.message || "No se pudo calificar.", "error");
                el.rateConfirm.classList.remove("hidden");
                return;
            }

            img.rated = true;
            img.myRating = result.myRating;
            img.rating = result.rating;
            img.ratingsCount = result.ratingsCount;

            renderRating(img, currentOwner);

            if (currentRoot) {
                currentRoot.dataset.publication = JSON.stringify(currentData);

                const totalCount = images.reduce((s, im) => s + (im.ratingsCount || 0), 0);
                const weightedSum = images.reduce((s, im) => s + (im.rating || 0) * (im.ratingsCount || 0), 0);
                const pooled = totalCount ? Math.round((weightedSum / totalCount) * 10) / 10 : 0;

                const cardStars = currentRoot.querySelector("[data-card-stars]");
                const cardRating = currentRoot.querySelector("[data-card-rating]");
                if (cardStars) cardStars.textContent = stars(pooled);
                if (cardRating) cardRating.textContent = `(${pooled})`;
            }

            window.showToast?.("Calificacion registrada!", "success");
        } catch {
            window.showToast?.("Error de red.", "error");
            el.rateConfirm.classList.remove("hidden");
        }
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
            currentData = data;
            currentRoot = root;
            open(data, root.dataset.owner === "true");
        });
    });
}
