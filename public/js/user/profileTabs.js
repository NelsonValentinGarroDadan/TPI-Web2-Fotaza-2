import { renderPublications } from "./renderPublications.js";
import { renderCollections } from "./renderCollections.js";

const content = document.getElementById("tab-content");

const tabs = [
    { id: "btn-publications", render: renderPublications },
    { id: "btn-collection", render: renderCollections },
];

const buttons = tabs.map((tab) => document.getElementById(tab.id));

const setActive = (id) => {
    tabs.forEach((tab, i) => {
        const on = tab.id === id;
        buttons[i].classList.toggle("text-white", on);
        buttons[i].classList.toggle("bg-win-gray/40", on);
        buttons[i].classList.toggle("text-black", !on);
        if (on) tab.render(content);
    });
};

tabs.forEach((tab, i) => buttons[i].addEventListener("click", () => setActive(tab.id)));

setActive("btn-publications");
