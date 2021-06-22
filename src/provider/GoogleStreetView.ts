import {ImageProvider} from './ImageProvider'
import axios from 'axios'

class GoogleStreetView implements ImageProvider {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_BACKEND_KEY as string
  }

  getPanoramaImageId = async (
    latitude: number,
    longitude: number
  ): Promise<string> => {
    return await axios
      .get(
        `https://maps.googleapis.com/maps/api/streetview/metadata?&location=${latitude},${longitude}&key=${this.apiKey}`
      )
      .then((res) => {
        return res.data.pano_id
      })
  }

  getPanoramaImage = async (
    latitude: number,
    longitude: number,
    heading: number
  ): Promise<string> => {
    if (!heading) {
      heading = 90
    }

    return await axios
      .get(
        `https://maps.googleapis.com/maps/api/streetview?size=1600x1600&fov=120&heading=${heading}&location=${latitude},${longitude}&key=${this.apiKey}`,
        {responseType: 'arraybuffer'}
      )
      .then((res) => {
        return Buffer.from(res.data).toString('base64')
      })
  }
}

export const googleStreetView = new GoogleStreetView()
