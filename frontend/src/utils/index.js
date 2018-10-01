function parseCookies(cookies) {
  let list = {};

  cookies.split(';').forEach(function(cookie) {
    var parts = cookie.split('=');
    list[parts.shift()] = unescape(parts.join('='));
  });

  return list;
}

export {
  parseCookies
}