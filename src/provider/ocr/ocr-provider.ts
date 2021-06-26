import {Response} from 'src/util/response-utils'

interface OcrProvider {
  extractTextFromImage(base64: string): Promise<Response<ExtractedText>>
}

type ExtractedText = {
  text: string[]
}

export {OcrProvider, ExtractedText}
