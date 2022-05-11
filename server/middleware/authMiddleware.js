const ApiError = require("../exceptions/apiError");
const tokenService = require("../service/tokenService");

module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnautorizedError());
        }
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.UnautorizedError());
        }
        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnautorizedError());
        }
        req.user = userData.data;
        next();
    } catch (error) {
        return next(ApiError.UnautorizedError());
    }
}