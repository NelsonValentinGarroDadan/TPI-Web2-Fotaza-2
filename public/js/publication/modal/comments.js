const FLAG_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" class="w-4 h-4"><path d="M42.76,50A8,8,0,0,0,40,56V224a8,8,0,0,0,16,0V179.77c26.79-21.16,49.87-9.75,76.45,3.41,16.4,8.11,34.06,16.85,53,16.85,13.93,0,28.54-4.75,43.82-18a8,8,0,0,0,2.76-6V56A8,8,0,0,0,218.76,50c-28,24.23-51.72,12.49-79.21-1.12C111.07,34.76,78.78,18.79,42.76,50Z"></path></svg>';

export const initComments = (ctx) => {
    const { modal, state, authenticated, currentUserId, requireLogin, syncCard, showToast, report } = ctx;

    const el = {
        comments: modal.querySelector("[data-pv-comments]"),
        commentsCount: modal.querySelector("[data-pv-comments-count]"),
        commentForm: modal.querySelector("[data-pv-comment-form]"),
        commentInput: modal.querySelector("[data-pv-comment-input]"),
        commentsDisabled: modal.querySelector("[data-pv-comments-disabled]"),
        commentSend: modal.querySelector("[data-pv-comment-send]"),
    };

    const renderComments = (comments) => {
        if (!el.comments) return;
        report.closePopover();
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

            if (state.currentOwner) {
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
                        report.openPopover(badge, commentReports);
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
            } else if (currentUserId && c.userId !== currentUserId && c.userId !== state.currentAuthorId) {
                const reportBtn = document.createElement("button");
                reportBtn.type = "button";
                reportBtn.title = "Denunciar comentario";
                reportBtn.setAttribute("data-comment-report", "");
                reportBtn.dataset.commentId = c.id;
                reportBtn.className = "shrink-0 text-red-500 hover:text-red-700 cursor-pointer";
                reportBtn.innerHTML = FLAG_SVG;
                right.append(reportBtn);
            }

            const content = document.createElement("p");
            content.className = "text-sm text-black whitespace-pre-wrap break-words [overflow-wrap:anywhere]";
            content.textContent = c.content || "";

            head.append(author, right);
            item.append(head, content);
            el.comments.appendChild(item);
        });
    };

    const render = (img) => {
        const list = img.comments || [];
        if (el.commentsCount) el.commentsCount.textContent = list.length;
        renderComments(list);
        if (el.commentForm) el.commentForm.classList.toggle("hidden", !state.commentsEnabled);
        if (el.commentsDisabled) el.commentsDisabled.classList.toggle("hidden", state.commentsEnabled);
        if (el.commentInput) el.commentInput.value = "";
    };

    const syncCardCount = () => {
        const root = syncCard();
        if (!root) return;
        const total = state.images.reduce((s, im) => s + (im.commentsCount || 0), 0);
        const cardCount = root.querySelector("[data-card-comments]");
        if (cardCount) cardCount.textContent = total;
    };

    const deleteComment = async (commentId) => {
        const img = state.images[state.index];
        if (!img || !commentId) return;

        try {
            const res = await fetch(`/upload/comments/${commentId}`, { method: "DELETE", credentials: "include" });
            const result = await res.json().catch(() => ({}));

            if (!res.ok) {
                showToast(result.message || "No se pudo borrar el comentario.", "error");
                return;
            }

            img.comments = (img.comments || []).filter((c) => String(c.id) !== String(commentId));
            img.commentsCount = img.comments.length;
            render(img);
            syncCardCount();

            showToast("Comentario eliminado.", "success");
        } catch {
            showToast("Error de red.", "error");
        }
    };

    el.commentSend && el.commentSend.addEventListener("click", async () => {
        if (!authenticated) return requireLogin();

        const img = state.images[state.index];
        if (!img || !img.id || !state.commentsEnabled) return;

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
                showToast(result.message || "No se pudo publicar el comentario.", "error");
                return;
            }

            img.comments = img.comments || [];
            img.comments.push(result.comment);
            img.commentsCount = img.comments.length;
            render(img);
            syncCardCount();

            showToast("Comentario publicado!", "success");
        } catch {
            showToast("Error de red.", "error");
        } finally {
            el.commentSend.disabled = false;
        }
    });

    el.comments && el.comments.addEventListener("scroll", report.closePopover);

    el.comments && el.comments.addEventListener("click", (e) => {
        const reportBtn = e.target.closest("[data-comment-report]");
        if (reportBtn) {
            if (!authenticated) return requireLogin();
            return report.openDialog("comment", reportBtn.dataset.commentId);
        }

        const delBtn = e.target.closest("[data-comment-delete]");
        if (delBtn) return deleteComment(delBtn.dataset.commentId);
    });

    ctx.onRender(render);
};
