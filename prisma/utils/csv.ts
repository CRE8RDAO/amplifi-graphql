import { parse } from 'csv-parse';
import * as fs from 'fs';

export async function fetchCSV<Type>(fileLocation: string, expectedHeaders: Array<string>): Promise<Array<Type>>  {
    const raw = await parseCSV(fileLocation);
    if (raw.length < 2) {
      throw fileLocation + 'has no data';
    }
    const { headers, data } = seperateCSV(raw);
    try {
      verifyHeaders(headers, expectedHeaders);
    } catch (e) {
      throw fileLocation + ':' + e;
    }
    const headersToPos = indexHeaders(headers, expectedHeaders);
    // @ts-ignore
    const entries: Array<Type> = data.map((r) => {
      let entry = {};
      for (let h of expectedHeaders) {
        entry = {
          ...entry,
          [h]: r[headersToPos[h]],
        };
      }
      return entry;
    });
    return entries;
  };


const seperateCSV = (data: CSVResponse) => {  
    const headers = [...data][0]
    data.shift()
    return {
        headers,
        data: [...data]
    }
}

const verifyHeaders = (actualHeaders: Array<string>, expectedHeaders: Array<string>) => {
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

const indexHeaders = (actualHeaders: Array<string>, expectedHeaders: Array<string>) : HeadersToPos => {
    let headerPos = {}
    for (let eh of expectedHeaders) {
        headerPos[eh] = actualHeaders.findIndex(ah => ah == eh)
    }
    return headerPos
}


type CSVResponse = Array<Array<string>>

const parseCSV = (fileLocation: string) : Promise<CSVResponse | undefined> => {
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