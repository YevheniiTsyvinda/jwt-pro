const { User } = require('../models/models');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mailService');
const tokenService = require('./tokenService');
const UserDto = require('../dtos/userDto');
const ApiError = require('../exceptions/apiError');

class UserService {
    async registration(email, password) {

        const candidate = await User.findOne({ where: { email } });
        if (candidate) {
            throw ApiError.BadRequest('User with this email already exist');
        }
        const hashPassword = await bcrypt.hash(password, 13);
        const activationLink = uuid.v4();
        const user = await User.create({ email, password: hashPassword, activationLink })
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto }
    }

    async activate(activationLink) {
        const user = await User.findOne({ where: { activationLink, isActivated: false } });
        if (!user) {
            throw ApiError.BadRequest('Link is incorect');
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await User.findOne({ where: { email } })
        if (!user) {
            throw ApiError.BadRequest('User not found')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Wrong password');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens(userDto);
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnautorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb){
            throw ApiError.UnautorizedError();
        }
        const user = await User.findByPk(userData.id)
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto }
    }
}

module.exports = new UserService();