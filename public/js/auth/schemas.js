export const registerSchema = {
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

    password: {
        required: true,
        minLength: 6,
        messages: {
            required: "La contraseña es obligatoria.",
            minLength: "Mínimo 6 caracteres."
        }
    },

    "confirm-password": {
        required: true,
        match: "password",
        messages: {
            required: "Debes confirmar la contraseña.",
            match: "Las contraseñas no coinciden."
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

export const loginSchema = {
    nickname: {
        required: true,
        messages: {
            required: "El nickname es obligatorio.",
        }
    },

    password: {
        required: true,
        messages: {
            required: "La contraseña es obligatoria.",
        }
    },
};