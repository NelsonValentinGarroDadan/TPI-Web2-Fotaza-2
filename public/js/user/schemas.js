export const profileSchema = {
    nickname: {
        required: true,
        minLength: 3,
        maxLength: 50,
        messages: {
            required: "El nickname es obligatorio.",
            minLength: "Mínimo 3 caracteres.",
            maxLength: "Máximo 50 caracteres."
        }
    },

    biography: {
        required: false,
        maxLength: 200,
        messages: {
            maxLength: "Máximo 200 caracteres."
        }
    }
};
