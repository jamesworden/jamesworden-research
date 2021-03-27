/**
 * @param {Object} location Object containing 'latitude' and 'longitude' values
 * @returns {String} Panorama id that corresponds to panorama images from Google Street View
 */
const getPanoramaId = async function (location) {
	// This API key is validated in the Route.js file.
	let key = process.env.GOOGLE_MAPS_BACKEND_KEY;

	// Make string for API Call using location data
	let locationString = location.latitude + ',' + location.longitude;

	// Send request for Google StreetView Image MetaData using location data
	const url = `https://maps.googleapis.com/maps/api/streetview/metadata?&location=${locationString}&key=${key}`;

	// Return data from url
	const axios = require('axios');
	let response = await axios.get(url);
	return response.data.pano_id;
};

module.exports = {
	getPanoramaId,
};
