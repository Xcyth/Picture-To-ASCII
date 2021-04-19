const sharp = require("sharp");
const readlineSync = require("readline-sync");
const fs = require("fs");

ASCII_CHARS = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ".split(
  ""
);
charLength = ASCII_CHARS.length;
interval = charLength / 256;
var newHeight = null;
const main = async (newWidth = 100) => {
  const newImgData = await pixelToAscii(
    resizeImg(convertToGrayscale(loadFileFromPath()))
  );
  const pixels = newImgData.length;
  let ASCII = "";
  for (i = 0; i < pixels; i += newWidth) {
    let line = newImgData.split("").slice(i, i + newWidth);
    ASCII = ASCII + "\n" + line;
  }

  setTimeout(() => {
    fs.writeFile("output.txt", ASCII, () => {
      console.log("done");
    });
  }, 5000);
};

const convertToGrayscale = async (path) => {
  const img = await path;
  const bw = await img.gamma().greyscale();
  return bw;
};

const resizeImg = async (bw, newWidth = 100) => {
  const blackAndWhite = await bw;
  const size = await blackAndWhite.metadata();
  const ratio = size.width / size.height;
  newHeight = parseInt(newWidth * ratio);
  const resized = await blackAndWhite.resize(newWidth, newHeight, {
    fit: "outside",
  });

  return resized;
};

const pixelToAscii = async (img) => {
  var newImg = await img;
  const pixels = await newImg.raw().toBuffer();
  characters = "";
  pixels.forEach((pixel) => {
    characters = characters + ASCII_CHARS[Math.floor(pixel * interval)];
  });
  return characters;
};

const loadFileFromPath = async () => {
  var filePath = readlineSync.question("What's the file path ");
  try {
    const file = await sharp(filePath);
    return file;
  } catch (error) {
    console.error(error);
  }
};
main();
