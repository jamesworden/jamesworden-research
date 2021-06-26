import {
  PanoramaImage,
  PanoramaImageId,
  PanoramaImageProvider
} from './panorama-image.provider'
import {Response, Status} from 'src/util/response-protocol'

import axios from 'axios'

class GoogleStreetView implements PanoramaImageProvider {
  private apiKey: string = process.env.GOOGLE_MAPS_BACKEND_KEY as string

  getPanoramaImageId = async (
    latitude: number,
    longitude: number
  ): Promise<Response<PanoramaImageId>> => {
    const data = await axios
      .get(
        `https://maps.googleapis.com/maps/api/streetview/metadata?&location=${latitude},${longitude}&key=${this.apiKey}`
      )
      .then((res) => {
        return res.data
      })

    const panoramaId: string = data.pano_id

    if (data.status != 'OK' || !data.pano_id) {
      return {
        error: 'Error fetching data from Google.',
        status: Status.INTERNAL_ERROR
      }
    }

    return {
      data: {
        panoramaId
      },
      status: Status.OK
    }
  }

  getPanoramaImage = async (
    latitude: number,
    longitude: number,
    heading: number
  ): Promise<Response<PanoramaImage>> => {
    if (!heading) {
      heading = 90
    }

    const data = await axios
      .get(
        `https://maps.googleapis.com/maps/api/streetview?size=1600x1600&fov=120&heading=${heading}&location=${latitude},${longitude}&key=${this.apiKey}`,
        {responseType: 'arraybuffer'}
      )
      .then((res) => {
        return res.data
      })

    if (data.status != 'OK' || !data.pano_id) {
      return {
        error: 'Error fetching image from Google Street View.',
        status: Status.INTERNAL_ERROR
      }
    }

    const base64: string = Buffer.from(data).toString('base64')

    return {
      data: {
        base64
      },
      status: Status.OK
    }
  }
}

export const googleStreetView = new GoogleStreetView()
