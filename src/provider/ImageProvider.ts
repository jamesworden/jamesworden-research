interface ImageProvider {
  // Get a base64 encoded image from a latitude, longitude, and heading value
  getPanoramaImage(
    latitude: number,
    longitude: number,
    heading: number
  ): Promise<string>

  getPanoramaImageId(
    latitude: number,
    longitude: number,
    heading: number
  ): Promise<string>
}

export {ImageProvider}
