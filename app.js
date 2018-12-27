const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
//function that helps us create express application
const fortunes = require('./data/fortunes')
const port = 3000;
const app = express();
app.use(bodyParser.json());
app.get('/fortunes', (req, res) => {
	//res.send('requesting fortunes');
	res.json(fortunes);
});
app.get('/fortunes/random', (req, res ) => {
	const random_index = Math.floor(Math.random()*fortunes.length);
	const r_fortune = fortunes[random_index];
	res.json(r_fortune);
});
app.get('/fortunes/:id', (req, res) => {
	//console.log(req.params);
	res.json(fortunes.find(f => f.id == req.params.id));
});
const writeFortunes = json => {
	fs.writeFile('./data/fortunes.json', JSON.stringify(json), err => console.log(err));
}
app.post('/fortunes', (req,res) => {
	console.log(req.body);
	const {message, lucky_number, spirit_animal} = req.body;
	const fortune_ids = fortunes.map(f => f.id);
	const fortune = {
		id: (fortune_ids.length>0 ? Math.max(...fortune_ids): 0) + 1,
		message,
		lucky_number,
		spirit_animal
	};
	const new_fortunes = fortunes.concat(fortune);
	writeFortunes(new_fortunes);
	res.json(new_fortunes);
});

//update operation
app.put('/fortunes/:id', (req, res) => {
	const {id} = req.params;
	const {message, lucky_number, spirit_animal} = req.body;
	const old_fortune = fortunes.find(f => f.id == req.params.id);
	// if (message) old_fortune.message = message
	// if(lucky_number) old_fortune.lucky_number = lucky_number;
	// if(spirit_animal) old_fortune.spirit_animal = spirit_animal;
	['message', 'lucky_number', 'spirit_animal'].forEach(key => {
		if (req.body[key]) old_fortune[key] = req.body[key];
	})

	writeFortunes(fortunes);
	res.json(fortunes);
});

//Delete operation
app.delete('/fortunes/:id', (req, res) => {
	const {id} = req.params;
	const new_fortunes = fortunes.filter(f => f.id != id);
	writeFortunes(new_fortunes);
	res.json(new_fortunes);
});

module.exports = app;
//app.listen(port, () => console.log(`Listening on port ${port}`)); //makes the server live
