import { showToast } from "/js/helpers/toast.js";
import { sendTakedown, sendDismiss, sendDismissReport } from "./senders.js";

const queue = document.querySelector("[data-queue]");
const confirmEl = document.querySelector("[data-confirm]");

const CONFIRM_MESSAGES = {
    takedown: "Vas a dar de baja esta publicacion. Si el autor llega a 3 publicaciones bajadas, su cuenta se inactiva. Continuar?",
    dismiss: "Vas a desestimar TODAS las denuncias de esta imagen y sacarla de la lista. Continuar?",
    "dismiss-report": "Vas a desestimar esta denuncia. Continuar?",
};

const confirmAction = (message) => new Promise((resolve) => {
    if (!confirmEl) {
        resolve(window.confirm(message));
        return;
    }

    const messageEl = confirmEl.querySelector("[data-confirm-message]");
    const okBtn = confirmEl.querySelector("[data-confirm-ok]");
    const cancelEls = confirmEl.querySelectorAll("[data-confirm-cancel]");

    if (messageEl) messageEl.textContent = message;
    confirmEl.classList.remove("opacity-0", "pointer-events-none");
    confirmEl.classList.add("opacity-100", "pointer-events-auto");

    const close = (result) => {
        confirmEl.classList.add("opacity-0", "pointer-events-none");
        confirmEl.classList.remove("opacity-100", "pointer-events-auto");
        okBtn.removeEventListener("click", onOk);
        cancelEls.forEach((el) => el.removeEventListener("click", onCancel));
        resolve(result);
    };
    const onOk = () => close(true);
    const onCancel = () => close(false);

    okBtn.addEventListener("click", onOk);
    cancelEls.forEach((el) => el.addEventListener("click", onCancel));
});

const removeItem = (item) => {
    item.remove();
    if (queue && !queue.querySelector("[data-queue-item]")) window.location.reload();
};

const refreshCount = (item) => {
    const remaining = item.querySelectorAll("[data-report-id]").length;
    const badge = item.querySelector("[data-report-count]");
    if (badge) badge.textContent = `${remaining} denuncias`;
};

const actions = {
    takedown: async (item) => {
        const res = await sendTakedown(item.dataset.publicationId);
        if (res.ok) removeItem(item);
        return res;
    },
    dismiss: async (item) => {
        const res = await sendDismiss(item.dataset.imageId);
        if (res.ok) removeItem(item);
        return res;
    },
    "dismiss-report": async (item, button) => {
        const row = button.closest("[data-report-id]");
        const res = await sendDismissReport(row.dataset.reportId);
        if (res.ok) {
            row.remove();
            refreshCount(item);
            if (!res.result.stillFlagged) removeItem(item);
        }
        return res;
    },
};

if (queue) {
    queue.addEventListener("click", async (e) => {
        const button = e.target.closest("[data-action]");
        if (!button) return;

        const item = button.closest("[data-queue-item]");
        const key = button.dataset.action;
        const action = actions[key];
        if (!item || !action) return;

        const confirmed = await confirmAction(CONFIRM_MESSAGES[key] || "Confirmar accion?");
        if (!confirmed) return;

        button.disabled = true;

        const { ok, result } = await action(item, button);

        if (!ok) {
            button.disabled = false;
            showToast(result.message || "No se pudo completar la accion.", "error");
            return;
        }

        showToast(result.message || "Listo.", "success");
    });
}
