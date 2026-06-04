import { clearErrors, showErrors } from "../helpers/errors.js";
import { validate } from "../helpers/validator.js";
import { profileSchema } from "./schemas.js";
import { sendUpdateProfile } from "./senders.js";

const form = document.getElementById("form-profile");
const btnEdit = document.getElementById("btn-edit");
const btnCancel = document.getElementById("btn-cancel");
const btnSave = document.getElementById("btn-save");

const viewEls = document.querySelectorAll("[data-view]");
const editEls = document.querySelectorAll("[data-edit]");

const fileInput = document.getElementById("profile_img");
const preview = document.getElementById("profile_img_preview");
const nicknameInput = document.getElementById("nickname");
const biographyInput = document.getElementById("biography");
const formError = document.getElementById("form-error");

const original = {
    nickname: nicknameInput.value,
    biography: biographyInput.value,
    img: preview.src,
};

const setMode = (editing) => {
    viewEls.forEach((el) => el.classList.toggle("hidden", editing));
    editEls.forEach((el) => el.classList.toggle("hidden", !editing));
    fileInput.disabled = !editing;
};

btnEdit.addEventListener("click", () => setMode(true));

btnCancel.addEventListener("click", () => {
    nicknameInput.value = original.nickname;
    biographyInput.value = original.biography;
    preview.src = original.img;
    fileInput.value = "";
    clearErrors();
    formError.textContent = "";
    setMode(false);
});

fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) preview.src = URL.createObjectURL(file);
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    const formData = {
        nickname: nicknameInput.value,
        biography: biographyInput.value,
    };

    const errors = validate(profileSchema, formData);

    if (Object.keys(errors).length > 0) {
        showErrors(errors);
        return;
    }

    btnSave.disabled = true;
    btnSave.textContent = "Guardando...";

    const payload = new FormData();
    payload.append("nickname", formData.nickname);
    payload.append("biography", formData.biography);

    const file = fileInput.files[0];
    if (file) payload.append("profile_img", file);

    const response = await sendUpdateProfile(payload);

    btnSave.disabled = false;
    btnSave.textContent = "Guardar";

    if (!response.ok) {
        showErrors({ form: response.data.message });
        return;
    }

    window.location.reload();
});
