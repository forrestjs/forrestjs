module.exports = (list, key = "name") =>
  list.reduce((a, c) => ({ ...a, [c[key]]: c }), {});
