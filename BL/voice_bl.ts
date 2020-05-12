import axios from 'axios';
import { VoiceCallResponse, Voice_calls_api_request_body, Call, ServerError, OutgoingCall } from '../models';
import { DataAccessLayer } from '../DAL/dal';
import { ErrorSource, CDRCallType } from '../enums';
import { ParsedXMLCallConverter } from '../Helpers/callXmlConverter';
import { ErrorHandler } from '../errorHandlers/errorHandler';
const BASE_VOICE_URL = 'https://api1.voicenter.co.il/hub/cdr/';
const VOICE_CENTER_KEY = "KhjYAPIdVl34hP2PUrGA";
export class Voice_BL {
    private dal: DataAccessLayer = new DataAccessLayer();

    handleIncomingCall(body: any ) {
        return new Promise((resolve, reject) => {
            body = body.methodcall.params;
            if (!body) {
                resolve();
                return;
            }

            let parsedXMLCallConverter = new ParsedXMLCallConverter();
            let outgoingCall: OutgoingCall = parsedXMLCallConverter.convertFromParsedXmlToJSON(body);
            if (outgoingCall.type !== CDRCallType.ExtensionOutgoing) {
                resolve();
                return;
            }

            let call: Call = this.convertCallToAdjustType(outgoingCall);
            this.dal.testIfFirstInteraction(call.TargetNumber).then((dbResponse: any) => {
                call.first_interaction = (!dbResponse || dbResponse.length === 0);
                this.setCallsToDB([call]).then((res) => {
                    resolve('Done!')
                })
            }).catch((err) => {
                reject({
                    source: ErrorSource.Inner,
                    err: err
                })
            })
        })
    }



    private convertCallToAdjustType(incomingCall: OutgoingCall): Call {
        let call: Call = {
            Date: new Date().toISOString(),
            CallerNumber: incomingCall.caller,
            DID: incomingCall.did,
            TargetNumber: incomingCall.target,
            Duration: incomingCall.duration
        }
        return call;
    }

    setCallsToDB(calls: Call[]) {
        return new Promise((resolve, reject) => {
            this.dal.insertCalls(calls).then(() => {
                resolve()
            }).catch((err) => {
                let error: ServerError = {
                    source: ErrorSource.Inner,
                    err: err
                }
                reject(error)
            })
        })
    }

    private getCalls(startDate: Date, endDate: Date): Promise<Call[]> {
        return new Promise((resolve, reject) => {

            let requestPayload: Voice_calls_api_request_body = this.getBaseRequestBody(startDate, endDate);
            axios.post(BASE_VOICE_URL, requestPayload).then((axiosResponse) => {

                let data: VoiceCallResponse = axiosResponse.data;
                if (data.ERROR_NUMBER !== 0) {
                    let error: ServerError = {
                        source: ErrorSource.VoiceCenter,
                        err: data.ERROR_NUMBER
                    }
                    reject(error);
                    return;
                }

                let calls: Call[] = data.CDR_LIST

                calls = calls.map(obj => {
                    return { ...obj, first_interaction: true }
                });
                resolve(calls)

            }).catch((err) => {
                let error: ServerError = {
                    source: ErrorSource.Inner,
                    err: err
                }
                reject(error);
            })
        })
    }

    private getBaseRequestBody(startDate: Date, endDate: Date): Voice_calls_api_request_body {

        let requestPayload: Voice_calls_api_request_body = {
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
        }
        return requestPayload;
    }
    private getMayMonthStartAndEndDates() {
        let date = new Date()
        let startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return { startDate, endDate };
    }

    initIncomingCallDb() {
        return new Promise((resolve, reject) => {
            let { startDate, endDate } = this.getMayMonthStartAndEndDates();

            this.getCalls(startDate, endDate).then((calls: Call[]) => {

                this.setCallsToDB(calls).then(() => {
                    resolve('Done!')
                }).catch(err => reject(err))
            }).catch(err => reject(err))
        })
    }


    runRetroactiveInteractionUpdate() {
        return new Promise((resolve, reject) => {

            let { startDate, endDate } = this.getMayMonthStartAndEndDates();
            this.dal.getCallsBetweenDates(startDate.toISOString(), endDate.toISOString()).then((calls: Call[]) => {
                let targetNumbers = calls.map(call => call.TargetNumber);

                this.dal.getAllMatchingCalls(targetNumbers).then((matchingTargetNumber: { TargetNumber: string }[]) => {
                    
                    let matchingTargetNumberSet = new Set<string>(matchingTargetNumber.map((number) => number.TargetNumber))
                    let callsToUpdate: string[] = [];
                    for (const call of calls) {
                        if (matchingTargetNumberSet.has(call.TargetNumber)) {
                            if (call.id) {
                                callsToUpdate.push(call.id);
                            }
                        }
                    }

                    this.dal.updateFirstInteractionCalls(callsToUpdate,false).then(() => {
                        resolve('Done!')
                    }).catch(err => {
                        reject({
                            source: ErrorSource.Inner,
                            err: err
                        })
                    })
                }).catch(err => {
                    reject({
                        source: ErrorSource.Inner,
                        err: err
                    })
                })
            }).catch(err => {
                reject({
                    source: ErrorSource.Inner,
                    err: err
                })
            })
        })
    }

}
