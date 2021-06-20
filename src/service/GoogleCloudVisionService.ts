import vision, {ImageAnnotatorClient} from '@google-cloud/vision'

class GoogleCloudVisionService {
  //Todo: Find correct type
  client: ImageAnnotatorClient

  constructor() {
    this.client = new vision.ImageAnnotatorClient()
  }

  getTextFromImage = async (base64: string): Promise<string[]> => {
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

export const googleCloudVisionService = new GoogleCloudVisionService()
