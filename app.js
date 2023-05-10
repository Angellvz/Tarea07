const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());

mongoose.connect('mongodb://0.0.0.0:27017/tarea01', {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('MongoDB connected!');
}).catch((error) => {
	console.error('MongoDB connection error:', error);
});

const serieSchema = new mongoose.Schema({
	name: String,
	genero: String,
	puntuacion: String
});

const Serie = mongoose.model('series', serieSchema);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.get('/listaSeries', function(req, res) {
  res.sendFile(__dirname + '/listaSeries.html');
});

app.get('/series', function(req, res) {
  Serie.find().exec().then(function(series) {
    if (series.length === 0) {
      console.error('No se encontraron series');
      res.status(404).send('No se encontraron series');
    } else {
      res.send(series);
    }
  }).catch((error) => {
    console.error('Error retrieving series:', error);
    res.status(500).send('Error retrieving series');
  });
});


app.post('/nuevaSerie', (req, res) => {
	const newSerie = new Serie(req.body);
	newSerie.save().then(() => {
		res.send('Serie guardada');
	}).catch((error) => {
		console.error('Error creating serie:', error);
		res.status(500).send('Error creando serie');
	});
});

app.listen(3000, () => {
	console.log('Servidor iniciado en el puerto 3000');
});
