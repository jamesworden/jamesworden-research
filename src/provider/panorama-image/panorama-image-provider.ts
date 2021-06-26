import {Response} from '../../util/response-utils'

interface PanoramaImageProvider {
  getPanoramaImage(
    latitude: number,
    longitude: number,
    heading: number
  ): Promise<Response<PanoramaImage>>

  getPanoramaImageId(
    latitude: number,
    longitude: number
  ): Promise<Response<PanoramaImageId>>
}

type PanoramaImage = {
  base64: string
}

type PanoramaImageId = {
  panoramaId: string
}

export {PanoramaImageProvider, PanoramaImage, PanoramaImageId}
