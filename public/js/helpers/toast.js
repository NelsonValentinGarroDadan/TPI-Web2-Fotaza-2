const TYPES = {
    error:   { title: "Error",  bar: "from-red-600 to-red-400" },
    info:    { title: "Aviso",  bar: "from-blue to-blue-l" },
    success: { title: "Listo",  bar: "from-green-600 to-green-400" },
};

const ensureContainer = () => {
    let container = document.getElementById("toast-container");

    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "fixed top-4 right-4 z-50 flex flex-col gap-2 items-end";
        document.body.appendChild(container);
    }

    return container;
};

export const showToast = (message, type = "info", duration = 5000) => {
    const meta = TYPES[type] || TYPES.info;
    const container = ensureContainer();

    const toast = document.createElement("div");
    toast.className = "border-2 border-black w-72 shadow-md";
    toast.style.transition = "opacity .15s ease-out, transform .15s ease-out";
    toast.style.opacity = "0";
    toast.style.transform = "translateX(10px)";

    toast.innerHTML = `
        <div class="border-t-white border-l-white border-r-win-gray border-b-win-gray border-[0.5px] bg-white">
            <div class="flex items-center justify-between bg-linear-to-r ${meta.bar} px-2 py-1">
                <div class="flex items-center gap-1">
                    <img src="/icons/camera.svg" class="w-4 h-4" alt="">
                    <span class="text-white text-xs font-bold">${meta.title} - Fotaza 2</span>
                </div>
                <button type="button" data-close class="text-white text-xs font-bold px-1 leading-none cursor-pointer" aria-label="Cerrar">X</button>
            </div>
            <p data-msg class="text-black text-sm px-3 py-3"></p>
        </div>
    `;

    toast.querySelector("[data-msg]").textContent = message;

    const remove = () => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(10px)";
        setTimeout(() => {
            toast.remove();
            if (!container.children.length) container.remove();
        }, 150);
    };

    toast.querySelector("[data-close]").addEventListener("click", remove);

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(0)";
    });

    if (duration > 0) setTimeout(remove, duration);

    return remove;
};

if (typeof window !== "undefined") window.showToast = showToast;
