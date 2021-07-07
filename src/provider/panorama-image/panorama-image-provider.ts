import {Failure} from 'src/util'

interface PanoramaImageProvider {
  getPanoramaBase64EncodedImage(
    latitude: number,
    longitude: number,
    heading: number
  ): Promise<string | Failure>

  getPanoramaImageId(
    latitude: number,
    longitude: number
  ): Promise<string | Failure>
}

export {PanoramaImageProvider}
