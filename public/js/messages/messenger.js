const root = document.querySelector("[data-messenger]");

if (root && window.io) {
    const el = {
        toggle: root.querySelector("[data-msg-toggle]"),
        caret: root.querySelector("[data-msg-caret]"),
        badge: root.querySelector("[data-msg-badge]"),
        panel: root.querySelector("[data-msg-panel]"),
        listView: root.querySelector("[data-msg-list-view]"),
        list: root.querySelector("[data-msg-list]"),
        empty: root.querySelector("[data-msg-empty]"),
        chatView: root.querySelector("[data-msg-chat-view]"),
        back: root.querySelector("[data-msg-back]"),
        chatAvatar: root.querySelector("[data-msg-chat-avatar]"),
        chatName: root.querySelector("[data-msg-chat-name]"),
        chatThumb: root.querySelector("[data-msg-chat-thumb]"),
        messages: root.querySelector("[data-msg-messages]"),
        form: root.querySelector("[data-msg-form]"),
        input: root.querySelector("[data-msg-input]"),
        closed: root.querySelector("[data-msg-closed]"),
    };

    const OPEN_KEY = "fotaza_messenger_open";

    const socket = window.io();

    let conversations = [];
    let openId = null;
    let header = null;
    let loaded = false;
    const seen = new Set();

    const time = (value) => {
        try {
            return new Date(value).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
        } catch {
            return "";
        }
    };

    const totalUnread = () => conversations.reduce((sum, c) => sum + (c.unread || 0), 0);

    const renderBadge = () => {
        const total = totalUnread();
        if (!el.badge) return;
        el.badge.textContent = total > 99 ? "99+" : total;
        el.badge.classList.toggle("hidden", total === 0);
    };

    const sortConversations = () => {
        conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    };

    const renderList = () => {
        if (!el.list) return;
        el.list.innerHTML = "";

        if (el.empty) el.empty.classList.toggle("hidden", conversations.length > 0);

        conversations.forEach((c) => {
            const item = document.createElement("button");
            item.type = "button";
            item.className = "flex items-center gap-2 px-2 py-2 border-b border-win-gray text-left hover:bg-win-gray/20 cursor-pointer";

            const avatar = document.createElement("img");
            avatar.src = c.other.profile_img || "/imgs/profile_img_default.png";
            avatar.alt = "";
            avatar.className = "shrink-0 w-9 h-9 object-cover border border-black";

            const center = document.createElement("div");
            center.className = "flex-1 min-w-0";

            const name = document.createElement("p");
            name.className = "text-sm font-bold text-black truncate";
            name.textContent = `@${c.other.nickname || "usuario"}`;

            const preview = document.createElement("p");
            preview.className = "text-xs text-black opacity-60 truncate";
            preview.textContent = c.lastMessage ? c.lastMessage.content : "Conversacion iniciada";

            center.append(name, preview);

            const right = document.createElement("div");
            right.className = "shrink-0 flex flex-col items-end gap-1";

            if (c.unread > 0) {
                const badge = document.createElement("span");
                badge.className = "min-w-5 h-5 px-1 bg-red-500 text-white text-xs font-bold flex items-center justify-center border border-black";
                badge.textContent = c.unread > 9 ? "9+" : c.unread;
                right.append(badge);
            }

            if (c.imageThumb) {
                const thumb = document.createElement("img");
                thumb.src = c.imageThumb;
                thumb.alt = "";
                thumb.className = "w-7 h-7 object-cover border border-black";
                right.append(thumb);
            }

            item.append(avatar, center, right);
            item.addEventListener("click", () => openChat(c.id));
            el.list.appendChild(item);
        });
    };

    const bubble = (m) => {
        const mine = !header || m.senderId !== header.other.id;
        const wrap = document.createElement("div");
        wrap.className = `max-w-[80%] px-2 py-1 border border-black text-sm ${mine ? "self-end bg-blue-l text-white" : "self-start bg-white text-black"}`;
        wrap.dataset.messageId = m.id;

        const body = document.createElement("p");
        body.className = "whitespace-pre-wrap break-words [overflow-wrap:anywhere]";
        body.textContent = m.content;

        const meta = document.createElement("span");
        meta.className = `block text-[10px] mt-0.5 ${mine ? "text-white/70 text-right" : "text-black/50"}`;
        meta.textContent = time(m.createdAt);

        if (m.image) {
            const pic = document.createElement("img");
            pic.src = m.image;
            pic.alt = "";
            pic.className = "mb-1 w-full max-h-40 object-contain border border-black bg-white";
            wrap.append(pic);
        }

        wrap.append(body, meta);
        return wrap;
    };

    const scrollMessages = () => {
        if (el.messages) el.messages.scrollTop = el.messages.scrollHeight;
    };

    const appendMessage = (m) => {
        if (seen.has(m.id)) return;
        seen.add(m.id);
        if (el.messages) el.messages.appendChild(bubble(m));
        scrollMessages();
    };

    const showList = () => {
        openId = null;
        header = null;
        if (el.chatView) el.chatView.classList.add("hidden");
        if (el.listView) el.listView.classList.remove("hidden");
        renderList();
    };

    const openChat = async (id) => {
        openId = id;
        seen.clear();
        if (el.listView) el.listView.classList.add("hidden");
        if (el.chatView) el.chatView.classList.remove("hidden");
        if (el.messages) el.messages.innerHTML = "";

        try {
            const res = await fetch(`/messages/conversations/${id}`, { credentials: "include" });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                window.showToast?.(data.message || "No se pudo abrir la conversacion.", "error");
                return showList();
            }

            header = data.conversation;
            if (el.chatName) {
                el.chatName.textContent = `@${header.other.nickname || "usuario"}`;
                el.chatName.href = header.other.id ? `/profile/${header.other.id}` : "#";
            }
            if (el.chatAvatar) el.chatAvatar.src = header.other.profile_img || "/imgs/profile_img_default.png";
            if (el.chatThumb) el.chatThumb.src = header.imageThumb || "";

            const isClosed = Boolean(header.closed);
            if (el.form) el.form.classList.toggle("hidden", isClosed);
            if (el.closed) el.closed.classList.toggle("hidden", !isClosed);

            (data.messages || []).forEach(appendMessage);

            const conv = conversations.find((c) => c.id === id);
            if (conv) { conv.unread = 0; renderBadge(); }
            socket.emit("conversation:read", { conversationId: id });

            if (!isClosed && el.input) el.input.focus();
        } catch {
            window.showToast?.("Error de red.", "error");
            showList();
        }
    };

    const loadConversations = async () => {
        try {
            const res = await fetch("/messages/conversations", { credentials: "include" });
            const data = await res.json().catch(() => ({ conversations: [] }));
            conversations = data.conversations || [];
        } catch {
            conversations = [];
        }
        loaded = true;
        sortConversations();
        renderList();
        renderBadge();
    };

    const setOpen = (open) => {
        if (el.panel) el.panel.classList.toggle("hidden", !open);
        if (el.panel) el.panel.classList.toggle("flex", open);
        if (el.caret) el.caret.textContent = open ? "▾" : "▴";
        localStorage.setItem(OPEN_KEY, open ? "1" : "0");
        if (open && !loaded) loadConversations();
    };

    el.toggle && el.toggle.addEventListener("click", () => {
        const isOpen = el.panel && !el.panel.classList.contains("hidden");
        setOpen(!isOpen);
    });

    el.back && el.back.addEventListener("click", showList);

    el.form && el.form.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = (el.input && el.input.value || "").trim();
        if (!text || !openId) return;

        const conversationId = openId;
        el.input.value = "";

        socket.emit("message:send", { conversationId, content: text }, async (ack) => {
            if (ack && ack.ok) return;

            try {
                const res = await fetch(`/messages/conversations/${conversationId}/messages`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: text }),
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) return window.showToast?.(data.message || "No se pudo enviar.", "error");
                if (openId === conversationId && data.message) appendMessage(data.message);
            } catch {
                window.showToast?.("No se pudo enviar el mensaje.", "error");
            }
        });
    });

    socket.on("message:new", (m) => {
        const conv = conversations.find((c) => c.id === m.conversationId);
        if (conv) {
            conv.lastMessage = { content: m.content, senderId: m.senderId, createdAt: m.createdAt };
            conv.updatedAt = m.createdAt;
            const incoming = m.senderId === conv.other.id;
            if (openId === m.conversationId) {
                appendMessage(m);
                if (incoming) socket.emit("conversation:read", { conversationId: m.conversationId });
            } else if (incoming) {
                conv.unread = (conv.unread || 0) + 1;
            }
            sortConversations();
            if (openId === null) renderList();
            renderBadge();
        } else {
            loadConversations();
        }
    });

    socket.on("conversation:new", (conv) => {
        if (!conversations.some((c) => c.id === conv.id)) conversations.unshift(conv);
        sortConversations();
        if (openId === null) renderList();
        renderBadge();
    });

    socket.on("connect", () => { if (loaded) loadConversations(); });

    window.openMessenger = async (conversationId) => {
        setOpen(true);
        if (!loaded) await loadConversations();
        if (conversationId) openChat(conversationId);
    };

    if (localStorage.getItem(OPEN_KEY) === "1") setOpen(true);
    else loadConversations();
}
