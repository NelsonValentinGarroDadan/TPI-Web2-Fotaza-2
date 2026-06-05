import { clearErrors, showErrors } from "../helpers/errors.js";

const form = document.getElementById("form-upload");
const dropzone = document.getElementById("dropzone");
const input = document.getElementById("images");
const previews = document.getElementById("previews");

let items = [];
let seq = 0;

const render = () => {
    previews.innerHTML = "";

    if (!items.length) {
        previews.classList.add("hidden");
        return;
    }

    previews.classList.remove("hidden");

    items.forEach((item) => {
        const card = document.createElement("div");
        card.className = "border-2 border-black bg-white p-2 flex gap-3 items-start";
        card.dataset.id = item.id;

        const url = URL.createObjectURL(item.file);

        card.innerHTML = `
            <img src="${url}" class="w-20 h-20 object-cover border border-black shrink-0">
            <div class="flex flex-col gap-1 flex-1 min-w-0">
                <p class="text-xs text-black truncate" data-name></p>
                <div class="flex items-center gap-4 text-xs text-black">
                    <label class="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="license-${item.id}" value="none" checked> Sin copyright
                    </label>
                    <label class="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="license-${item.id}" value="copyright"> Con copyright
                    </label>
                </div>
                <input type="text" data-watermark placeholder="Texto de la marca de agua (opcional)" class="hidden text-xs text-black border border-win-gray px-2 py-1 w-full">
            </div>
            <button type="button" data-remove class="shrink-0 bg-red-500 text-white w-6 h-6 border border-black cursor-pointer">X</button>
        `;

        card.querySelector("[data-name]").textContent = item.file.name;

        const watermark = card.querySelector("[data-watermark]");

        card.querySelectorAll(`input[name="license-${item.id}"]`).forEach((radio) => {
            radio.addEventListener("change", () => {
                const copyright = card.querySelector(`input[value="copyright"]`).checked;
                watermark.classList.toggle("hidden", !copyright);
                item.license = copyright ? "copyright" : "none";
            });
        });

        watermark.addEventListener("input", () => {
            item.watermark = watermark.value;
        });

        card.querySelector("[data-remove]").addEventListener("click", () => {
            items = items.filter((i) => i.id !== item.id);
            render();
        });

        previews.appendChild(card);
    });
};

const addFiles = (fileList) => {
    [...fileList]
        .filter((file) => file.type.startsWith("image/"))
        .forEach((file) => items.push({ id: ++seq, file, license: "none", watermark: "" }));

    render();
};

input.addEventListener("change", (e) => {
    addFiles(e.target.files);
    input.value = "";
});

["dragenter", "dragover"].forEach((ev) =>
    dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        dropzone.classList.add("bg-win-gray-l/60");
    })
);

["dragleave", "drop"].forEach((ev) =>
    dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        dropzone.classList.remove("bg-win-gray-l/60");
    })
);

dropzone.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));

form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const tags = document.getElementById("tags").value.trim();

    const errors = {};
    if (!items.length) errors.images = "Subi al menos una imagen.";
    if (!title) errors.title = "El titulo es obligatorio.";
    if (!tags) errors.tags = "Agrega al menos una etiqueta.";

    if (Object.keys(errors).length) {
        showErrors(errors);
        return;
    }

    const payload = new FormData();
    payload.append("title", title);
    payload.append("description", description);
    payload.append("tags", tags);

    const meta = items.map((item) => ({
        license: item.license,
        watermark: item.license === "copyright" ? item.watermark : "",
    }));

    items.forEach((item) => payload.append("images", item.file));
    payload.append("meta", JSON.stringify(meta));

    window.showToast?.("Formulario valido. Falta conectar el backend de publicaciones.", "info");
});
