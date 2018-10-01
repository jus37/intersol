const request = require('request-promise');

class VKAuth {
  constructor(vkConfig, vkApi) {
    this.vkConfig = vkConfig;
    this.vkApi = vkApi;
  }

  async handle(req, res) {
    const code = req.query.code;

    if (!code)
      return res.redirect(this._getAuthURL());

    try {
      let body = await request(this._getAccessTokenURL(code));
      body = JSON.parse(body);

      const user = await this.vkApi.getUser(body.user_id);

      res.cookie('user', user.response[0], {signed: true});
      res.redirect('/');
    } catch (e) {
      console.error(e.toString());
      res.status(500).send(e.toString());
    }
  }

  _getAuthURL() {
    return `https://oauth.vk.com/authorize?client_id=${this.vkConfig.clientID}&display=page&redirect_uri=${this.vkConfig.redirectURL}&response_type=code&v=5.85`
  }

  _getAccessTokenURL(code) {
    return `https://oauth.vk.com/access_token?client_id=${this.vkConfig.clientID}&client_secret=${this.vkConfig.clientSecret}&redirect_uri=${this.vkConfig.redirectURL}&code=${code}`
  }
}

module.exports = VKAuth;