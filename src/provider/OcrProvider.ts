import {Response} from 'src/util/Status'

interface OcrProvider {
  extractTextFromImage(base64: string): Promise<Response<ExtractedText>>
}

type ExtractedText = {
  text: string[]
}

export {OcrProvider, ExtractedText}
