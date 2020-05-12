"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const voice_api_1 = __importDefault(require("./API/voice_api"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = express_1.default();
const xmlparser = require('express-xml-bodyparser');
// parse application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(xmlparser());
app.use('/api/voice-center', voice_api_1.default);
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.listen(3000, () => {
    console.log('Server is up and running');
});
