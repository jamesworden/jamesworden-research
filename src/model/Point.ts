export default class Point {
	latitude: number;
	longitude: number;
	panoramaId: string;
	panoramaText: string[];

	constructor(latitude: number, longitude: number) {
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

	getPanoramaId(): string {
		return this.panoramaId;
	}

	getPanoramaText(): string[] {
		return this.panoramaText;
	}

	addPanoramaText(panoramaText: string[]): void {
		if (this.panoramaText == undefined) this.panoramaText = [];
		this.panoramaText = this.panoramaText.concat(panoramaText);
	}

	toString(): string {
		return this.latitude + ',' + this.longitude;
	}
}
