"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../enums");
class ErrorHandler {
    static handleError(serverError) {
        console.log('Something went wrong! ');
        let errText;
        if (serverError.source === enums_1.ErrorSource.VoiceCenter) {
            errText = ErrorHandler.getVoiceCenterErrorText(serverError.err);
        }
        else {
            errText = serverError.err;
        }
        console.log(errText);
    }
    static getVoiceCenterErrorText(errNumber) {
        switch (errNumber) {
            case 1: return 'Request limit exceeded. Please try again later.';
            case 2: return 'Authorization failed';
            case 3: return 'CDR limit exceeded';
            case 4: return 'IP address is not trusted.';
            default: return 'Third party error occurred';
        }
    }
}
exports.ErrorHandler = ErrorHandler;
