import { parse } from 'csv-parse';
import * as fs from 'fs';

export const seperateCSV = (data: CSVResponse) => {  
    const headers = [...data][0]
    data.shift()
    return {
        headers,
        data: [...data]
    }
}

export const verifyHeaders = (actualHeaders: Array<string>, expectedHeaders: Array<string>) => {
    // confirms all expected headers exist
    for (let h of expectedHeaders) {
        if (!actualHeaders.includes(h)) {
            throw 'data missing ' + h + 'header'
        }
    }
}

interface HeadersToPos {
    [header: string]: number
}

export const indexHeaders = (actualHeaders: Array<string>, expectedHeaders: Array<string>) : HeadersToPos => {
    let headerPos = {}
    for (let eh of expectedHeaders) {
        headerPos[eh] = actualHeaders.findIndex(ah => ah == eh)
    }
    return headerPos
}


type CSVResponse = Array<Array<string>>

export const parseCSV = (fileLocation: string) : Promise<CSVResponse | undefined> => {
    return new Promise((resolve, reject) => {
        const parser = parse({
            delimiter: ",",
        }, (err, records) => {
            if (err) {
                reject(err)
            } else {
                resolve(records)
            }
        })
        fs.createReadStream(fileLocation).pipe(parser);
    })
}