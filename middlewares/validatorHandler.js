const AppError = require("../errors/appError");

const ValidatorHandler = (schema) => (
    (req, res, next) => {
        const result = schema.safeParse(req.body);

        if(!result.success){
            const errors = result.error.issues.map( issue => issue.message);

            throw new AppError(400, errors.join(', '));
        }

        req.body = result.data;

        next();
    }
);

module.exports = ValidatorHandler;