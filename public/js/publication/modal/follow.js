export const initFollow = (ctx) => {
    const { modal, state, currentUserId, authenticated, requireLogin, syncCard, showToast } = ctx;

    const followEl = modal.querySelector("[data-pv-follow]");
    if (!followEl) return;

    const followBase = "ml-auto shrink-0 px-3 py-1 text-sm border border-black cursor-pointer";
    let following = false;

    const renderFollow = (isFollowing) => {
        following = isFollowing;
        followEl.textContent = isFollowing ? "Siguiendo" : "Seguir";
        followEl.className = `${followBase} ${isFollowing ? "bg-win-gray/30 hover:bg-win-gray/50 text-black" : "bg-blue-l hover:bg-blue text-white"}`;
    };

    followEl.addEventListener("click", async () => {
        if (!authenticated) return requireLogin();
        if (!state.currentAuthorId) return;

        const method = following ? "DELETE" : "POST";
        followEl.disabled = true;

        try {
            const res = await fetch(`/profile/${state.currentAuthorId}/follow`, { method, credentials: "include" });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                showToast(data.message || "No se pudo completar la accion.", "error");
                return;
            }

            renderFollow(!following);

            if (state.currentData && state.currentData.author) {
                state.currentData.author.isFollowing = following;
                syncCard();
            }

            showToast(following ? "Ahora seguis a este usuario." : "Dejaste de seguir a este usuario.", "success");
        } catch {
            showToast("Error de red.", "error");
        } finally {
            followEl.disabled = false;
        }
    });

    ctx.onOpen((data) => {
        const author = data.author || {};
        const showFollow = Boolean(author.id) && author.id !== currentUserId;
        if (showFollow) {
            renderFollow(Boolean(author.isFollowing));
            followEl.classList.remove("hidden");
        } else {
            followEl.classList.add("hidden");
        }
    });
};
