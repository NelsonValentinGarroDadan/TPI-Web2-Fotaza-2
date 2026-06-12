const reportService = require("../report/report.service");

module.exports = {
    getDashboard: async () => {
        const queue = await reportService.getModerationQueue();

        return { queue };
    },
};
