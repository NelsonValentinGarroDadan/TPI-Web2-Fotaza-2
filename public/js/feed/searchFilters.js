const widgets = {};

const enforce = (changed) => {
    const min = widgets.minRating;
    const max = widgets.maxRating;
    if (!min || !max) return;

    if (changed === "minRating" && min.get() && max.get() && min.get() > max.get()) {
        max.set(min.get());
    }
    if (changed === "maxRating" && min.get() && max.get() && max.get() < min.get()) {
        min.set(max.get());
    }
};

document.querySelectorAll("[data-star-filter]").forEach((box) => {
    const input = box.querySelector("input[type=hidden]");
    if (!input) return;

    const name = input.name;
    let value = Number(input.value) || 0;
    const stars = [];

    const paint = (n) => {
        stars.forEach((s, i) => {
            s.textContent = i < n ? "★" : "☆";
            s.classList.toggle("text-yellow-500", i < n);
            s.classList.toggle("text-win-gray", i >= n);
        });
    };

    const set = (v) => {
        value = v;
        input.value = v || "";
        paint(v);
    };

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.className = "cursor-pointer";
        star.textContent = "☆";
        star.addEventListener("mouseenter", () => paint(i));
        star.addEventListener("click", () => {
            set(value === i ? 0 : i);
            enforce(name);
        });
        stars.push(star);
        box.appendChild(star);
    }

    box.addEventListener("mouseleave", () => paint(value));
    paint(value);

    widgets[name] = { get: () => value, set };
});
