"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextFromBase64 = void 0;
const vision_1 = __importDefault(require("@google-cloud/vision"));
const client = new vision_1.default.ImageAnnotatorClient();
let getTextFromBase64 = (base64) => __awaiter(void 0, void 0, void 0, function* () {
    let request = { image: { content: Buffer.from(base64, 'base64') } }, [result] = yield client.textDetection(request), panotext = [];
    if (result['textAnnotations'] == null || result['textAnnotations'] == undefined)
        return panotext;
    result.textAnnotations.forEach((annotation) => {
        let text = annotation.description || '';
        if (!text.includes('©') && !text.includes('Google'))
            panotext.push(text);
    });
    return panotext;
});
exports.getTextFromBase64 = getTextFromBase64;
//# sourceMappingURL=GoogleCloudVision.js.map