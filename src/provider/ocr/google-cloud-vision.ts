import { ExtractedText, OcrProvider } from '.';
import { FunctionResponse, HttpStatusCode } from '../../util';
import vision, { ImageAnnotatorClient } from '@google-cloud/vision';

class GoogleCloudVision implements OcrProvider {
	client: ImageAnnotatorClient = new vision.ImageAnnotatorClient();

	extractTextFromImage = async (base64: string): Promise<FunctionResponse<ExtractedText>> => {
		const request = {
			image: {
				content: Buffer.from(base64, 'base64'),
			},
		};

		return await this.client.textDetection(request).then(([result]) => {
			if (!result.textAnnotations || result.textAnnotations.length == 0) {
				return {
					error: true,
					httpResponse: {
						error: 'No data found for this image.',
					},
					httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
				};
			}

			let textArray: string[] = [];

			result.textAnnotations.forEach((annotation) => {
				const text: string | null | undefined = annotation.description;

				// Streetview image contains watermarks at the bottom
				if (text && !text.includes('©') && !text.includes('Google')) {
					textArray.push(text);
				}
			});

			return {
				httpResponse: {
					text: textArray,
				},
				error: false,
				httpStatusCode: HttpStatusCode.OK,
			};
		});
	};
}

export const googleCloudVision = new GoogleCloudVision();
