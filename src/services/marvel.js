const axios = require('axios');
const crypto = require('crypto');
const { Op } = require('sequelize');
const UserFavorites = require('../database/models/favorites');

const PAGE_ITEMS = 30;

const endpoints = {
  character: '/characters',
  comic: '/comics',
};

const searchKeys = {
  character: 'nameStartsWith',
  comic: 'titleStartsWith',
};

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

  searchResource({
    name, page = 1, userId, type,
  }) {
    const limit = PAGE_ITEMS;
    const offset = (+page - 1) * limit;
    console.log({ type, endpoints });
    return this.request.get(endpoints[type], {
      params: {
        ...this.getAuthParams(),
        offset,
        limit,
        [searchKeys[type]]: name,
      },
    }).then((response) => this.mapResources(response.data.data, userId, type));
  }

  async mapResources({ results: resources, ...result }, userId, type) {
    console.log('oi', type);
    const resourcesIds = resources.map((resource) => String(resource.id));
    const favorites = await UserFavorites.findAll({
      attributes: ['resourceId'],
      where: {
        resourceId: {
          [Op.in]: resourcesIds,
        },
        userId: +userId,
        type,
      },
    });

    const mappedResources = resources.map((resource) => {
      const favorited = favorites.some((favorite) => favorite.resourceId == resource.id);
      const image = this.getImg(resource);
      return {
        id: resource.id,
        name: resource.name,
        title: resource.title,
        creators: this.getCreators(resource),
        image,
        favorited,
      };
    });

    return { ...result, results: mappedResources };
  }

  getImg(resource) {
    return `${resource.thumbnail?.path}/portrait_uncanny.${resource.thumbnail?.extension}`;
  }

  getCreators(resource) {
    return resource.creators?.items?.map((item) => item.name);
  }

  async getResource(resourceId, userId, type) {
    const resourceResponse = await this.request.get(`${endpoints[type]}/${resourceId}`, {
      params: {
        ...this.getAuthParams(),
      },
    });
    const favorited = await UserFavorites.findOne({
      where: {
        userId: +userId,
        resourceId: String(resourceId),
        type,
      },
    });
    const resource = resourceResponse.data.data.results[0];
    const image = this.getImg(resource);
    return {
      id: resource.id,
      name: resource.name,
      title: resource.title,
      creators: this.getCreators(resource),
      description: resource.description,
      image,
      favorited: !!favorited,
    };
  }

  async favorite({
    resourceId, userId, favorited, type,
  }) {
    const favorite = await UserFavorites.findOne({
      where: {
        userId: +userId,
        resourceId: String(resourceId),
        type,
      },

    });
    console.log({
      resourceId, userId, favorited, type, favorite,
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
    const resource = await this.getResource(resourceId, userId, type);
    await UserFavorites.create({
      resourceId: String(resourceId),
      type,
      userId: +userId,
      resource: { ...resource, favorited: true },
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
