const z = require('zod');

module.exports = {
    createCollectionDTO: z.object({
        name: z.string({ error: "El nombre de la coleccion es obligatorio." })
            .trim()
            .min(1, { error: "El nombre no puede estar vacio." })
            .max(50, { error: "El nombre no puede tener mas de 50 caracteres." }),
    }),
    addPublicationDTO: z.object({
        publicationId: z.coerce.number({ error: "La publicacion es obligatoria." })
            .int({ error: "Identificador invalido." })
            .positive({ error: "Identificador invalido." }),
    }),
};
