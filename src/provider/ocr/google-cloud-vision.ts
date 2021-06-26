import {ExtractedText, OcrProvider} from './ocr-provider'
import {Response, Status} from 'src/util/response-utils'
import vision, {ImageAnnotatorClient} from '@google-cloud/vision'

class GoogleCloudVision implements OcrProvider {
  client: ImageAnnotatorClient = new vision.ImageAnnotatorClient()

  extractTextFromImage = async (
    base64: string
  ): Promise<Response<ExtractedText>> => {
    const request = {
      image: {
        content: Buffer.from(base64, 'base64')
      }
    }

    await this.client.textDetection(request).then(([result]) => {
      if (!result.textAnnotations || result.textAnnotations.length == 0) {
        return {
          error: 'No data found for this image.',
          status: Status.INTERNAL_ERROR
        }
      }

      let textArray: string[] = []

      result.textAnnotations.forEach((annotation) => {
        const text: string | null | undefined = annotation.description

        // Streetview image contains watermarks at the bottom
        if (text && !text.includes('©') && !text.includes('Google')) {
          textArray.push(text)
        }
      })

      return {
        data: {
          text: textArray
        },
        status: Status.OK
      }
    })

    return {
      error: 'Unable to fetch data from Google Cloud Vision.',
      status: Status.INTERNAL_ERROR
    }
  }
}

export const googleCloudVision = new GoogleCloudVision()
