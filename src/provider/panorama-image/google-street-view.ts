import {Failure, HttpStatusCode} from '../../util'

import {PanoramaImageProvider} from './panorama-image-provider'
import axios from 'axios'

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

    // Response data is already array buffer
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/streetview?size=1600x1600&fov=120&heading=${heading}&location=${latitude},${longitude}&key=${this.apiKey}`,
      {responseType: 'arraybuffer'}
    )

    if (res.status != 200) {
      return {
        response: {
          error: 'Error fetching image from Google.'
        },
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
      }
    }

    const base64: string = Buffer.from(res.data).toString('base64')

    return base64
  }
}

export function textContainsGoogleWatermark(text: string): boolean {
  return (
    text.includes('©') ||
    text.includes('@') ||
    text.includes('Google') ||
    text.includes('360') ||
    text.includes('Threshold') ||
    text.includes('Gaogle') ||
    text.includes('2021') ||
    text.includes('Gcogls') ||
    text.includes('google')
  )
}

export const googleStreetView = new GoogleStreetView()
