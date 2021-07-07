import {Failure} from 'src/util'

interface OcrProvider {
  getTextFromImage(base64: string): Promise<string[]>
}

export {OcrProvider}
