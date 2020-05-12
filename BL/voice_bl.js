"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dal_1 = require("../DAL/dal");
const enums_1 = require("../enums");
const callXmlConverter_1 = require("../Helpers/callXmlConverter");
const BASE_VOICE_URL = 'https://api1.voicenter.co.il/hub/cdr/';
const VOICE_CENTER_KEY = "KhjYAPIdVl34hP2PUrGA";
class Voice_BL {
    constructor() {
        this.dal = new dal_1.DataAccessLayer();
    }
    handleIncomingCall(body) {
        return new Promise((resolve, reject) => {
            body = body.methodcall.params;
            if (!body) {
                resolve();
                return;
            }
            let parsedXMLCallConverter = new callXmlConverter_1.ParsedXMLCallConverter();
            let outgoingCall = parsedXMLCallConverter.convertFromParsedXmlToJSON(body);
            if (outgoingCall.type !== enums_1.CDRCallType.ExtensionOutgoing) {
                resolve();
                return;
            }
            let call = this.convertCallToAdjustType(outgoingCall);
            this.dal.testIfFirstInteraction(call.TargetNumber).then((dbResponse) => {
                call.first_interaction = (!dbResponse || dbResponse.length === 0);
                this.setCallsToDB([call]).then((res) => {
                    resolve('Done!');
                });
            }).catch((err) => {
                reject({
                    source: enums_1.ErrorSource.Inner,
                    err: err
                });
            });
        });
    }
    convertCallToAdjustType(incomingCall) {
        let call = {
            Date: new Date().toISOString(),
            CallerNumber: incomingCall.caller,
            DID: incomingCall.did,
            TargetNumber: incomingCall.target,
            Duration: incomingCall.duration
        };
        return call;
    }
    setCallsToDB(calls) {
        return new Promise((resolve, reject) => {
            this.dal.insertCalls(calls).then(() => {
                resolve();
            }).catch((err) => {
                let error = {
                    source: enums_1.ErrorSource.Inner,
                    err: err
                };
                reject(error);
            });
        });
    }
    getCalls(startDate, endDate) {
        return new Promise((resolve, reject) => {
            let requestPayload = this.getBaseRequestBody(startDate, endDate);
            axios_1.default.post(BASE_VOICE_URL, requestPayload).then((axiosResponse) => {
                let data = axiosResponse.data;
                if (data.ERROR_NUMBER !== 0) {
                    let error = {
                        source: enums_1.ErrorSource.VoiceCenter,
                        err: data.ERROR_NUMBER
                    };
                    reject(error);
                    return;
                }
                let calls = data.CDR_LIST;
                calls = calls.map(obj => {
                    return Object.assign({}, obj, { first_interaction: true });
                });
                resolve(calls);
            }).catch((err) => {
                let error = {
                    source: enums_1.ErrorSource.Inner,
                    err: err
                };
                reject(error);
            });
        });
    }
    getBaseRequestBody(startDate, endDate) {
        let requestPayload = {
            code: VOICE_CENTER_KEY,
            version: "2",
            format: "JSON",
            type: "Extension Outgoing",
            fields: [
                "Date",
                "DID",
                "CallerNumber",
                "TargetNumber",
                "Duration",
            ],
            search: {
                fromdate: startDate.toISOString(),
                todate: endDate.toISOString(),
            }
        };
        return requestPayload;
    }
    getMayMonthStartAndEndDates() {
        let date = new Date();
        let startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return { startDate, endDate };
    }
    initIncomingCallDb() {
        return new Promise((resolve, reject) => {
            let { startDate, endDate } = this.getMayMonthStartAndEndDates();
            this.getCalls(startDate, endDate).then((calls) => {
                this.setCallsToDB(calls).then(() => {
                    resolve('Done!');
                }).catch(err => reject(err));
            }).catch(err => reject(err));
        });
    }
    runRetroactiveInteractionUpdate() {
        return new Promise((resolve, reject) => {
            let { startDate, endDate } = this.getMayMonthStartAndEndDates();
            this.dal.getCallsBetweenDates(startDate.toISOString(), endDate.toISOString()).then((calls) => {
                let targetNumbers = calls.map(call => call.TargetNumber);
                this.dal.getAllMatchingCalls(targetNumbers).then((matchingTargetNumber) => {
                    let matchingTargetNumberSet = new Set(matchingTargetNumber.map((number) => number.TargetNumber));
                    let callsToUpdate = [];
                    for (const call of calls) {
                        if (matchingTargetNumberSet.has(call.TargetNumber)) {
                            if (call.id) {
                                callsToUpdate.push(call.id);
                            }
                        }
                    }
                    this.dal.updateFirstInteractionCalls(callsToUpdate, false).then(() => {
                        resolve('Done!');
                    }).catch(err => {
                        reject({
                            source: enums_1.ErrorSource.Inner,
                            err: err
                        });
                    });
                }).catch(err => {
                    reject({
                        source: enums_1.ErrorSource.Inner,
                        err: err
                    });
                });
            }).catch(err => {
                reject({
                    source: enums_1.ErrorSource.Inner,
                    err: err
                });
            });
        });
    }
}
exports.Voice_BL = Voice_BL;
