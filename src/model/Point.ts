export class Point {
  latitude: number
  longitude: number
  panoramaId?: string
  panoramaText?: string[]

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude
    this.longitude = longitude
  }

  addPanoramaText(panoramaText: string[]): void {
    if (this.panoramaText == undefined) this.panoramaText = []
    this.panoramaText = this.panoramaText.concat(panoramaText)
  }

  toString(): string {
    return this.latitude + ',' + this.longitude
  }
}
