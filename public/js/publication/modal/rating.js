export const initRating = (ctx) => {
    const { modal, state, authenticated, requireLogin, stars, syncCard, showToast } = ctx;

    const el = {
        stars: modal.querySelector("[data-pv-stars]"),
        rating: modal.querySelector("[data-pv-rating]"),
        ratingCount: modal.querySelector("[data-pv-rating-count]"),
        rateBox: modal.querySelector("[data-pv-rate-box]"),
        rate: modal.querySelector("[data-pv-rate]"),
        rateConfirm: modal.querySelector("[data-pv-rate-confirm]"),
        ratedMsg: modal.querySelector("[data-pv-rated-msg]"),
    };

    const rateStars = [];
    let selected = 0;

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
                if (!authenticated) return requireLogin();
                selected = i;
                paintRate(i);
                if (el.rateConfirm) el.rateConfirm.classList.remove("hidden");
            });
            rateStars.push(star);
            el.rate.appendChild(star);
        }
        el.rate.addEventListener("mouseleave", () => paintRate(selected));
    }

    const render = (img, owner) => {
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

    el.rateConfirm && el.rateConfirm.addEventListener("click", async () => {
        const img = state.images[state.index];
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
                showToast(result.message || "No se pudo calificar.", "error");
                el.rateConfirm.classList.remove("hidden");
                return;
            }

            img.rated = true;
            img.myRating = result.myRating;
            img.rating = result.rating;
            img.ratingsCount = result.ratingsCount;

            render(img, state.currentOwner);

            const root = syncCard();
            if (root) {
                const totalCount = state.images.reduce((s, im) => s + (im.ratingsCount || 0), 0);
                const weightedSum = state.images.reduce((s, im) => s + (im.rating || 0) * (im.ratingsCount || 0), 0);
                const pooled = totalCount ? Math.round((weightedSum / totalCount) * 10) / 10 : 0;

                const cardStars = root.querySelector("[data-card-stars]");
                const cardRating = root.querySelector("[data-card-rating]");
                const cardRatingCount = root.querySelector("[data-card-rating-count]");
                if (cardStars) cardStars.textContent = stars(pooled);
                if (cardRating) cardRating.textContent = pooled;
                if (cardRatingCount) cardRatingCount.textContent = `(${totalCount})`;
            }

            showToast("Calificacion registrada!", "success");
        } catch {
            showToast("Error de red.", "error");
            el.rateConfirm.classList.remove("hidden");
        }
    });

    ctx.onRender(render);
};
