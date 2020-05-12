import * as express from 'express';
import { Voice_BL } from '../BL/voice_bl';
import { VoiceCallResponse, Call } from '../models';
import { ParsedXMLCallConverter } from '../Helpers/callXmlConverter';
import { ErrorHandler } from '../errorHandlers/errorHandler';
const bl = new Voice_BL();


const voice_Api = express.Router()



voice_Api.get('/init-incoming-call', (req: express.Request, res: express.Response) => {
    bl.initIncomingCallDb().then((response) => {
        res.send(response);
    }).catch((err) => {
        ErrorHandler.handleError(err);
    });
})

voice_Api.post('/incoming-call', (req: express.Request, res: express.Response) => {
    bl.handleIncomingCall(req.body).then((response) => {
        res.send(response);
    }).catch((err) => {
        ErrorHandler.handleError(err);
    })
})

voice_Api.patch('/retroactive-interaction-update', (req: express.Request, res: express.Response) => {
    bl.runRetroactiveInteractionUpdate().then((response) => {
        res.send(response);
    }).catch((err) => {
        ErrorHandler.handleError(err);
    })
})


export default voice_Api;