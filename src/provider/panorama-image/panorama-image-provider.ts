import { FunctionResponse } from '../../util';

interface PanoramaImageProvider {
	getPanoramaImage(
		latitude: number,
		longitude: number,
		heading: number
	): Promise<FunctionResponse<PanoramaImage>>;

	getPanoramaImageId(
		latitude: number,
		longitude: number
	): Promise<FunctionResponse<PanoramaImageId>>;
}

type PanoramaImage = {
	base64: string;
};

type PanoramaImageId = {
	panoramaId: string;
};

export { PanoramaImageProvider, PanoramaImage, PanoramaImageId };
