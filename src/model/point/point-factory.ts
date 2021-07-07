import {Failure, isFailure} from '../../util'
import {OcrProvider, PanoramaImageProvider} from '../../provider'

import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {Option} from '../option'
import {Point} from '.'

class PointFactory {
  panoramaImageProvider: PanoramaImageProvider
  ocrProvider: OcrProvider

  constructor(
    panoramaImageProvider: PanoramaImageProvider,
    ocrProvider: OcrProvider
  ) {
    this.panoramaImageProvider = panoramaImageProvider
    this.ocrProvider = ocrProvider
  }

  async createPoint(
    location: LatLngLiteralVerbose,
    options: Option[]
  ): Promise<Point | Failure> {
    const lat: number = location.latitude
    const lng: number = location.longitude

    let panoramaText: string[] | undefined = undefined
    let panoramaId: string | undefined = undefined

    const optionRes: OptionData | Failure = await this.getOptionData(
      location,
      options
    )

    if (isFailure(optionRes)) {
      return optionRes
    }

    panoramaText = optionRes.panoramaText
    panoramaId = optionRes.panoramaId

    const point: Point = {
      location: {
        latitude: lat,
        longitude: lng
      },
      panoramaId,
      panoramaText
    }

    return point
  }
  private async getOptionData(
    location: LatLngLiteralVerbose,
    options: Option[]
  ): Promise<OptionData | Failure> {
    let panoramaText: string[] | undefined = undefined
    let panoramaId: string | undefined = undefined

    if (options.includes(Option.PANORAMA_TEXT)) {
      const panoramaTextRes = await this.getPanoramaText(location)

      if (isFailure(panoramaTextRes)) {
        return panoramaTextRes
      }

      panoramaText = panoramaTextRes
    }

    if (options.includes(Option.PANORAMA_ID)) {
      const panoramaIdRes: string | Failure =
        await this.panoramaImageProvider.getPanoramaImageId(
          location.latitude,
          location.longitude
        )

      if (isFailure(panoramaIdRes)) {
        return panoramaIdRes
      }

      panoramaId = panoramaIdRes
    }

    return {
      panoramaId,
      panoramaText
    }
  }

  private async getPanoramaText(
    location: LatLngLiteralVerbose
  ): Promise<Failure | string[]> {
    const text: string[] = []

    // Gather text from three different images to simulate a panorama image
    for (let heading = 0; heading < 360; heading += 120) {
      const textRes: Failure | string[] =
        await this.getPanoramaTextFromLocationAndHeading(location, heading)

      if (isFailure(textRes)) {
        return textRes
      }

      text.concat(textRes)
    }

    return text
  }

  private async getPanoramaTextFromLocationAndHeading(
    location: LatLngLiteralVerbose,
    heading: number
  ): Promise<Failure | string[]> {
    const imageRes: string | Failure =
      await this.panoramaImageProvider.getPanoramaBase64EncodedImage(
        location.latitude,
        location.longitude,
        heading
      )

    if (isFailure(imageRes)) {
      return imageRes
    }

    const textRes: string[] | Failure = await this.ocrProvider.getTextFromImage(
      imageRes
    )

    return textRes
  }
}

type OptionData = {
  panoramaId?: string
  panoramaText?: string[]
}

export {PointFactory}
