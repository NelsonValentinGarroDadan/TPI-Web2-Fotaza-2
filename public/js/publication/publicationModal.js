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
        follow: modal.querySelector("[data-pv-follow]"),
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
        commentForm: modal.querySelector("[data-pv-comment-form]"),
        commentInput: modal.querySelector("[data-pv-comment-input]"),
        commentsDisabled: modal.querySelector("[data-pv-comments-disabled]"),
        commentSend: modal.querySelector("[data-pv-comment-send]"),
        interest: modal.querySelector("[data-pv-interest]"),
        interestWrap: modal.querySelector("[data-pv-interest-wrap]"),
        report: modal.querySelector("[data-pv-report]"),
        saveWrap: modal.querySelector("[data-pv-save-wrap]"),
        save: modal.querySelector("[data-pv-save]"),
        savePop: modal.querySelector("[data-pv-save-pop]"),
        saveList: modal.querySelector("[data-pv-save-list]"),
        saveForm: modal.querySelector("[data-pv-save-form]"),
        saveName: modal.querySelector("[data-pv-save-name]"),
        saveIconAdd: modal.querySelector("[data-pv-save-add]"),
        saveIconRemove: modal.querySelector("[data-pv-save-remove]"),
        reportDialog: modal.querySelector("[data-report-dialog]"),
        reportBackdrop: modal.querySelector("[data-report-backdrop]"),
        reportTitle: modal.querySelector("[data-report-title]"),
        reportReason: modal.querySelector("[data-report-reason]"),
        reportDescription: modal.querySelector("[data-report-description]"),
        reportError: modal.querySelector("[data-report-error]"),
        reportSubmit: modal.querySelector("[data-report-submit]"),
    };

    const authenticated = modal.dataset.authenticated === "true";
    const currentUserId = Number(modal.dataset.userId) || null;
    const requireLogin = () => { window.location.href = "/autentication/login"; };

    let images = [];
    let index = 0;
    let currentData = null;
    let currentRoot = null;
    let currentOwner = false;
    let commentsEnabled = true;
    let currentAuthorId = null;
    let following = false;
    let selected = 0;
    let saveOpen = false;
    let savedCollections = [];
    let reportTarget = null;
    let reportsPopover = null;

    const REASON_LABELS = {
        inapropiado: "Contenido inapropiado",
        spam: "Spam o enganoso",
        derechos: "Derechos de autor",
        violencia: "Violencia o contenido sensible",
        otro: "Otro",
    };

    const FLAG_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" class="w-4 h-4"><path d="M42.76,50A8,8,0,0,0,40,56V224a8,8,0,0,0,16,0V179.77c26.79-21.16,49.87-9.75,76.45,3.41,16.4,8.11,34.06,16.85,53,16.85,13.93,0,28.54-4.75,43.82-18a8,8,0,0,0,2.76-6V56A8,8,0,0,0,218.76,50c-28,24.23-51.72,12.49-79.21-1.12C111.07,34.76,78.78,18.79,42.76,50Z"></path></svg>';

    const stars = (rating) => {
        const full = Math.round(rating);
        return "★".repeat(full) + "☆".repeat(Math.max(0, 5 - full));
    };

    const followBase = "ml-auto shrink-0 px-3 py-1 text-sm border border-black cursor-pointer";

    const renderFollow = (isFollowing) => {
        if (!el.follow) return;
        following = isFollowing;
        el.follow.textContent = isFollowing ? "Siguiendo" : "Seguir";
        el.follow.className = `${followBase} ${isFollowing ? "bg-win-gray/30 hover:bg-win-gray/50 text-black" : "bg-blue-l hover:bg-blue text-white"}`;
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
        renderImageComments(img);
        if (el.interestWrap) el.interestWrap.classList.toggle("hidden", img.license !== "copyright");
        loadInterest(img);
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
        if (!authenticated || currentOwner || !img || !img.id || img.license !== "copyright") {
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

    const renderComments = (comments) => {
        if (!el.comments) return;
        closeReportsPopover();
        el.comments.innerHTML = "";
        (comments || []).forEach((c) => {
            const item = document.createElement("div");
            item.className = "bg-win-gray-l/30 border border-win-gray p-2 min-w-0";

            const head = document.createElement("div");
            head.className = "flex items-center justify-between gap-2";

            const author = document.createElement("span");
            author.className = "text-sm font-bold text-black truncate min-w-0";
            author.textContent = currentUserId && c.userId === currentUserId
                ? "Tú"
                : `@${c.author || "usuario"}`;

            const right = document.createElement("div");
            right.className = "shrink-0 flex items-center gap-2";

            const date = document.createElement("span");
            date.className = "text-xs text-black opacity-60 shrink-0";
            date.textContent = c.date || "";
            right.append(date);

            if (currentOwner) {
                const count = c.reportsCount || 0;
                if (count > 0) {
                    const badge = document.createElement("button");
                    badge.type = "button";
                    badge.title = "Ver denuncias";
                    badge.className = "shrink-0 text-xs text-red-500 font-bold underline cursor-pointer";
                    badge.textContent = `${count} denuncia${count > 1 ? "s" : ""}`;
                    const commentReports = c.reports || [];
                    badge.addEventListener("click", (ev) => {
                        ev.stopPropagation();
                        openReportsPopover(badge, commentReports);
                    });

                    const del = document.createElement("button");
                    del.type = "button";
                    del.title = "Borrar comentario";
                    del.setAttribute("data-comment-delete", "");
                    del.dataset.commentId = c.id;
                    del.className = "shrink-0 text-red-500 hover:text-red-700 cursor-pointer text-sm font-bold leading-none";
                    del.textContent = "✕";

                    right.append(badge, del);
                }
            } else if (currentUserId && c.userId !== currentUserId && c.userId !== currentAuthorId) {
                const report = document.createElement("button");
                report.type = "button";
                report.title = "Denunciar comentario";
                report.setAttribute("data-comment-report", "");
                report.dataset.commentId = c.id;
                report.className = "shrink-0 text-red-500 hover:text-red-700 cursor-pointer";
                report.innerHTML = FLAG_SVG;
                right.append(report);
            }

            const content = document.createElement("p");
            content.className = "text-sm text-black whitespace-pre-wrap break-words [overflow-wrap:anywhere]";
            content.textContent = c.content || "";

            head.append(author, right);
            item.append(head, content);
            el.comments.appendChild(item);
        });
    };

    const renderImageComments = (img) => {
        const list = img.comments || [];
        if (el.commentsCount) el.commentsCount.textContent = list.length;
        renderComments(list);
        if (el.commentForm) el.commentForm.classList.toggle("hidden", !commentsEnabled);
        if (el.commentsDisabled) el.commentsDisabled.classList.toggle("hidden", commentsEnabled);
        if (el.commentInput) el.commentInput.value = "";
    };

    const openReportDialog = (type, id) => {
        if (!el.reportDialog) return;
        reportTarget = { type, id };
        if (el.reportTitle) el.reportTitle.textContent = type === "comment" ? "Denunciar comentario" : "Denunciar imagen";
        if (el.reportReason) el.reportReason.selectedIndex = 0;
        if (el.reportDescription) el.reportDescription.value = "";
        if (el.reportError) el.reportError.classList.add("hidden");
        el.reportDialog.classList.remove("hidden");
        el.reportDialog.classList.add("flex");
    };

    const closeReportDialog = () => {
        if (!el.reportDialog) return;
        reportTarget = null;
        el.reportDialog.classList.add("hidden");
        el.reportDialog.classList.remove("flex");
    };

    const closeReportsPopover = () => {
        if (!reportsPopover) return;
        reportsPopover.remove();
        reportsPopover = null;
    };

    const openReportsPopover = (anchor, reports) => {
        closeReportsPopover();
        if (!reports.length) return;

        const pop = document.createElement("div");
        pop.className = "fixed flex flex-col bg-bk border-2 border-black shadow-lg";
        pop.style.zIndex = "70";
        pop.style.width = "20vw";
        pop.style.minWidth = "210px";
        pop.style.maxHeight = "40vh";

        const header = document.createElement("div");
        header.className = "shrink-0 flex items-center justify-between gap-2 bg-linear-to-r from-blue to-blue-l px-2 py-1";
        const hTitle = document.createElement("span");
        hTitle.className = "text-white font-bold text-xs truncate";
        hTitle.textContent = `Denuncias (${reports.length})`;
        const hClose = document.createElement("button");
        hClose.type = "button";
        hClose.className = "shrink-0 flex items-center justify-center bg-red-500 hover:bg-red-700 text-white border border-black cursor-pointer leading-none px-1";
        hClose.textContent = "✕";
        hClose.addEventListener("click", closeReportsPopover);
        header.append(hTitle, hClose);

        const body = document.createElement("div");
        body.className = "flex-1 min-h-0 overflow-y-auto p-2 flex flex-col gap-1";

        reports.forEach((r) => {
            const group = document.createElement("div");
            group.className = "border border-win-gray bg-white";

            const toggle = document.createElement("button");
            toggle.type = "button";
            toggle.className = "w-full flex items-center justify-between gap-2 px-2 py-1 text-left text-xs font-bold text-black cursor-pointer hover:bg-win-gray-l/30";
            const who = document.createElement("span");
            who.className = "truncate min-w-0";
            who.textContent = `@${r.reporter || "usuario"}`;
            const caret = document.createElement("span");
            caret.className = "shrink-0 opacity-60";
            caret.textContent = "▸";
            toggle.append(who, caret);

            const detail = document.createElement("div");
            detail.className = "hidden border-t border-win-gray px-2 py-1 flex flex-col gap-1 text-xs text-black";

            const reasonP = document.createElement("p");
            const reasonLabel = document.createElement("span");
            reasonLabel.className = "font-bold";
            reasonLabel.textContent = "Causa: ";
            reasonP.append(reasonLabel, document.createTextNode(REASON_LABELS[r.reason] || r.reason || "—"));

            const descP = document.createElement("p");
            descP.className = "whitespace-pre-wrap break-words [overflow-wrap:anywhere]";
            descP.textContent = r.description || "Sin descripcion.";

            const dateP = document.createElement("p");
            dateP.className = "opacity-60";
            dateP.textContent = r.date || "";

            detail.append(reasonP, descP, dateP);

            toggle.addEventListener("click", () => {
                const collapsed = detail.classList.toggle("hidden");
                caret.textContent = collapsed ? "▸" : "▾";
            });

            group.append(toggle, detail);
            body.appendChild(group);
        });

        pop.append(header, body);
        document.body.appendChild(pop);
        reportsPopover = pop;

        const rect = anchor.getBoundingClientRect();
        const pad = 8;
        const pw = pop.offsetWidth;
        const ph = pop.offsetHeight;

        let left = rect.left - pw - pad;
        if (left < pad) left = rect.right + pad;
        if (left + pw > window.innerWidth - pad) left = window.innerWidth - pw - pad;
        if (left < pad) left = pad;

        let top = rect.top;
        if (top + ph > window.innerHeight - pad) top = window.innerHeight - ph - pad;
        if (top < pad) top = pad;

        pop.style.left = `${left}px`;
        pop.style.top = `${top}px`;
    };

    const submitReport = async () => {
        if (!reportTarget) return;

        const reason = el.reportReason ? el.reportReason.value : "";
        const description = (el.reportDescription && el.reportDescription.value || "").trim();

        if (!description) {
            if (el.reportError) {
                el.reportError.textContent = "Conta el motivo de la denuncia.";
                el.reportError.classList.remove("hidden");
            }
            return;
        }

        const url = reportTarget.type === "comment"
            ? `/reports/comments/${reportTarget.id}`
            : `/reports/images/${reportTarget.id}`;

        if (el.reportSubmit) el.reportSubmit.disabled = true;

        try {
            const res = await fetch(url, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason, description }),
            });
            const result = await res.json().catch(() => ({}));

            if (!res.ok) {
                window.showToast?.(result.message || "No se pudo registrar la denuncia.", "error");
                return;
            }

            closeReportDialog();
            window.showToast?.("Denuncia registrada!", "success");
        } catch {
            window.showToast?.("Error de red.", "error");
        } finally {
            if (el.reportSubmit) el.reportSubmit.disabled = false;
        }
    };

    const deleteComment = async (commentId) => {
        const img = images[index];
        if (!img || !commentId) return;

        try {
            const res = await fetch(`/upload/comments/${commentId}`, { method: "DELETE", credentials: "include" });
            const result = await res.json().catch(() => ({}));

            if (!res.ok) {
                window.showToast?.(result.message || "No se pudo borrar el comentario.", "error");
                return;
            }

            img.comments = (img.comments || []).filter((c) => String(c.id) !== String(commentId));
            img.commentsCount = img.comments.length;
            renderImageComments(img);

            if (currentRoot) {
                currentRoot.dataset.publication = JSON.stringify(currentData);
                const total = images.reduce((s, im) => s + (im.commentsCount || 0), 0);
                const cardCount = currentRoot.querySelector("[data-card-comments]");
                if (cardCount) cardCount.textContent = total;
            }

            window.showToast?.("Comentario eliminado.", "success");
        } catch {
            window.showToast?.("Error de red.", "error");
        }
    };

    const open = (data, owner) => {
        if (el.title) el.title.textContent = data.title || "Publicacion";
        el.description.textContent = data.description || "Sin descripcion";
        renderTags(data.tags);

        const author = data.author || {};
        el.authorName.textContent = `@${author.nickname || "usuario"}`;
        el.authorImg.src = author.profile_img || "/imgs/profile_img_default.png";
        if (el.profileLink) el.profileLink.href = author.id ? `/profile/${author.id}` : "#";

        currentAuthorId = author.id || null;
        if (el.follow) {
            const showFollow = Boolean(author.id) && author.id !== currentUserId;
            if (showFollow) {
                renderFollow(Boolean(author.isFollowing));
                el.follow.classList.remove("hidden");
            } else {
                el.follow.classList.add("hidden");
            }
        }

        commentsEnabled = data.commentsEnabled !== false;

        modal.querySelectorAll("[data-hide-owner]").forEach((node) => node.classList.toggle("hidden", owner));

        if (el.edit) {
            const canEdit = Boolean(owner && data.canEdit && data.id);
            el.edit.classList.toggle("hidden", !canEdit);
            el.edit.classList.toggle("flex", canEdit);
            if (canEdit) el.edit.href = `/upload/${data.id}/edit`;
        }

        if (el.saveWrap) el.saveWrap.classList.toggle("hidden", !authenticated);
        closeSavePop();
        closeReportDialog();

        savedCollections = [];
        updateSaveIcon();
        if (authenticated && data.id) loadCollections();

        currentOwner = owner;
        images = data.images || [];
        index = 0;
        renderCarousel();

        modal.classList.remove("hidden");
        modal.classList.add("flex");
        document.body.style.overflow = "hidden";
    };

    const close = () => {
        closeSavePop();
        closeReportDialog();
        closeReportsPopover();
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
                const cardRatingCount = currentRoot.querySelector("[data-card-rating-count]");
                if (cardStars) cardStars.textContent = stars(pooled);
                if (cardRating) cardRating.textContent = pooled;
                if (cardRatingCount) cardRatingCount.textContent = `(${totalCount})`;
            }

            window.showToast?.("Calificacion registrada!", "success");
        } catch {
            window.showToast?.("Error de red.", "error");
            el.rateConfirm.classList.remove("hidden");
        }
    });

    el.commentSend && el.commentSend.addEventListener("click", async () => {
        if (!authenticated) return requireLogin();

        const img = images[index];
        if (!img || !img.id || !commentsEnabled) return;

        const content = (el.commentInput && el.commentInput.value || "").trim();
        if (!content) return;

        el.commentSend.disabled = true;

        try {
            const res = await fetch(`/upload/images/${img.id}/comment`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });
            const result = await res.json().catch(() => ({}));

            if (!res.ok) {
                window.showToast?.(result.message || "No se pudo publicar el comentario.", "error");
                return;
            }

            img.comments = img.comments || [];
            img.comments.push(result.comment);
            img.commentsCount = img.comments.length;
            renderImageComments(img);

            if (currentRoot) {
                currentRoot.dataset.publication = JSON.stringify(currentData);
                const total = images.reduce((s, im) => s + (im.commentsCount || 0), 0);
                const cardCount = currentRoot.querySelector("[data-card-comments]");
                if (cardCount) cardCount.textContent = total;
            }

            window.showToast?.("Comentario publicado!", "success");
        } catch {
            window.showToast?.("Error de red.", "error");
        } finally {
            el.commentSend.disabled = false;
        }
    });

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
        const pubId = currentData?.id;
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
                window.showToast?.(data.message || "No se pudo guardar.", "error");
                return;
            }

            collection.saved = !collection.saved;
            iconEl.textContent = collection.saved ? "Quitar" : "Guardar";
            iconEl.classList.toggle("text-red-500", collection.saved);
            iconEl.classList.toggle("text-blue-l", !collection.saved);
            updateSaveIcon();
            window.showToast?.(collection.saved ? "Guardado en la coleccion." : "Quitado de la coleccion.", "success");
        } catch {
            window.showToast?.("Error de red.", "error");
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
        if (!currentData?.id) {
            savedCollections = [];
            renderSaveList(savedCollections);
            updateSaveIcon();
            return;
        }
        try {
            const res = await fetch(`/collections?publicationId=${currentData.id}`, { credentials: "include" });
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

    document.addEventListener("click", (e) => {
        if (reportsPopover && !reportsPopover.contains(e.target)) closeReportsPopover();
    });

    el.comments && el.comments.addEventListener("scroll", closeReportsPopover);

    el.saveForm && el.saveForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!authenticated) return requireLogin();

        const name = (el.saveName && el.saveName.value || "").trim();
        if (!name || !currentData?.id) return;

        try {
            const res = await fetch("/collections", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                window.showToast?.(data.message || "No se pudo crear la coleccion.", "error");
                return;
            }

            el.saveName.value = "";

            await fetch(`/collections/${data.collection.id}/publications`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ publicationId: currentData.id }),
            });

            await loadCollections();
            window.showToast?.("Coleccion creada y publicacion guardada.", "success");
        } catch {
            window.showToast?.("Error de red.", "error");
        }
    });

    el.interest && el.interest.addEventListener("click", async () => {
        if (!authenticated) return requireLogin();

        const img = images[index];
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
                window.showToast?.(data.message || "No se pudo enviar tu interes.", "error");
                el.interest.disabled = false;
                return;
            }

            setInterest(true);
            window.showToast?.(data.message || "Le enviamos tu interes al autor! Lo vas a encontrar en tu bandeja de mensajes.", "success");
        } catch {
            window.showToast?.("Error de red.", "error");
            el.interest.disabled = false;
        }
    });

    el.report && el.report.addEventListener("click", () => {
        if (!authenticated) return requireLogin();
        const img = images[index];
        if (!img || !img.id) return;
        openReportDialog("image", img.id);
    });

    el.reportSubmit && el.reportSubmit.addEventListener("click", submitReport);
    el.reportBackdrop && el.reportBackdrop.addEventListener("click", closeReportDialog);
    modal.querySelectorAll("[data-report-cancel]").forEach((b) => b.addEventListener("click", closeReportDialog));

    el.comments && el.comments.addEventListener("click", (e) => {
        const reportBtn = e.target.closest("[data-comment-report]");
        if (reportBtn) {
            if (!authenticated) return requireLogin();
            return openReportDialog("comment", reportBtn.dataset.commentId);
        }

        const delBtn = e.target.closest("[data-comment-delete]");
        if (delBtn) return deleteComment(delBtn.dataset.commentId);
    });

    el.follow && el.follow.addEventListener("click", async () => {
        if (!authenticated) return requireLogin();
        if (!currentAuthorId) return;

        const method = following ? "DELETE" : "POST";
        el.follow.disabled = true;

        try {
            const res = await fetch(`/profile/${currentAuthorId}/follow`, { method, credentials: "include" });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                window.showToast?.(data.message || "No se pudo completar la accion.", "error");
                return;
            }

            renderFollow(!following);

            if (currentData && currentData.author) {
                currentData.author.isFollowing = following;
                if (currentRoot) currentRoot.dataset.publication = JSON.stringify(currentData);
            }

            window.showToast?.(following ? "Ahora seguis a este usuario." : "Dejaste de seguir a este usuario.", "success");
        } catch {
            window.showToast?.("Error de red.", "error");
        } finally {
            el.follow.disabled = false;
        }
    });

    el.close && el.close.addEventListener("click", close);
    el.backdrop && el.backdrop.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape" || modal.classList.contains("hidden")) return;
        if (reportsPopover) return closeReportsPopover();
        close();
    });

    document.addEventListener("click", (e) => {
        const card = e.target.closest("[data-card]");
        if (!card) return;

        const root = card.closest("[data-pub]");
        if (!root) return;

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

    const openById = (pubId) => {
        const root = [...document.querySelectorAll("[data-pub]")].find((r) => {
            try {
                return String(JSON.parse(r.dataset.publication || "{}").id) === String(pubId);
            } catch {
                return false;
            }
        });
        if (!root) return;

        let data = {};
        try {
            data = JSON.parse(root.dataset.publication || "{}");
        } catch {
            data = {};
        }
        currentData = data;
        currentRoot = root;
        open(data, root.dataset.owner === "true");
    };

    const pubFromQuery = new URLSearchParams(window.location.search).get("publication");
    if (pubFromQuery) openById(pubFromQuery);
}
