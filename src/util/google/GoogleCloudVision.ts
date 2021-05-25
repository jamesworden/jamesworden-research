import vision from '@google-cloud/vision';

const client = new vision.ImageAnnotatorClient();

/**
 * Get text from a base64 encoded image using Google Cloud Vision OCR
 * @param client Google Cloud Vision client -> so it doesn't get instanciated too frequently.
 * @param {string} base64 Base64 encoded image data
 * @returns {String[]} Text from image
 */
let getTextFromBase64 = async (base64: string): Promise<String[]> => {
	let request = { image: { content: Buffer.from(base64, 'base64') } },
		[result] = await client.textDetection(request),
		panotext: string[] = [];
	if (result['textAnnotations'] == null || result['textAnnotations'] == undefined)
		return panotext;
	result.textAnnotations.forEach((annotation) => {
		let text: string = annotation.description || '';
		if (!text.includes('©') && !text.includes('Google')) panotext.push(text);
	});
	return panotext;
};

export { getTextFromBase64 };