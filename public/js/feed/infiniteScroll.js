const grid = document.querySelector("[data-feed-grid]");
const sentinel = document.querySelector("[data-feed-sentinel]");

if (grid && sentinel) {
    const endpoint = grid.dataset.feedEndpoint;
    let page = Number(grid.dataset.feedPage || "1");
    let loading = false;
    let done = grid.dataset.feedDone === "true";

    const stop = () => {
        done = true;
        observer.disconnect();
        sentinel.remove();
    };

    const loadMore = async () => {
        if (loading || done) return;
        loading = true;

        const sep = endpoint.includes("?") ? "&" : "?";

        try {
            const res = await fetch(`${endpoint}${sep}page=${page + 1}`, { credentials: "include" });
            if (!res.ok) {
                loading = false;
                return;
            }

            const html = (await res.text()).trim();
            if (!html) {
                stop();
                return;
            }

            grid.insertAdjacentHTML("beforeend", html);
            page += 1;
        } finally {
            loading = false;
        }
    };

    const observer = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) loadMore();
        },
        { rootMargin: "150px" }
    );

    observer.observe(sentinel);
}
