class Message {
  constructor(user, content) {
    this.user = user;
    this.content = content
    this.timestamp = this.getTimestamp();
  }

  getTimestamp() {
    let timestamp = new Date();
    return `${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`
  }

  isColorChange() {
    return this.content.startsWith('/color ');
  }
  
  isNameChange() {
    return this.content.startsWith('/name ');
  }

  toColorString() {
    if (this.isColorChange()) {
      return this.content.replace('/color ', '');
    } else {
      return false
    }
  }

  toNameString() {
    if (this.isNameChange()) {
      return this.content.replace('/name ', '');
    } else {
      return false
    }
  }
}

module.exports = Message