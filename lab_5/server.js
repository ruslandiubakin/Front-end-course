const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const usersDB = require('./js/DATA_BASE');

// Генерувати випадкові дані про гірські тури в форматі JSON
function generateRandomTours(count) {
  const tours = [];
  for (let i = 0; i < count; i++) {
    const tour = {
      name: `Тур ${i + 1}`,
      route: `Маршрут ${i + 1}`,
      duration: getRandomNumber(1, 7),
      price: getRandomNumber(1000, 5000),
    };
    tours.push(tour);
  }
  return tours;
}

// Функція для отримання випадкового числа у заданому діапазоні
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Шляхи для навігації між сторінками
const routes = {
  '/': 'index.html',
  '/about': 'about.html',
  '/form': 'form.html',
  '/auth': 'authorise.html',
  '/weather': 'weather.html'
};

// Парсер JSON
app.use(bodyParser.json());

// Маршрут для отримання даних про гірські тури
app.get('/tours', (req, res) => {
  const generatedTours = generateRandomTours(10);
  res.json(generatedTours);
});


// Маршрут для автентифікації користувача
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = usersDB.find(u => u.username === username && u.password === password);

  if (user) {
    res.json({ success: true, message: 'Успішна автентифікація' });
  } else {
    res.json({ success: false, message: 'Невірний логін або пароль' });
  }
});

app.use(express.static('public', {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'text/javascript');
    }
  }
}));

// Наш роутер
app.get('*', (req, res) => {
  const route = req.path;
  const filePath = path.join('public', routes[route]);

  if (filePath) {
    res.sendFile(path.join(__dirname, filePath));
  } else {
    res.status(404).send('Сторінку не знайдено');
  }
});

app.listen(3000, () => {
  console.log('Сервер запущений на порту 3000');
});