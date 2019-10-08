class ApiError extends Error
{
    constructor(message, code)
    {
        super(message);
        this.code = code;
    }
}

module.exports.catchError = (req, res, cb) => cb(req, res).catch(e => { req.opuscapita.logger.error(e); res.status(e.code || 400).json({ message : e.message }) });
module.exports.ApiError = ApiError;
