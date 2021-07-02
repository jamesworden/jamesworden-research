import { LatLngLiteralVerbose } from '@googlemaps/google-maps-services-js';

export type Point = {
	location: LatLngLiteralVerbose;
	panoramaId?: string;
	panoramaText?: string[];
};

export function addPanoramaText(point: Point, text: string[]) {
	if (point.panoramaText) {
		point.panoramaText.concat(text);
	} else {
		point.panoramaText = [];
	}
}
