import { ServerError } from "../models";
import { ErrorSource } from "../enums";

export class ErrorHandler {
    static handleError(serverError: ServerError) {
        console.log('Something went wrong! ')
        let errText
        if (serverError.source === ErrorSource.VoiceCenter) {
            errText =   ErrorHandler.getVoiceCenterErrorText(serverError.err);
        } else {
            errText = serverError.err
        }
        console.log(errText)
    }

    static getVoiceCenterErrorText(errNumber: number) {
        switch (errNumber) {
            case 1: return 'Request limit exceeded. Please try again later.';
            case 2: return 'Authorization failed';
            case 3: return 'CDR limit exceeded';
            case 4: return 'IP address is not trusted.';
            default: return 'Third party error occurred'
        }

    }
}