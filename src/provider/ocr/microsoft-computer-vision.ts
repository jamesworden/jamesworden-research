import {
  ComputerVisionClientRecognizePrintedTextInStreamOptionalParams,
  RecognizePrintedTextInStreamResponse
} from '@azure/cognitiveservices-computervision/esm/models'

import {CognitiveServicesCredentials} from '@azure/ms-rest-azure-js'
import {ComputerVisionClient} from '@azure/cognitiveservices-computervision'
import {OcrProvider} from './ocr-provider'
import {textContainsGoogleWatermark} from '../panorama-image'

class MicrosoftComputerVision implements OcrProvider {
  apiKey: string
  apiEndpoint: string
  client: ComputerVisionClient

  constructor() {
    this.apiKey = process.env.MICROSOFT_COMPUTER_VISION_KEY as string
    this.apiEndpoint = process.env.MICROSOFT_COMPUTER_VISION_ENDPOINT as string

    const cognitiveServiceCredentials = new CognitiveServicesCredentials(
      this.apiKey
    )

    this.client = new ComputerVisionClient(
      cognitiveServiceCredentials,
      this.apiEndpoint
    )
  }

  async getTextFromImage(base64: string): Promise<string[]> {
    const options: ComputerVisionClientRecognizePrintedTextInStreamOptionalParams =
      {
        language: 'en',
        timeout: 3000
      }

    const arrBuff: Buffer = Buffer.from(base64, 'base64')

    const result: RecognizePrintedTextInStreamResponse = await this.client
      .recognizePrintedTextInStream(false, arrBuff, options)
      .then((result) => result)
      .catch((err) => err)

    if (result instanceof Error) {
      return []
    }

    if (!result.regions || result.regions.length == 0) {
      return []
    }

    const strArr: string[] = []

    result.regions.forEach((region) => {
      if (region.lines) {
        region.lines.forEach((line) => {
          if (line.words) {
            line.words.forEach((word) => {
              if (word.text && !textContainsGoogleWatermark(word.text)) {
                strArr.push(word.text)
              }
            })
          }
        })
      }
    })

    return strArr
  }
}

export const microsoftComputerVision = new MicrosoftComputerVision()
