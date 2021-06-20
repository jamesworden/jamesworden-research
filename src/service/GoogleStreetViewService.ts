import axios from 'axios'

class GoogleStreetViewService {
  private key: string

  constructor() {
    this.key = process.env.GOOGLE_MAPS_BACKEND_KEY as string
  }

  getPanoramaId = async (
    latitude: number,
    longitude: number
  ): Promise<string> => {
    return await axios
      .get(
        `https://maps.googleapis.com/maps/api/streetview/metadata?&location=${latitude},${longitude}&key=${this.key}`
      )
      .then((res) => {
        return res.data.pano_id
      })
  }

  getPanoramaImage = async (
    latitude: number,
    longitude: number,
    heading: number = 90
  ): Promise<string> => {
    return await axios
      .get(
        `https://maps.googleapis.com/maps/api/streetview?size=1600x1600&fov=120&heading=${heading}&location=${latitude},${longitude}&key=${this.key}`,
        {responseType: 'arraybuffer'}
      )
      .then((res) => {
        return Buffer.from(res.data).toString('base64')
      })
  }
}

export const googleStreetViewService = new GoogleStreetViewService()
