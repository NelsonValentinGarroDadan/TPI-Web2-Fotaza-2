const btnFollow = document.getElementById("btn-follow");
const followersCount = document.getElementById("followers-count");

const base = "px-4 py-2 text-sm cursor-pointer";
const followClass = `${base} bg-blue-l hover:bg-blue text-white border border-black`;
const followingClass = `${base} bg-win-gray/30 hover:bg-win-gray/50 text-black`;

const render = (isFollowing) => {
    btnFollow.dataset.following = isFollowing;
    btnFollow.textContent = isFollowing ? "Siguiendo" : "Seguir";
    btnFollow.className = isFollowing ? followingClass : followClass;
};

const toggleFollow = async () => {
    const id = btnFollow.dataset.id;
    const wasFollowing = btnFollow.dataset.following === "true";
    const method = wasFollowing ? "DELETE" : "POST";

    btnFollow.disabled = true;

    const res = await fetch(`/profile/${id}/follow`, { method, credentials: "include" });

    btnFollow.disabled = false;

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        window.showToast?.(data.message || "No se pudo completar la accion.", "error");
        return;
    }

    render(!wasFollowing);
    followersCount.textContent = Number(followersCount.textContent) + (wasFollowing ? -1 : 1);
};

if (btnFollow) btnFollow.addEventListener("click", toggleFollow);
