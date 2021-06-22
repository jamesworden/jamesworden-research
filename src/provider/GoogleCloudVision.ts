import vision, {ImageAnnotatorClient} from '@google-cloud/vision'

import {OcrProvider} from './OcrProvider'

class GoogleCloudVision implements OcrProvider {
  client: ImageAnnotatorClient

  constructor() {
    this.client = new vision.ImageAnnotatorClient()
  }

  extractTextFromImage = async (base64: string): Promise<string[]> => {
    const request = {
      image: {
        content: Buffer.from(base64, 'base64')
      }
    }

    return await this.client.textDetection(request).then(([result]) => {
      if (!result.textAnnotations) {
        return []
      }

      let textArray: string[] = []

      result.textAnnotations.forEach((annotation) => {
        const text: string | null | undefined = annotation.description

        if (text && !text.includes('©') && !text.includes('Google')) {
          textArray.push(text)
        }
      })

      return textArray
    })
  }
}

export const googleCloudVisionProvider = new GoogleCloudVision()
