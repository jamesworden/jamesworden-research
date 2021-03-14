const express = require('express');
require('dotenv').config();

// All frontend routes
const routes = express.Router({
	mergeParams: true,
});

// Dynamically rendering the enviornment variables into the ejs template
routes.get('/', async function (req, res) {
	res.render('index.ejs', {
		GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
	});
});

// Export all the routes
module.exports = routes;
