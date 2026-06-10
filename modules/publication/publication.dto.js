const z = require('zod');

module.exports = {
    commentDTO: z.object({
        content: z.string({ error: "El comentario es obligatorio." })
            .trim()
            .min(1, { error: "El comentario no puede estar vacio." })
            .max(250, { error: "El comentario no puede tener mas de 250 caracteres." }),
    }),
    ratingDTO: z.object({
        value: z.coerce.number({ error: "La calificacion es obligatoria." })
            .int({ error: "La calificacion debe ser un numero entero." })
            .min(1, { error: "La calificacion minima es 1." })
            .max(5, { error: "La calificacion maxima es 5." }),
    }),
};
