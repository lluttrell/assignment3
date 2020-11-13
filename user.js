class User {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.color = '9acd32';
  }

  setColor(color) {
    if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
      this.color = color;
      return true;
    }
    return false;
  }
}

module.exports = User