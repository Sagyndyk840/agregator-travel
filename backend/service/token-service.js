import jwt from 'jsonwebtoken'
import tokenModel from '../models/token-model.js'
class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
      expiresIn: '30m'
    })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {
      expiresIn: '30d'
    })

    return {
      accessToken,
      refreshToken
    }
  }

  validateAccessToken(accessToken) {
    try {
      return  jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN)
    } catch (e) {
      return null
    }
  }

  validateRefreshToken(refreshToken) {
    try {
      return  jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN)
    } catch (e) {
      return null
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await tokenModel.findOne({user: userId})

    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }

    return await tokenModel.create({user: userId, refreshToken})
  }

  async removeToken(refreshToken) {
    const tokenData = await tokenModel.deleteOne({refreshToken})
    return tokenData
  }

  async findToken(refreshToken) {
    const tokenData =  await tokenModel.findOne({refreshToken})
    return tokenData
  }
}

export default new TokenService()