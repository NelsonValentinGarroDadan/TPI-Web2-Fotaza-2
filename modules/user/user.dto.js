const z = require('zod');

module.exports = {
    updateProfileDTO: z.object({
        nickname: z.string({ error: "El nickname es obligatorio." })
            .min(3, { error: "Tu nickname debe tener 3 caracteres como minimo." })
            .max(50, { error: "Tu nickname no puede tener mas de 50 caracteres." })
            .optional(),
        biography: z.string()
            .max(200, { error: "La biografia no puede tener mas de 200 caracteres." })
            .optional(),
    }),
};
