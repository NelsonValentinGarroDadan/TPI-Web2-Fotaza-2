const z = require('zod');

const REPORT_REASONS = ["inapropiado", "spam", "derechos", "violencia", "otro"];

module.exports = {
    REPORT_REASONS,
    reportDTO: z.object({
        reason: z.enum(REPORT_REASONS, { error: "Elegi un motivo valido." }),
        description: z.string({ error: "La descripcion es obligatoria." })
            .trim()
            .min(1, { error: "Contanos el motivo de la denuncia." })
            .max(250, { error: "La descripcion no puede tener mas de 250 caracteres." }),
    }),
};
