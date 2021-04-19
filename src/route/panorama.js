/**
 * @returns Panorama ID of Google Street View Panorama at a specified coordinate pair
 */
const getPanoramaId = async function (latitude, longitude) {
	const key = process.env.GOOGLE_MAPS_BACKEND_KEY;
	const location = latitude + ',' + longitude;
	const url = `https://maps.googleapis.com/maps/api/streetview/metadata?&location=${location}&key=${key}`;
	const axios = require('axios');
	let response = await axios.get(url);
	return response.data.pano_id;
};

/**
 * @returns JSON object of text within a panorama image
 * @param client Google Service Client for extracting text from panorama images
 * @param heading Horizontal rotation of image in degrees
 */
const getPanoramaText = async function (latitude, longitude, client, heading = 90) {
	const key = process.env.GOOGLE_MAPS_BACKEND_KEY,
		location = latitude + ',' + longitude,
		url = `https://maps.googleapis.com/maps/api/streetview?size=1600x1600&fov=120&heading=${heading}&location=${location}&key=${key}`,
		axios = require('axios');

	let image = await axios.get(url, { responseType: 'arraybuffer' }),
		base64 = Buffer.from(image.data).toString('base64'),
		request = { image: { content: Buffer.from(base64, 'base64') } },
		[result] = await client.textDetection(request),
		panotext = [];

	result.textAnnotations.forEach((annotation) => {
		let text = annotation.description;
		if (!text.includes('©') && !text.includes('Google')) panotext.push(text);
	});

	return panotext;
};

module.exports = {
	getPanoramaId,
	getPanoramaText,
};
