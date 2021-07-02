import { FunctionResponse } from '../../util';

interface OcrProvider {
	extractTextFromImage(base64: string): Promise<FunctionResponse<ExtractedText>>;
}

type ExtractedText = {
	text: string[];
};

export { OcrProvider, ExtractedText };
