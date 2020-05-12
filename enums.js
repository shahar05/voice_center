"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorSource;
(function (ErrorSource) {
    ErrorSource[ErrorSource["VoiceCenter"] = 0] = "VoiceCenter";
    ErrorSource[ErrorSource["Inner"] = 1] = "Inner";
})(ErrorSource = exports.ErrorSource || (exports.ErrorSource = {}));
var CDRCallType;
(function (CDRCallType) {
    CDRCallType["IncomingCall"] = "Incoming Call";
    CDRCallType["ExtensionOutgoing"] = "Extension Outgoing";
})(CDRCallType = exports.CDRCallType || (exports.CDRCallType = {}));
