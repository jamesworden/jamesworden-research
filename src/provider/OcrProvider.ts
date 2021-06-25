interface OcrProvider {
  extractTextFromImage(base64: string): Promise<ExtractedTextResponse>
}

type ExtractedTextResponse = {
  data?: {
    text: string[]
  }
  status: ExtractedTextStatus
  message?: string
}

enum ExtractedTextStatus {
  OK = 'Success!',
  INTERNAL_ERROR = 'There was an error processing your request!',
  NO_TEXT_FOUND = 'There was no text found in this image'
}

export {OcrProvider, ExtractedTextResponse, ExtractedTextStatus}
