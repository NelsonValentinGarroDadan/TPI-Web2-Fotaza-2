const adminService = require("./admin.service.js");

module.exports = {
    dashboardRenderView: async (req, res) => {
        const { queue } = await adminService.getDashboard();

        res.render("admin/dashboard.pug", { queue });
    },
};
