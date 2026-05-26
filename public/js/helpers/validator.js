export const validate = (schema, formData) => {

    const errors = {};

    for (const field in schema) {

        const rules = schema[field];

        const value =
            formData[field]?.trim() || "";

        // required
        if (rules.required && !value) {

            errors[field] =
                rules.messages.required;

            continue;
        }

        // si no tiene valor y no es required
        // no seguir validando
        if (!value) continue;

        // minLength
        if (
            rules.minLength &&
            value.length < rules.minLength
        ) {

            errors[field] =
                rules.messages.minLength;

            continue;
        }

        // maxLength
        if (
            rules.maxLength &&
            value.length > rules.maxLength
        ) {

            errors[field] =
                rules.messages.maxLength;

            continue;
        }

        // match
        if (
            rules.match &&
            value !== formData[rules.match]
        ) {

            errors[field] =
                rules.messages.match;

            continue;
        }
    }

    return errors;
};