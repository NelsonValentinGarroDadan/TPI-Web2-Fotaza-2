import { clearErrors, showErrors } from "../helpers/errors.js";
import { validate } from "../helpers/validator.js";
import { loginSchema } from "./schemas.js";
import { sendLogin } from "./senders.js";

const button = document.getElementById("button-submit-login");
const form = document.getElementById("form-login"); 

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = {
        nickname:
            document.getElementById("nickname").value,

        password:
            document.getElementById("password").value,
    };

    clearErrors();

    const errors = validate(
        loginSchema,
        formData
    ); 
    
    if (Object.keys(errors).length > 0) {

        showErrors(errors);

        return;
    }

    button.disabled = true;
    button.textContent = "Cargando..."; 

    const response = await sendLogin(formData);

    if (!response.ok) {
        button.disabled = false;
        button.textContent = "Iniciar sesion";
        showErrors({ form: response.data.message });
        return;
    }

    localStorage.setItem('user', JSON.stringify(response.data.user));
    button.textContent = "Inicio de sesion exitoso";
    button.style.background = "green";

    const destination = response.data.user?.is_admin ? "/dashboar-admin" : "/";

    setTimeout(() => {
        window.location.href = destination;
    }, 1000);
});