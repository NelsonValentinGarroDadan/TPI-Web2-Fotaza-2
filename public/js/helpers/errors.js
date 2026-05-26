export const showErrors = (errors) => {

    for (const key in errors) {

        const errorElement =
            document.getElementById(`${key}-error`);

        if (errorElement) {
            errorElement.textContent = errors[key];
        }
    }
};

export const clearErrors = () => {

    const errors = document.querySelectorAll("[id$='-error']");

    errors.forEach((e) => {
        e.textContent = "";
    });
};