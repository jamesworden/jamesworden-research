interface OcrProvider {
  extractTextFromImage(base64: string): Promise<string[]>
}

export {OcrProvider}
