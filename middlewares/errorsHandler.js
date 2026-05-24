const errorsHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    return res.status(statusCode).json({
        status: err.status || 'error',
        message
    });
    
};

module.exports = errorsHandler;