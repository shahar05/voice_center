import { Voice_BL } from "./BL/voice_bl";
import { Call } from './models';
import { ErrorHandler } from "./errorHandlers/errorHandler";
import { Application } from "express";
import express from 'express';
import voice_Api from "./API/voice_api";
import bodyParser from "body-parser";

const app: Application = express();
const xmlparser = require('express-xml-bodyparser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(xmlparser());


app.use('/api/voice-center', voice_Api)

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(3000, () => {
    console.log('Server is up and running');

})

