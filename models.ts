import { ErrorSource, CDRCallType } from "./enums";

export interface VoiceCallResponse {
    ERROR_NUMBER: number;
    ERROR_DESCRIPTION: string;
    CDR_LIST: Call[]
}

export interface Call {
    Date: string;
    CallerNumber: string;
    DID: string;
    TargetNumber: string;
    Duration: number
    first_interaction?: any;
    id?:string;
}

export interface Voice_calls_api_request_body {
    code: string;
    version: string;
    format: string;
    fields: string[];
    type: string;
    search: {
        fromdate: string;
        todate: string;
        phones?: string;
    }
}


export interface ServerError {
    source: ErrorSource
    err: any;
}



export interface OutgoingCall {
    caller: string;
    target: string;
    time: number;
    duration: number;
    ivruniqueid: string;
    type: CDRCallType;
    status: string;
    targetextension: string;
    callerextension: string;
    did: string;
    queuename: string;
    queueid: number;
    dialtime: number;
    record: string;
}

export interface OutgoingCallParsedItem {
    name: string
    value: {
        string?: string;
        i8?: string;
        i4?: string;
    }[]
}
