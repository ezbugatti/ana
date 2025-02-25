const fs = require("fs");
const path = require("path");
const https = require("https");

// Аудио файлуудын URL-ууд
// Эдгээр нь жишээ URL-ууд бөгөөд бодит аудио файлуудын URL-уудаар солих хэрэгтэй
const audioFiles = {
  "correct.mp3": "https://example.com/audio/correct.mp3",
  "wrong.mp3": "https://example.com/audio/wrong.mp3",
  "next.mp3": "https://example.com/audio/next.mp3",
};

// Аудио файлуудыг татаж авах хавтас
const audioDir = path.join(process.cwd(), "public", "audio");

// Хавтас үүсгэх
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Файлуудыг татаж авах
Object.entries(audioFiles).forEach(([fileName, url]) => {
  const filePath = path.join(audioDir, fileName);

  console.log(`Downloading ${fileName} from ${url}...`);

  const file = fs.createWriteStream(filePath);

  https
    .get(url, (response) => {
      response.pipe(file);

      file.on("finish", () => {
        file.close();
        console.log(`Downloaded ${fileName}`);
      });
    })
    .on("error", (err) => {
      fs.unlink(filePath);
      console.error(`Error downloading ${fileName}:`, err.message);
    });
});
