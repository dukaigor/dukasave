const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/download', async (req, res) => {
  try {
    const { url, platform } = req.body;

    if (!url || !platform) {
      return res.status(400).json({ error: 'URL и платформа обязательны' });
    }

    switch (platform) {
      case 'youtube':
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
        res.header('Content-Disposition', `attachment; filename="video.mp4"`);
        ytdl(url, { format: format }).pipe(res);
        break;
      case 'instagram':
      case 'tiktok':
        // Здесь должна быть реализация для Instagram и TikTok
        res.status(501).json({ error: 'Скачивание с этой платформы пока не реализовано' });
        break;
      default:
        res.status(400).json({ error: 'Неподдерживаемая платформа' });
    }
  } catch (error) {
    console.error('Ошибка при скачивании:', error);
    res.status(500).json({ error: 'Произошла ошибка при скачивании' });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
