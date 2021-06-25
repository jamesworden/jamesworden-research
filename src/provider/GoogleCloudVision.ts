import {
  ExtractedTextResponse,
  ExtractedTextStatus,
  OcrProvider
} from './OcrProvider'
import vision, {ImageAnnotatorClient} from '@google-cloud/vision'

class GoogleCloudVision implements OcrProvider {
  client: ImageAnnotatorClient = new vision.ImageAnnotatorClient()

  extractTextFromImage = async (
    base64: string
  ): Promise<ExtractedTextResponse> => {
    const request = {
      image: {
        content: Buffer.from(base64, 'base64')
      }
    }

    await this.client.textDetection(request).then(([result]) => {
      if (!result.textAnnotations || result.textAnnotations.length == 0) {
        return {status: ExtractedTextStatus.NO_TEXT_FOUND}
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
        status: ExtractedTextStatus.OK
      }
    })

    return {status: ExtractedTextStatus.INTERNAL_ERROR}
  }
}

export const googleCloudVision = new GoogleCloudVision()
