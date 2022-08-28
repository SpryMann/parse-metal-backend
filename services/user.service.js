const {userModel} = require('./../models');
const bcrypt = require('bcrypt');
const tokenService = require('./../services/token.service');
const UserDto = require('./../dtos/user.dto');
const ApiError = require('../exceptions/apiError');

class UserService {
  async registration(username, password) {
    const candidate = await userModel.findOne({username});
    if (candidate) {
      throw ApiError.BadRequest('Такой пользователь уже существует');
    }

    const hashedPassword = await bcrypt.hash(password, 3);
    const user = await userModel.create({username, password: hashedPassword});
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async login(username, password) {
    const user = await userModel.findOne({username});
    if (!user) {
      throw ApiError.BadRequest('Такого пользователя нет');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw ApiError.BadRequest('Неверный пароль');
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {...tokens, user: userDto};
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await userModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {...tokens, user: userDto};
  }

  async getAllUsers() {
    const users = await userModel.find();
    return users;
  }
}

module.exports = new UserService();
