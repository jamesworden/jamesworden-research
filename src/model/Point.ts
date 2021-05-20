export default class Point {
	latitude: number;
	longitude: number;
	panoramaId: string;
	panoramaText: string;

	constructor(latitude, longitude) {
		this.latitude = latitude;
		this.longitude = longitude;
	}

	getLatitude(): number {
		return this.latitude;
	}

	getLongitude(): number {
		return this.longitude;
	}

	setPanoramaId(panoramaId: string): void {
		this.panoramaId = panoramaId;
	}

	setPanoramaText(panoramaText: string): void {
		this.panoramaText = panoramaText;
	}

	toString(): string {
		return this.latitude + ',' + this.longitude;
	}
}
