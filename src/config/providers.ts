import {
  DirectionsProvider,
  OcrProvider,
  PanoramaImageProvider,
  googleCloudVision,
  googleMaps,
  googleStreetView,
  tesseract
} from '../provider'

/**
 * TODO: Switch app providers through API
 */

export const directionsProviders: DirectionsProvider[] = [googleMaps]

export const ocrProviders: OcrProvider[] = [googleCloudVision, tesseract]

export const panoramaImageProviders: PanoramaImageProvider[] = [
  googleStreetView
]
