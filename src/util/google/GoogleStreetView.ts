import Point from '../../model/Point';
import axios from 'axios';

const key = process.env.GOOGLE_MAPS_BACKEND_KEY;

/**
 * @returns Panorama ID of Google Street View Panorama at a specified coordinate pair
 */
let getPanoramaId = async (point: Point): Promise<string> => {
	let location = point.toString(),
		url = `https://maps.googleapis.com/maps/api/streetview/metadata?&location=${location}&key=${key}`,
		response = await axios.get(url);
	return response.data.pano_id;
};

/**
 * @returns JSON object of text within a panorama image
 * @param client Google Service Client for extracting text from panorama images
 * @param heading Horizontal rotation of image in degrees
 */
let getPanoramaBase64 = async (point: Point, heading: number = 90): Promise<string> => {
	let location = point.toString(),
		url = `https://maps.googleapis.com/maps/api/streetview?size=1600x1600&fov=120&heading=${heading}&location=${location}&key=${key}`,
		image = await axios.get(url, { responseType: 'arraybuffer' }),
		base64: string = Buffer.from(image.data).toString('base64');
	return base64;
};

export { getPanoramaId, getPanoramaBase64 };
