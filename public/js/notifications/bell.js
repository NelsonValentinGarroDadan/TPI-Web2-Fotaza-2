const badge = document.querySelector("[data-notif-badge]");

if (badge) {
    let count = 0;

    const render = () => {
        badge.textContent = count > 99 ? "99+" : count;
        badge.classList.toggle("hidden", count === 0);
    };

    const setCount = (value) => {
        count = Math.max(0, Number(value) || 0);
        render();
    };

    const load = async () => {
        try {
            const res = await fetch("/notifications/unread-count", { credentials: "include" });
            const data = await res.json().catch(() => ({ count: 0 }));
            setCount(data.count);
        } catch {
            setCount(0);
        }
    };

    window.refreshNotifBadge = load;
    window.setNotifBadge = setCount;

    if (window.io) {
        const socket = window.io();
        socket.on("notification:new", (n) => {
            setCount(count + 1);
            window.showToast?.(`@${n.actor?.nickname || "alguien"} ${n.text}`, "info");
        });
        socket.on("connect", load);
    }

    load();
}
