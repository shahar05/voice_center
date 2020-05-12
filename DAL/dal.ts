import { Connection } from "mysql";
import { Call } from "../models";

const mysql = require('mysql');

const dbDetails = {
    host: 'ballabaleads.c6a8wbut6cut.eu-west-1.rds.amazonaws.com',
    port: 3306,
    database: 'Different_DB',
    username: 'ballaba',
    password: 'ballaba4334',
}

export class DataAccessLayer {
    static connection: Connection;
    constructor() {
        this.initDBConnection();
    }
    private initDBConnection() {
        DataAccessLayer.connection = mysql.createConnection({
            host: dbDetails.host,
            user: dbDetails.username,
            password: dbDetails.password,
            database: dbDetails.database
        });
    }


    testIfFirstInteraction(phoneNumber: string) {
        return new Promise((resolve, reject) => {
            var sqlQuery = `SELECT * FROM IntercationsNEW where phone = '${phoneNumber}' limit 1`;
            DataAccessLayer.connection.query(sqlQuery, (err, value, fields) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(value);
            })
        })
    }
    getCallsBetweenDates(start: string, end: string): Promise<Call[]> {
        return new Promise((resolve, reject) => {

            let sqlQuery = `SELECT * FROM Different_DB.OutgoingCalls where Date BETWEEN '${start}' and '${end}'`
            DataAccessLayer.connection.query(sqlQuery, (err, value: Call[], fields) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(value);
            })
        })
    }


    getAllMatchingCalls(targetNumbers: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            let sqlQuery = `SELECT distinct TargetNumber FROM Different_DB.IntercationsNEW where IntercationsNEW.TargetNumber in('${targetNumbers.join("','")}')`
            DataAccessLayer.connection.query(sqlQuery, (err, value: Call[], fields) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(value);
            })
        })


    }

    updateFirstInteractionCalls(targetNumbers: string[],newValue:boolean) {
        return new Promise((resolve, reject) => {

            let sqlQuery = `UPDATE OutgoingCalls SET first_interaction = ${newValue} where id in('${targetNumbers.join("','")}')`;
            DataAccessLayer.connection.query(sqlQuery, (err, value: Call[], fields) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(value);
            })
        })
    }

    insertCalls(calls: Call[]) {
        return new Promise((resolve, reject) => {
            if (calls.length === 0) {
                console.warn('No record to insert')
                resolve();
            }
            const fields: string[] = ['Date', 'DID', 'CallerNumber', 'TargetNumber', 'Duration', 'first_interaction'];

            var sqlQuery = `INSERT INTO OutgoingCalls (${fields.join(',')}) VALUES ?`;

            var data = []

            for (const call of calls) {
                let dictionaryCall = <{ [key: string]: any }>call
                let newRow = [];
                for (const field of fields) {
                    newRow.push(dictionaryCall[field]);
                }
                data.push(newRow);
            }


            DataAccessLayer.connection.query(sqlQuery, [data], (err) => {
                if (err) {
                    reject(err);
                    return;
                };
                resolve();
            });
        })
    }
}
