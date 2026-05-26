import { clearErrors, showErrors } from "../helpers/errors.js";
import { validate } from "../helpers/validator.js";
import { registerSchema } from "./registerSchema.js";
import { sendRegister } from "./sendRegister.js";

const button = document.getElementById("button-submit-register");
const form = document.getElementById("form-register");
const formErro = document.getElementById("form-error");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = {
        nickname:
            document.getElementById("nickname").value,

        password:
            document.getElementById("password").value,

        "confirm-password":
            document.getElementById("confirm-password").value,

        biography:
            document.getElementById("biography").value,
    };

    clearErrors();

    const errors = validate(
        registerSchema,
        formData
    ); 
    
    if (Object.keys(errors).length > 0) {

        showErrors(errors);

        return;
    }

    button.disabled = true;
    button.textContent = "Cargando...";

    const response = await sendRegister(formData);

    if (!response.ok) {
        button.disabled = false;
        button.textContent = "Crear cuenta";
        showErrors({ form: response.data.message });
        return;
    }

     
    button.textContent = "Registro exitoso";
    button.style.background = "green";

    setTimeout(() => {
        window.location.href = "/login";
    }, 1000);
});