"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage = /** @class */ (function () {
    function ErrorMessage(error, message) {
        this.error = error;
        this.message = message;
    }
    ErrorMessage.prototype.getError = function () {
        return this.error;
    };
    ErrorMessage.prototype.getMessage = function () {
        return this.message;
    };
    return ErrorMessage;
}());
exports.default = ErrorMessage;
//# sourceMappingURL=ErrorMessage.js.map