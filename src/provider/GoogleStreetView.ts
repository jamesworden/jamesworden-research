import {
  PanoramaImageIdResponse,
  PanoramaImageIdStatus,
  PanoramaImageProvider,
  PanoramaImageResponse,
  PanoramaImageStatus
} from './PanoramaImageProvider'

import axios from 'axios'

class GoogleStreetView implements PanoramaImageProvider {
  private apiKey: string = process.env.GOOGLE_MAPS_BACKEND_KEY as string

  getPanoramaImageId = async (
    latitude: number,
    longitude: number
  ): Promise<PanoramaImageIdResponse> => {
    const data = await axios
      .get(
        `https://maps.googleapis.com/maps/api/streetview/metadata?&location=${latitude},${longitude}&key=${this.apiKey}`
      )
      .then((res) => {
        return res.data
      })

    const panoramaId: string = data.pano_id

    if (data.status != 'OK' || !data.pano_id) {
      return {status: PanoramaImageIdStatus.INTERNAL_ERROR}
    }

    return {
      data: {
        panoramaId
      },
      status: PanoramaImageIdStatus.OK
    }
  }

  getPanoramaImage = async (
    latitude: number,
    longitude: number,
    heading: number
  ): Promise<PanoramaImageResponse> => {
    if (!heading) {
      heading = 90
    }

    const base64: string = await axios
      .get(
        `https://maps.googleapis.com/maps/api/streetview?size=1600x1600&fov=120&heading=${heading}&location=${latitude},${longitude}&key=${this.apiKey}`,
        {responseType: 'arraybuffer'}
      )
      .then((res) => {
        return Buffer.from(res.data).toString('base64')
      })

    // Todo: Error handling if error with status

    return {
      data: {
        base64
      },
      status: PanoramaImageStatus.OK
    }
  }
}

export const googleStreetView = new GoogleStreetView()
