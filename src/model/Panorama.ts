import Point from './Point';
import axios from 'axios';

/**
 * @returns Panorama ID of Google Street View Panorama at a specified coordinate pair
 */
let getPanoramaId = async (point: Point): Promise<string> => {
	let key = process.env.GOOGLE_MAPS_BACKEND_KEY,
		location = point.toString(),
		url = `https://maps.googleapis.com/maps/api/streetview/metadata?&location=${location}&key=${key}`,
		response = await axios.get(url);
	return response.data.pano_id;
};

/**
 * @returns JSON object of text within a panorama image
 * @param client Google Service Client for extracting text from panorama images
 * @param heading Horizontal rotation of image in degrees
 */
let getPanoramaText = async (point: Point, client, heading: number = 90) => {
	let key = process.env.GOOGLE_MAPS_BACKEND_KEY,
		location = point.toString(),
		url = `https://maps.googleapis.com/maps/api/streetview?size=1600x1600&fov=120&heading=${heading}&location=${location}&key=${key}`,
		image = await axios.get(url, { responseType: 'arraybuffer' }),
		base64 = Buffer.from(image.data).toString('base64'),
		request = { image: { content: Buffer.from(base64, 'base64') } },
		[result] = await client.textDetection(request),
		panotext: string[] = [];

	result.textAnnotations.forEach((annotation) => {
		let text: string = annotation.description;
		if (!text.includes('©') && !text.includes('Google')) panotext.push(text);
	});

	return panotext;
};

export { getPanoramaId, getPanoramaText };
