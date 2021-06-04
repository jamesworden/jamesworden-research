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
exports.getPanoramaBase64 = exports.getPanoramaId = void 0;
const axios_1 = __importDefault(require("axios"));
const key = process.env.GOOGLE_MAPS_BACKEND_KEY;
let getPanoramaId = (point) => __awaiter(void 0, void 0, void 0, function* () {
    let location = point.toString(), url = `https://maps.googleapis.com/maps/api/streetview/metadata?&location=${location}&key=${key}`, response = yield axios_1.default.get(url);
    return response.data.pano_id;
});
exports.getPanoramaId = getPanoramaId;
let getPanoramaBase64 = (point, heading = 90) => __awaiter(void 0, void 0, void 0, function* () {
    let location = point.toString(), url = `https://maps.googleapis.com/maps/api/streetview?size=1600x1600&fov=120&heading=${heading}&location=${location}&key=${key}`, image = yield axios_1.default.get(url, { responseType: 'arraybuffer' }), base64 = Buffer.from(image.data).toString('base64');
    return base64;
});
exports.getPanoramaBase64 = getPanoramaBase64;
//# sourceMappingURL=GoogleStreetView.js.map