import { ExtractedText, OcrProvider } from './ocr-provider';
import { FunctionResponse, HttpStatusCode } from '../../util';
import { Worker, createWorker } from 'tesseract.js';

class Tesseract implements OcrProvider {
	worker: Worker;

	/**
	 * TODO: replace with better logger
	 */
	constructor() {
		this.worker = createWorker({
			logger: (m) => console.log(m),
		});
	}

	extractTextFromImage = async (base64: string): Promise<FunctionResponse<ExtractedText>> => {
		const imageBuffer = Buffer.from(base64);

		/**
		 * TODO: see if we should create some sort of init function so
		 * all of this doesn't have to be repeated
		 */
		await this.worker.load();
		await this.worker.loadLanguage('eng');
		await this.worker.initialize('eng');

		const {
			data: { text },
		} = await this.worker.recognize(imageBuffer);

		return {
			httpResponse: {
				text: text.split(','),
			},
			error: false,
			httpStatusCode: HttpStatusCode.OK,
		};
	};

	// await worker.terminate()
}

export const tesseract = new Tesseract();
