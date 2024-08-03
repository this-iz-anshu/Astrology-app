const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const kundliRoutes = require('./Backend/routes/kundli');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'public', 'views'));
app.set('view engine', 'ejs');

app.use('/api', kundliRoutes);

app.get('/kundli/result/:kundliId', (req, res) => {
  const kundliController = require('./Backend/controller/kundliController');
  kundliController.showKundliResult(req, res);
});

app.use((req, res, next) => {
  res.status(404).send('Page not found');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
