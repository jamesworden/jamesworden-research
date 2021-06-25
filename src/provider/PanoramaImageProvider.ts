interface PanoramaImageProvider {
  getPanoramaImage(
    latitude: number,
    longitude: number,
    heading: number
  ): Promise<PanoramaImageResponse>

  getPanoramaImageId(
    latitude: number,
    longitude: number
  ): Promise<PanoramaImageIdResponse>
}

type PanoramaImageResponse = {
  data?: {
    base64: string
  }
  status: PanoramaImageStatus
  message?: string
}

type PanoramaImageIdResponse = {
  data?: {
    panoramaId: string
  }
  status: PanoramaImageIdStatus
  message?: string
}

enum PanoramaImageStatus {
  OK = 'Success!',
  INTERNAL_ERROR = 'There was an error processing your request!'
}

enum PanoramaImageIdStatus {
  OK = 'Success!',
  INTERNAL_ERROR = 'There was an error processing your request!'
}

export {
  PanoramaImageProvider,
  PanoramaImageIdResponse,
  PanoramaImageResponse,
  PanoramaImageIdStatus,
  PanoramaImageStatus
}
