var express = require('express'),
	mongoose = require('mongoose'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	cheerio = require('cheerio'),
	request = require('request');

var port = process.env.PORT || 1738;
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

mongoose.connect('mongodb://localhost/alexa');

var Site = mongoose.model('Site', {
	name : String,
	rank : Number,
	linksIn : Number
});

app.get('/api/sites', function(req,res) {
	Site.find(function(err, sites) {
		if (err) throw err;
		res.json(sites);
	});
});

app.post('/api/sites', function(req,res) {

	var site = req.body.link.trim();
	var rank, linksIn;
	var url = 'http://www.alexa.com/siteinfo/'+site;

	request(url, function(error, response, html) {

		if (error) throw error;

		var $ = cheerio.load(html);

		$('.globleRank .col-pad div .metrics-data').filter(function() {
			var data = $(this).text();
			rank = parseInt(data.replace(/\,/g,''),10);
		});

		$('#linksin-panel-content .font-4').filter(function() {
			var data = $(this).text();
			linksIn = parseInt(data.replace(/\,/g,''),10);
		});		

		Site.create({
			name: site,
			rank: rank,
			linksIn: linksIn,
			done: false
		}, function(err, site) {
			if (err) throw err;
			Site.find(function(err, sites) {
				if (err) throw err;
				res.json(sites);
			});
		});
	});

	
});

app.delete('/api/sites/:site_id', function(req,res) {
	Site.remove({
		_id: req.params.site_id
	}, function(err, site) {
		if (err) throw err;
		Site.find(function(err,sites) {
			if (err) throw err;
			res.json(sites);
		});
	});
});

app.get('*', function(req,res) {
	res.sendFile('./public/index.html');
})

app.listen(port);
console.log('Listening on port ' + port);