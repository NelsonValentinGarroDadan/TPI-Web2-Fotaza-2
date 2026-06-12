import { showToast } from "../helpers/toast.js";
import { sendReport } from "./senders.js";

export const initReportDialog = () => {
    const dialog = document.querySelector("[data-report-dialog]");
    if (!dialog) return { open: () => {} };

    const el = {
        backdrop: dialog.querySelector("[data-report-backdrop]"),
        title: dialog.querySelector("[data-report-title]"),
        reason: dialog.querySelector("[data-report-reason]"),
        description: dialog.querySelector("[data-report-description]"),
        error: dialog.querySelector("[data-report-error]"),
        submit: dialog.querySelector("[data-report-submit]"),
    };

    let target = null;

    const open = (type, id) => {
        target = { type, id };
        if (el.title) el.title.textContent = type === "comment" ? "Denunciar comentario" : "Denunciar imagen";
        if (el.reason) el.reason.selectedIndex = 0;
        if (el.description) el.description.value = "";
        if (el.error) el.error.classList.add("hidden");
        dialog.classList.remove("opacity-0", "pointer-events-none");
        dialog.classList.add("opacity-100", "pointer-events-auto");
    };

    const close = () => {
        target = null;
        dialog.classList.add("opacity-0", "pointer-events-none");
        dialog.classList.remove("opacity-100", "pointer-events-auto");
    };

    const submit = async () => {
        if (!target) return;

        const reason = el.reason ? el.reason.value : "";
        const description = (el.description && el.description.value || "").trim();

        if (!description) {
            if (el.error) {
                el.error.textContent = "Conta el motivo de la denuncia.";
                el.error.classList.remove("hidden");
            }
            return;
        }

        if (el.submit) el.submit.disabled = true;

        try {
            const { ok, result } = await sendReport(target.type, target.id, { reason, description });

            if (!ok) {
                showToast(result.message || "No se pudo registrar la denuncia.", "error");
                return;
            }

            close();
            showToast("Denuncia registrada!", "success");
        } catch {
            showToast("Error de red.", "error");
        } finally {
            if (el.submit) el.submit.disabled = false;
        }
    };

    el.submit && el.submit.addEventListener("click", submit);
    el.backdrop && el.backdrop.addEventListener("click", close);
    dialog.querySelectorAll("[data-report-cancel]").forEach((b) => b.addEventListener("click", close));

    return { open, close };
};
