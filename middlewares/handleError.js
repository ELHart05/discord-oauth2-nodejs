const AppError = require("../utils/AppError")

const handleError = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).send({
            error: err.message
        })
    }

    return res.status(500).send({
        error: err.message
    })
}

module.exports = handleError;