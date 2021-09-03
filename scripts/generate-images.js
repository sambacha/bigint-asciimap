const fs = require('fs-extra');
const path = require('path');
const characters = `abcdefghijklmnopqrstuvwxyz-=_+@#!$%^*&()1234567890/<>?:";`;

const images = [];
for (let i = 0; i < 32; i++) {
  const image = {
    width: 4,
    height: 4 + (Math.random() > 0.75 ? 2 : 0),
  };
  let data = '';
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      if (x === 0 || x === image.width - 1) {
        data += '|';
        continue;
      }
      if (y === 0 || y === image.height - 1) {
        data += '~';
        continue;
      }
      data += characters[Math.floor(Math.random() * characters.length)];
    }
    data += `\n`;
  }
  image.data = data;
  images.push(image);
}

fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'large-images.json'),
  JSON.stringify(images, null, 2),
);
