import { renderCollections } from "./renderCollections.js";

const tabs = [
    { id: "btn-publications", panel: "panel-publications" },
    { id: "btn-collection", panel: "panel-collection", render: renderCollections },
];

const setActive = (id) => {
    tabs.forEach((tab) => {
        const btn = document.getElementById(tab.id);
        const panel = document.getElementById(tab.panel);
        if (!btn || !panel) return;

        const on = tab.id === id;
        btn.classList.toggle("text-white", on);
        btn.classList.toggle("bg-win-gray/40", on);
        btn.classList.toggle("text-black", !on);
        panel.classList.toggle("hidden", !on);

        if (on && tab.render) tab.render(panel);
    });
};

tabs.forEach((tab) => {
    const btn = document.getElementById(tab.id);
    if (btn) btn.addEventListener("click", () => setActive(tab.id));
});

setActive("btn-publications");
