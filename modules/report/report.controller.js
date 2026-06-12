const reportService = require("./report.service.js");

module.exports = {
    reportImage: async (req, res) => {
        const result = await reportService.reportImage(
            Number(req.params.id),
            req.user.id,
            { reason: req.body.reason, description: req.body.description }
        );

        res.status(201).send({ ...result, message: "Denuncia registrada!" });
    },

    reportComment: async (req, res) => {
        const result = await reportService.reportComment(
            Number(req.params.id),
            req.user.id,
            { reason: req.body.reason, description: req.body.description }
        );

        res.status(201).send({ ...result, message: "Denuncia registrada!" });
    },

    dismissImageReports: async (req, res) => {
        const result = await reportService.dismissImageReports(Number(req.params.id));

        res.status(200).send({ ...result, message: "Denuncias desestimadas." });
    },

    dismissReport: async (req, res) => {
        const result = await reportService.dismissReport(Number(req.params.id));

        res.status(200).send({ ...result, message: "Denuncia desestimada." });
    },
};
