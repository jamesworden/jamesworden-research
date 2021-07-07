import {Worker, createWorker} from 'tesseract.js'

import {OcrProvider} from './ocr-provider'

class Tesseract implements OcrProvider {
  worker: Worker

  constructor() {
    this.worker = createWorker()
  }

  async initWorker() {
    await this.worker.load()
    await this.worker.loadLanguage('eng')
    await this.worker.initialize('eng')
  }

  async terminateWorker() {
    await this.worker.terminate()
  }

  getTextFromImage = async (base64: string): Promise<string[]> => {
    const imageBuffer = Buffer.from(base64)
    await this.initWorker()

    const {
      data: {text}
    } = await this.worker.recognize(imageBuffer)

    return text.split(',')
  }
}

export const tesseract = new Tesseract()
