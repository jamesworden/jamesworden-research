import {
	ExtractedText,
	OcrProvider,
	PanoramaImage,
	PanoramaImageId,
	PanoramaImageProvider,
} from '../../provider';
import { FunctionResponse, HttpStatusCode } from '../../util';

import { LatLngLiteralVerbose } from '@googlemaps/google-maps-services-js';
import { Option } from '../option';
import { Point } from '.';
import { addPanoramaText } from './point';

type PointData = {
	point: Point;
};

class PointFactory {
	panoramaImageProvider: PanoramaImageProvider;
	ocrProvider: OcrProvider;

	constructor(panoramaImageProvider: PanoramaImageProvider, ocrProvider: OcrProvider) {
		this.panoramaImageProvider = panoramaImageProvider;
		this.ocrProvider = ocrProvider;
	}

	async createPoint(
		coordinatePair: LatLngLiteralVerbose,
		options: Option[]
	): Promise<FunctionResponse<PointData>> {
		const lat: number = coordinatePair.latitude;
		const lon: number = coordinatePair.longitude;

		const point: Point = {
			location: {
				latitude: lat,
				longitude: lon,
			},
		};

		if (options.includes(Option.PANORAMA_ID)) {
			await this.panoramaImageProvider
				.getPanoramaImageId(lat, lon)
				.then((res: FunctionResponse<PanoramaImageId>) => {
					if (res.error) {
						return res;
					}

					point.panoramaId = res.httpResponse.panoramaId;
				});
		}

		if (options.includes(Option.PANORAMA_TEXT)) {
			// Gather text from three different images to simulate a panorama image
			for (let heading = 0; heading < 360; heading += 120) {
				await this.panoramaImageProvider
					.getPanoramaImage(lat, lon, heading)
					.then((res: FunctionResponse<PanoramaImage>) => {
						if (res.error) {
							return res;
						}

						return this.ocrProvider.extractTextFromImage(res.httpResponse.base64);
					})
					.then((res: FunctionResponse<ExtractedText>) => {
						if (res.error) {
							return res;
						}

						addPanoramaText(point, res.httpResponse.text);
					});
			}
		}

		return {
			httpResponse: {
				point,
			},
			httpStatusCode: HttpStatusCode.OK,
			error: false,
		};
	}
}
export { PointFactory, PointData };
