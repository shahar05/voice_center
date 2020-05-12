"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ParsedXMLCallConverter {
    convertFromParsedXmlToJSON(parsedXml) {
        let dictionary = {};
        let data = parsedXml[0].param[0].value[0].struct[0].member;
        for (const datum of data) {
            let value;
            if (datum.value[0].string) {
                value = datum.value[0].string[0];
            }
            else if (datum.value[0].i8) {
                value = Number(datum.value[0].i8[0]);
            }
            else if (datum.value[0].i4) {
                value = Number(datum.value[0].i4[0]);
            }
            dictionary[datum.name] = value || '';
        }
        return dictionary;
    }
}
exports.ParsedXMLCallConverter = ParsedXMLCallConverter;
