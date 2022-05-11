const jwt = require('jsonwebtoken');
const ApiError = require('../exceptions/apiError');
const { Token } = require('../models/models')

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign({data:payload}, process.env.ACCESS_SECRET_KEY, { expiresIn: '30m' })
        const refreshToken = jwt.sign({data:payload}, process.env.REFRESH_SECRET_KEY, { expiresIn: '30d' })
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({ user: userId });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await Token.create({ userId, refreshToken });
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await Token.destroy({ refreshToken });
        return tokenData
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
            return userData;
        } catch (error) {
            return null;
        }
    }
    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.REFRESH_SECRET_KEY);
            return userData;
        } catch (error) {
            return null;
        }
    }

    async findToken(refreshToken){
        const tokenData = await Token.findOne({where:{refreshToken}});
        return tokenData;
    }
}

module.exports = new TokenService();