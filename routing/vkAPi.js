const querystring = require('querystring');
const requestPromise = require('request-promise');

class VKApi {
  constructor(vkConfig) {
    this.vkConfig = vkConfig;
  }

  async getUser(uid) {
    const url = this._getURL('users.get', {user_ids: uid, fields: 'photo_50'});
    return await this._request(url);
  }

  _getURL(method, params, accessToken = this.vkConfig.accessToken) {
    const q = querystring.stringify(params);
    return `https://api.vk.com/method/${method}?&access_token=${accessToken}&v=5.85&${q}`;
  }

  _request(url) {
    const options = {
      method: 'GET',
      uri: url,
      json: true
    };
    return requestPromise(options);
  }
}

module.exports = VKApi;