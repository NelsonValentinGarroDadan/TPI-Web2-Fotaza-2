const formatDate = (date) => {
    try {
        return new Date(date).toLocaleDateString("es-AR");
    } catch {
        return "";
    }
};

const formatDateTime = (date) => {
    try {
        return new Date(date).toLocaleString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return "";
    }
};

module.exports = { formatDate, formatDateTime };
