import {Failure, HttpStatusCode} from '../../util'
import axios, {AxiosResponse} from 'axios'

import {PanoramaImageProvider} from './panorama-image-provider'

class GoogleStreetView implements PanoramaImageProvider {
  private apiKey: string = process.env.GOOGLE_MAPS_BACKEND_KEY as string

  getPanoramaImageId = async (
    latitude: number,
    longitude: number
  ): Promise<string | Failure> => {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/streetview/metadata?&location=${latitude},${longitude}&key=${this.apiKey}`
    )

    if (res.data.status != 'OK') {
      return {
        response: {
          error: 'Error fetching data from Google.'
        },
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
      }
    }

    const panoramaId: string = res.data.pano_id

    return panoramaId
  }

  getPanoramaBase64EncodedImage = async (
    latitude: number,
    longitude: number,
    heading: number
  ): Promise<string | Failure> => {
    if (!heading) {
      heading = 90
    }

    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/streetview?size=1600x1600&fov=120&heading=${heading}&location=${latitude},${longitude}&key=${this.apiKey}`,
      {responseType: 'arraybuffer'}
    )

    if (res.data.status != 'OK') {
      return {
        response: {
          error: 'Error fetching data from Google.'
        },
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
      }
    }

    const base64: string = Buffer.from(res.data).toString('base64')

    return base64
  }
}

export const googleStreetView = new GoogleStreetView()
