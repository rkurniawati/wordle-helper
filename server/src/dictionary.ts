import * as fs from 'fs';

export default async function loadDictionary(filename: string) : Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.replace(/\r\n/g, "\n").split("\n"));
            }
        });
    });
}