import { createContext } from "./modal/context.js";
import { initDetails } from "./modal/details.js";
import { initCarousel } from "./modal/carousel.js";
import { initRating } from "./modal/rating.js";
import { initComments } from "./modal/comments.js";
import { initCollections } from "./modal/collections.js";
import { initFollow } from "./modal/follow.js";
import { initInterest } from "./modal/interest.js";
import { initReportDialog } from "../report/reportDialog.js";
import { initReportsPopover } from "../report/reportsPopover.js";

const modal = document.querySelector("[data-pub-modal]");

if (modal) {
    const ctx = createContext(modal);
    const { state, authenticated, requireLogin } = ctx;

    const dialog = initReportDialog();
    const popover = initReportsPopover();
    ctx.report = {
        openDialog: dialog.open,
        closeDialog: dialog.close,
        openPopover: popover.open,
        closePopover: popover.close,
        popoverIsOpen: popover.isOpen,
    };

    initDetails(ctx);
    initFollow(ctx);
    initCollections(ctx);
    initRating(ctx);
    initComments(ctx);
    initInterest(ctx);
    initCarousel(ctx);

    const reportBtn = modal.querySelector("[data-pv-report]");

    const open = (data, owner) => {
        state.currentData = data;
        state.currentOwner = owner;
        state.images = data.images || [];
        state.commentsEnabled = data.commentsEnabled !== false;
        state.currentAuthorId = data.author?.id || null;

        ctx.report.closeDialog();
        ctx.emitOpen(data, owner);

        modal.classList.remove("hidden");
        modal.classList.add("flex");
        document.body.style.overflow = "hidden";
    };

    const close = () => {
        ctx.emitClose();
        ctx.report.closeDialog();
        ctx.report.closePopover();
        modal.classList.add("hidden");
        modal.classList.remove("flex");
        document.body.style.overflow = "";
    };

    reportBtn && reportBtn.addEventListener("click", () => {
        if (!authenticated) return requireLogin();
        const img = state.images[state.index];
        if (!img || !img.id) return;
        ctx.report.openDialog("image", img.id);
    });

    const closeEl = modal.querySelector("[data-modal-close]");
    const backdrop = modal.querySelector("[data-modal-backdrop]");
    closeEl && closeEl.addEventListener("click", close);
    backdrop && backdrop.addEventListener("click", close);

    document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape" || modal.classList.contains("hidden")) return;
        if (ctx.report.popoverIsOpen()) return ctx.report.closePopover();
        close();
    });

    const openFromRoot = (root) => {
        let data = {};
        try {
            data = JSON.parse(root.dataset.publication || "{}");
        } catch {
            data = {};
        }
        state.currentData = data;
        state.currentRoot = root;
        open(data, root.dataset.owner === "true");
    };

    document.addEventListener("click", (e) => {
        const card = e.target.closest("[data-card]");
        if (!card) return;

        const root = card.closest("[data-pub]");
        if (!root) return;

        openFromRoot(root);
    });

    const openById = (pubId) => {
        const root = [...document.querySelectorAll("[data-pub]")].find((r) => {
            try {
                return String(JSON.parse(r.dataset.publication || "{}").id) === String(pubId);
            } catch {
                return false;
            }
        });
        if (root) openFromRoot(root);
    };

    const pubFromQuery = new URLSearchParams(window.location.search).get("publication");
    if (pubFromQuery) openById(pubFromQuery);
}
