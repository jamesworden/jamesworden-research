import {Location} from './Location'

export class Point {
  location: Location
  panoramaId?: string
  panoramaText?: string[]

  constructor(latitude: number, longitude: number) {
    this.location = {
      latitude,
      longitude
    }
  }

  addPanoramaText(panoramaText: string[]): void {
    if (this.panoramaText == undefined) {
      this.panoramaText = []
    }
    this.panoramaText = this.panoramaText.concat(panoramaText)
  }
}
