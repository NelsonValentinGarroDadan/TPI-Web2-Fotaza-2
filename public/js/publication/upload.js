import { clearErrors, showErrors } from "../helpers/errors.js";

const form = document.getElementById("form-upload");
const dropzone = document.getElementById("dropzone");
const input = document.getElementById("images");
const previews = document.getElementById("previews");
const btnAddMore = document.getElementById("btn-add-more");
const btnPublish = document.getElementById("btn-publish");

const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const tagsInput = document.getElementById("tags");

const pv = {
    title: document.querySelector("[data-pv-title]"),
    description: document.querySelector("[data-pv-description]"),
    tags: document.querySelector("[data-pv-tags]"),
    image: document.querySelector("[data-pv-image]"),
    empty: document.querySelector("[data-pv-empty]"),
    watermark: document.querySelector("[data-pv-watermark]"),
    counter: document.querySelector("[data-pv-counter]"),
    prev: document.querySelector("[data-pv-prev]"),
    next: document.querySelector("[data-pv-next]"),
};

let items = [];
let seq = 0;
let pvIndex = 0;

const updatePreviewMeta = () => {
    const title = titleInput.value.trim() || "Titulo de la publicacion";
    pv.title.textContent = title;
    pv.description.textContent = descInput.value.trim() || "Sin descripcion";

    pv.tags.innerHTML = "";
    tagsInput.value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((t) => {
            const chip = document.createElement("span");
            chip.className = "px-2 py-0.5 text-xs text-black bg-win-gray-l/40 border border-black";
            chip.textContent = `#${t}`;
            pv.tags.appendChild(chip);
        });
};

const updateWatermarkOverlay = () => {
    const item = items[pvIndex];

    if (item && item.license === "copyright" && item.watermark.trim()) {
        pv.watermark.textContent = item.watermark;
        pv.watermark.classList.remove("hidden");
    } else {
        pv.watermark.classList.add("hidden");
    }
};

const updatePreviewCarousel = () => {
    const showArrows = items.length > 1;
    pv.prev.classList.toggle("hidden", !showArrows);
    pv.next.classList.toggle("hidden", !showArrows);
    pv.counter.classList.toggle("hidden", !showArrows);

    if (!items.length) {
        pv.image.classList.add("hidden");
        pv.empty.classList.remove("hidden");
        pv.counter.textContent = "";
        updateWatermarkOverlay();
        return;
    }

    if (pvIndex >= items.length) pvIndex = items.length - 1;
    if (pvIndex < 0) pvIndex = 0;

    pv.empty.classList.add("hidden");
    pv.image.classList.remove("hidden");
    pv.image.src = URL.createObjectURL(items[pvIndex].file);
    pv.counter.textContent = `${pvIndex + 1} / ${items.length}`;
    updateWatermarkOverlay();
};

pv.prev.addEventListener("click", () => {
    if (!items.length) return;
    pvIndex = (pvIndex - 1 + items.length) % items.length;
    updatePreviewCarousel();
});

pv.next.addEventListener("click", () => {
    if (!items.length) return;
    pvIndex = (pvIndex + 1) % items.length;
    updatePreviewCarousel();
});

[titleInput, descInput, tagsInput].forEach((el) => el.addEventListener("input", updatePreviewMeta));

const render = () => {
    previews.innerHTML = "";

    dropzone.classList.toggle("hidden", items.length > 0);
    previews.classList.toggle("hidden", !items.length);
    btnAddMore.classList.toggle("hidden", !items.length);

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
                updateWatermarkOverlay();
            });
        });

        watermark.addEventListener("input", () => {
            item.watermark = watermark.value;
            updateWatermarkOverlay();
        });

        card.querySelector("[data-remove]").addEventListener("click", () => {
            items = items.filter((i) => i.id !== item.id);
            render();
            updatePreviewCarousel();
        });

        previews.appendChild(card);
    });

    updatePreviewCarousel();
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

btnAddMore.addEventListener("click", () => input.click());

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

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    const tags = tagsInput.value.trim();

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

    btnPublish.disabled = true;
    btnPublish.textContent = "Publicando...";

    const res = await fetch("/upload", { method: "POST", credentials: "include", body: payload });
    const data = await res.json().catch(() => ({}));

    btnPublish.disabled = false;
    btnPublish.textContent = "Publicar";

    if (!res.ok) {
        window.showToast?.(data.message || "No se pudo crear la publicacion.", "error");
        return;
    }

    window.showToast?.("Publicacion creada!", "success");
    setTimeout(() => { window.location.href = "/"; }, 800);
});

updatePreviewMeta();
updatePreviewCarousel();
