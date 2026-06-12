const z = require('zod');

module.exports = {
    interestDTO: z.object({
        imageId: z.coerce.number({ error: "La imagen es obligatoria." })
            .int({ error: "Identificador invalido." })
            .positive({ error: "Identificador invalido." }),
    }),
    sendMessageDTO: z.object({
        content: z.string({ error: "El mensaje es obligatorio." })
            .trim()
            .min(1, { error: "El mensaje no puede estar vacio." })
            .max(1000, { error: "El mensaje es demasiado largo." }),
    }),
};
