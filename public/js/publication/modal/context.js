import { showToast } from "../../helpers/toast.js";

export const createContext = (modal) => {
    const state = {
        images: [],
        index: 0,
        currentData: null,
        currentRoot: null,
        currentOwner: false,
        commentsEnabled: true,
        currentAuthorId: null,
    };

    const authenticated = modal.dataset.authenticated === "true";
    const currentUserId = Number(modal.dataset.userId) || null;
    const requireLogin = () => { window.location.href = "/autentication/login"; };

    const stars = (rating) => {
        const full = Math.round(rating);
        return "★".repeat(full) + "☆".repeat(Math.max(0, 5 - full));
    };

    const syncCard = () => {
        if (state.currentRoot) state.currentRoot.dataset.publication = JSON.stringify(state.currentData);
        return state.currentRoot;
    };

    const renderHooks = [];
    const openHooks = [];
    const closeHooks = [];

    return {
        modal,
        state,
        authenticated,
        currentUserId,
        requireLogin,
        stars,
        syncCard,
        showToast,
        report: null,
        onRender: (fn) => renderHooks.push(fn),
        onOpen: (fn) => openHooks.push(fn),
        onClose: (fn) => closeHooks.push(fn),
        emitRender: (img, owner) => renderHooks.forEach((fn) => fn(img, owner)),
        emitOpen: (data, owner) => openHooks.forEach((fn) => fn(data, owner)),
        emitClose: () => closeHooks.forEach((fn) => fn()),
    };
};
