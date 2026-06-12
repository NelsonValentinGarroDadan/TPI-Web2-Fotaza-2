const REASON_LABELS = {
    inapropiado: "Contenido inapropiado",
    spam: "Spam o enganoso",
    derechos: "Derechos de autor",
    violencia: "Violencia o contenido sensible",
    otro: "Otro",
};

export const initReportsPopover = () => {
    let popover = null;

    const close = () => {
        if (!popover) return;
        popover.remove();
        popover = null;
    };

    const isOpen = () => Boolean(popover);

    const open = (anchor, reports) => {
        close();
        if (!reports.length) return;

        const pop = document.createElement("div");
        pop.className = "fixed flex flex-col bg-bk border-2 border-black shadow-lg";
        pop.style.zIndex = "70";
        pop.style.width = "20vw";
        pop.style.minWidth = "210px";
        pop.style.maxHeight = "40vh";

        const header = document.createElement("div");
        header.className = "shrink-0 flex items-center justify-between gap-2 bg-linear-to-r from-blue to-blue-l px-2 py-1";
        const hTitle = document.createElement("span");
        hTitle.className = "text-white font-bold text-xs truncate";
        hTitle.textContent = `Denuncias (${reports.length})`;
        const hClose = document.createElement("button");
        hClose.type = "button";
        hClose.className = "shrink-0 flex items-center justify-center bg-red-500 hover:bg-red-700 text-white border border-black cursor-pointer leading-none px-1";
        hClose.textContent = "✕";
        hClose.addEventListener("click", close);
        header.append(hTitle, hClose);

        const body = document.createElement("div");
        body.className = "flex-1 min-h-0 overflow-y-auto p-2 flex flex-col gap-1";

        reports.forEach((r) => {
            const group = document.createElement("div");
            group.className = "border border-win-gray bg-white";

            const toggle = document.createElement("button");
            toggle.type = "button";
            toggle.className = "w-full flex items-center justify-between gap-2 px-2 py-1 text-left text-xs font-bold text-black cursor-pointer hover:bg-win-gray-l/30";
            const who = document.createElement("span");
            who.className = "truncate min-w-0";
            who.textContent = `@${r.reporter || "usuario"}`;
            const caret = document.createElement("span");
            caret.className = "shrink-0 opacity-60";
            caret.textContent = "▸";
            toggle.append(who, caret);

            const detail = document.createElement("div");
            detail.className = "hidden border-t border-win-gray px-2 py-1 flex flex-col gap-1 text-xs text-black";

            const reasonP = document.createElement("p");
            const reasonLabel = document.createElement("span");
            reasonLabel.className = "font-bold";
            reasonLabel.textContent = "Causa: ";
            reasonP.append(reasonLabel, document.createTextNode(REASON_LABELS[r.reason] || r.reason || "—"));

            const descP = document.createElement("p");
            descP.className = "whitespace-pre-wrap break-words [overflow-wrap:anywhere]";
            descP.textContent = r.description || "Sin descripcion.";

            const dateP = document.createElement("p");
            dateP.className = "opacity-60";
            dateP.textContent = r.date || "";

            detail.append(reasonP, descP, dateP);

            toggle.addEventListener("click", () => {
                const collapsed = detail.classList.toggle("hidden");
                caret.textContent = collapsed ? "▸" : "▾";
            });

            group.append(toggle, detail);
            body.appendChild(group);
        });

        pop.append(header, body);
        document.body.appendChild(pop);
        popover = pop;

        const rect = anchor.getBoundingClientRect();
        const pad = 8;
        const pw = pop.offsetWidth;
        const ph = pop.offsetHeight;

        let left = rect.left - pw - pad;
        if (left < pad) left = rect.right + pad;
        if (left + pw > window.innerWidth - pad) left = window.innerWidth - pw - pad;
        if (left < pad) left = pad;

        let top = rect.top;
        if (top + ph > window.innerHeight - pad) top = window.innerHeight - ph - pad;
        if (top < pad) top = pad;

        pop.style.left = `${left}px`;
        pop.style.top = `${top}px`;
    };

    document.addEventListener("click", (e) => {
        if (popover && !popover.contains(e.target)) close();
    });

    return { open, close, isOpen };
};
