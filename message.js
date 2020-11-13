class Message {
  constructor(user, content) {
    this.user = user;
    this.content = this.emojiReplace(content)
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

  emojiReplace(string) {
    return string
      .replace(':)',String.fromCodePoint(0x1F600))
      .replace(':(',String.fromCodePoint(0x1F641))
      .replace(':o',String.fromCodePoint(0x1F62F))
      .replace(':O',String.fromCodePoint(0x1F632))
      .replace('<3',String.fromCodePoint(0x2764));
  }
}

module.exports = Message