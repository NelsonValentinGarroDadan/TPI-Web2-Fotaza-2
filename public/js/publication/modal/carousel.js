export const initCarousel = (ctx) => {
    const { modal, state } = ctx;

    const el = {
        image: modal.querySelector("[data-pv-image]"),
        bg: modal.querySelector("[data-pv-bg]"),
        prev: modal.querySelector("[data-pv-prev]"),
        next: modal.querySelector("[data-pv-next]"),
        counter: modal.querySelector("[data-pv-counter]"),
    };

    const render = () => {
        const single = state.images.length <= 1;
        [el.prev, el.next, el.counter].forEach((node) => node && node.classList.toggle("hidden", single));

        if (!state.images.length) {
            el.image.removeAttribute("src");
            if (el.bg) el.bg.removeAttribute("src");
            return;
        }

        const img = state.images[state.index];
        el.image.src = img.url;
        if (el.bg) el.bg.src = img.url;
        if (el.counter) el.counter.textContent = `${state.index + 1} / ${state.images.length}`;
        ctx.emitRender(img, state.currentOwner);
    };

    el.prev && el.prev.addEventListener("click", () => {
        state.index = (state.index - 1 + state.images.length) % state.images.length;
        render();
    });

    el.next && el.next.addEventListener("click", () => {
        state.index = (state.index + 1) % state.images.length;
        render();
    });

    ctx.onOpen(() => {
        state.index = 0;
        render();
    });
};
