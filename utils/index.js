function parseCookies(cookies) {
  let list = {};

  cookies.split(';').forEach(function(cookie) {
    var parts = cookie.split('=');
    list[parts.shift().trim()] = unescape(parts.join('='));
  });

  return list;
}

module.exports = {
  parseCookies
};