const z = require('zod');

module.exports = {
    registerDTO : z.object({
        nickname : z.string({ error : "El nickname es obligatorio." })
                    .max( 50, { error : "Tu nickname no puede tener mas de 50 caracteres."}),
        password : z.string( { error : "La contraseña es obligatoria." } )
                    .min( 6, { error : "La contraseña debe tener 6 caractes como minimo." }),
        biography : z.string().max(200, { error : "La biografica no puede tener mas de 200 caracteres." } ).optional(), 
        active : z.boolean().optional(),
        is_admin : z.boolean().optional(),
    
    }),
    loginDTO :z.object({
        nickname : z.string({ error : "El nickname es obligatorio." }),
        password : z.string( { error : "La contraseña es obligatoria." } ),
    }),
}