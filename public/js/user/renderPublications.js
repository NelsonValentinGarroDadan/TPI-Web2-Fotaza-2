export const renderPublications = async (container) => {
    container.innerHTML = `<p class="text-sm text-black opacity-60 p-4">Cargando publicaciones...</p>`;

    const res = await fetch("/upload/mine", { credentials: "include" });
    const data = await res.json().catch(() => ({ publications: [] }));

    if (!res.ok) {
        container.innerHTML = `<p class="text-sm text-red-500 p-4">No se pudieron cargar las publicaciones.</p>`;
        return;
    }

    const publications = data.publications || [];

    if (!publications.length) {
        container.innerHTML = `<p class="text-sm text-black opacity-60 p-4">Todavia no tenes publicaciones.</p>`;
        return;
    }

    container.innerHTML = "";

    const grid = document.createElement("div");
    grid.className = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3";

    publications.forEach((p) => {
        const card = document.createElement("div");
        card.className = "border-2 border-black bg-white";

        card.innerHTML = `
            <div class="aspect-square bg-win-gray-l/40 overflow-hidden flex items-center justify-center">
                ${p.cover ? `<img class="w-full h-full object-cover" data-cover>` : `<span class="text-win-gray text-xs">Sin imagen</span>`}
            </div>
            <div class="flex items-center justify-between gap-1 px-2 py-1">
                <p class="text-xs text-black truncate" data-title></p>
                <span class="text-[10px] text-black opacity-60 shrink-0">${p.imageCount} img</span>
            </div>
        `;

        card.querySelector("[data-title]").textContent = p.title;
        if (p.cover) card.querySelector("[data-cover]").src = p.cover;

        grid.appendChild(card);
    });

    container.appendChild(grid);
};
