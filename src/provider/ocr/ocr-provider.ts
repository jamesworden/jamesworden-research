interface OcrProvider {
  getTextFromImage(base64: string): Promise<string[]>
}

export {OcrProvider}
