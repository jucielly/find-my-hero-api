const axios = require('axios');
const crypto = require('crypto');
const { Op } = require('sequelize');
const UserFavorites = require('../database/models/favorites');

const PAGE_ITEMS = 30;

class MarvelService {
  constructor({ publicKey, privateKey }) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.request = axios.create({
      baseURL: 'https://gateway.marvel.com/v1/public',
    });
  }

  getAuthParams() {
    const ts = parseInt(Date.now() / 1000, 10);
    const hash = crypto.createHash('md5').update(ts + this.privateKey + this.publicKey).digest('hex');
    return {
      ts,
      hash,
      apikey: this.publicKey,
    };
  }

  searchCharacter({ name, page = 1, userId }) {
    const limit = PAGE_ITEMS;
    const offset = (+page - 1) * limit;
    return this.request.get('/characters', {
      params: {
        ...this.getAuthParams(),
        offset,
        limit,
        nameStartsWith: name,
      },
    }).then((response) => this.mapCharacters(response.data.data, userId));
  }

  async mapCharacters({ results: characters, ...result }, userId) {
    const charactersIds = characters.map((character) => String(character.id));
    const favorites = await UserFavorites.findAll({
      attributes: ['resourceId'],
      where: {
        resourceId: {
          [Op.in]: charactersIds,
        },
        userId: +userId,
        type: 'character',
      },
    });

    const mappedCharacters = characters.map((character) => {
      const favorited = favorites.some((favorite) => favorite.resourceId == character.id);
      const image = this.getImg(character);
      return {
        id: character.id,
        name: character.name,
        image,
        favorited,
      };
    });

    return { ...result, results: mappedCharacters };
  }

  getImg(resource) {
    return `${resource.thumbnail?.path}/portrait_uncanny.${resource.thumbnail?.extension}`;
  }

  async getCharacter(characterId, userId) {
    const characterResponse = await this.request.get(`characters/${characterId}`, {
      params: {
        ...this.getAuthParams(),
      },
    });
    const favorited = await UserFavorites.findOne({
      where: {
        userId: +userId,
        resourceId: String(characterId),
        type: 'character',
      },
    });
    const character = characterResponse.data.data.results[0];
    const image = this.getImg(character);
    return {
      id: character.id,
      name: character.name,
      description: character.description,
      image,
      favorited: !!favorited,
    };
  }

  async favorite({
    resourceId, userId, favorited, type,
  }) {
    const favorite = await UserFavorites.findOne({
      userId: +userId,
      resourceId: String(resourceId),
      type: 'character',
    });
    if (!favorited && favorite) {
      await favorite.destroy();
      return true;
    }
    if (!favorited) {
      return false;
    }
    if (favorite) {
      return false;
    }
    const character = await this.getCharacter(resourceId, userId);
    await UserFavorites.create({
      resourceId: String(resourceId),
      type: 'character',
      userId: +userId,
      resource: { ...character, favorited: true },
    });
    return true;
  }

  async getUserFavorites(userId, type) {
    const favorites = await UserFavorites.findAll({
      where: {
        userId: +userId,
        type,
      },
    });
    return favorites.map((favorite) => favorite.resource);
  }
}

module.exports = MarvelService;
