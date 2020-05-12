"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const voice_bl_1 = require("../BL/voice_bl");
const errorHandler_1 = require("../errorHandlers/errorHandler");
const bl = new voice_bl_1.Voice_BL();
const voice_Api = express.Router();
voice_Api.get('/init-incoming-call', (req, res) => {
    bl.initIncomingCallDb().then((response) => {
        res.send(response);
    }).catch((err) => {
        errorHandler_1.ErrorHandler.handleError(err);
    });
});
voice_Api.post('/incoming-call', (req, res) => {
    bl.handleIncomingCall(req.body).then((response) => {
        res.send(response);
    }).catch((err) => {
        errorHandler_1.ErrorHandler.handleError(err);
    });
});
voice_Api.patch('/retroactive-interaction-update', (req, res) => {
    bl.runRetroactiveInteractionUpdate().then((response) => {
        res.send(response);
    }).catch((err) => {
        errorHandler_1.ErrorHandler.handleError(err);
    });
});
exports.default = voice_Api;
