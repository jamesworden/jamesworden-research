import vision, {ImageAnnotatorClient} from '@google-cloud/vision'

import {OcrProvider} from '.'
import {google} from '@google-cloud/vision/build/protos/protos'
import {textContainsGoogleWatermark} from '../panorama-image'

class GoogleCloudVision implements OcrProvider {
  client: ImageAnnotatorClient = new vision.ImageAnnotatorClient()

  getTextFromImage = async (base64: string): Promise<string[]> => {
    return this.client
      .textDetection(this.getImageOptions(base64))
      .then(([result]) =>
        this.getTextFromTextAnnotations(result.textAnnotations)
      )
  }

  getTextFromTextAnnotations(annotations: TextAnnotations): string[] {
    return annotations
      ? this.getTextFromDefinedTextAnnotations(annotations)
      : []
  }

  getTextFromDefinedTextAnnotations(
    annotations: DefinedTextAnnotations
  ): string[] {
    let array: string[] = []

    for (let annotation of annotations) {
      const description: TextAnnotationDescription = annotation.description

      if (description && this.isValidAnnotationDescription(description)) {
        array.push(description)
      }

      const confidence: number | null | undefined = annotation.confidence

      if (confidence) {
        array.push(`Confidence for text detection: ${confidence}`)
      }
    }

    return array
  }

  getImageOptions(base64: string): ImprovedRequest {
    return {
      image: {
        content: Buffer.from(base64, 'base64')
      }
    }
  }

  isValidAnnotationDescription(
    description: TextAnnotationDescription
  ): boolean {
    return !!description && !textContainsGoogleWatermark(description)
  }
}

type TextAnnotations =
  | google.cloud.vision.v1.IEntityAnnotation[]
  | null
  | undefined

type DefinedTextAnnotations = google.cloud.vision.v1.IEntityAnnotation[]

type TextAnnotationDescription = string | null | undefined

export const googleCloudVision = new GoogleCloudVision()

/**
 * From google's source code, I don't think they have types set on NPM
 */
interface ImprovedRequest {
  image?: {
    source?: {
      filename?: string
      imageUri?: string
    }
    content?: Uint8Array | string | null
  }
  features?: any
}
