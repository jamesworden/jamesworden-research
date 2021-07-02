import { FunctionResponse, HttpStatusCode } from '../../util';
import { PanoramaImage, PanoramaImageId, PanoramaImageProvider } from './panorama-image-provider';

import axios from 'axios';

class GoogleStreetView implements PanoramaImageProvider {
	private apiKey: string = process.env.GOOGLE_MAPS_BACKEND_KEY as string;

	getPanoramaImageId = async (
		latitude: number,
		longitude: number
	): Promise<FunctionResponse<PanoramaImageId>> => {
		const data = await axios
			.get(
				`https://maps.googleapis.com/maps/api/streetview/metadata?&location=${latitude},${longitude}&key=${this.apiKey}`
			)
			.then((res) => {
				return res.data;
			});

		const panoramaId: string = data.pano_id;

		if (data.status != 'OK' || !data.pano_id) {
			return {
				error: true,
				httpResponse: {
					error: 'Error fetching data from Google.',
				},
				httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
			};
		}

		return {
			httpResponse: {
				panoramaId,
			},
			error: false,
			httpStatusCode: HttpStatusCode.OK,
		};
	};

	getPanoramaImage = async (
		latitude: number,
		longitude: number,
		heading: number
	): Promise<FunctionResponse<PanoramaImage>> => {
		if (!heading) {
			heading = 90;
		}

		const data = await axios
			.get(
				`https://maps.googleapis.com/maps/api/streetview?size=1600x1600&fov=120&heading=${heading}&location=${latitude},${longitude}&key=${this.apiKey}`,
				{ responseType: 'arraybuffer' }
			)
			.then((res) => {
				// Res.data is the buffer itself
				return res.data;
			});

		const base64: string = Buffer.from(data).toString('base64');

		return {
			httpResponse: {
				base64,
			},
			error: false,
			httpStatusCode: HttpStatusCode.OK,
		};
	};
}

export const googleStreetView = new GoogleStreetView();
