/*
Import
*/
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

/*
Constants
*/
const cmdsPath = path.join(__dirname, '../../cmds');
const scriptName = 'MultiGeneCorrelation.py'
const MultiGeneCorrelationPath = path.join(cmdsPath, scriptName);
const dbPath = path.join('src/db');

/*
MultiGeneCorrelations
*/
function MultiGeneCorrelations(g, s, t) {

    return new Promise( resolve => {
        let qcorr = [];
        let args = [MultiGeneCorrelationPath, '-i', dbPath]
        
        args = args
        .concat(['-sp']).concat(s.map( e => `${e}` ))
        .concat(['-g']).concat(g.map( e => `${e}` ))
        .concat(['-s']).concat(t.map( e => `${e}` ));
        
        let execInfo = [];
    
        const python = spawn(process.env.PYTHON, args);
    
        python.stdout.on('data', data => {
            console.log('Get data from MultiGeneCorrelations.py...');
            qcorr.push(data.toString());
        });
    
        python.stderr.on('data', data => {
            // Handle errors and execution information
            console.log(data.toString());
            execInfo.push(data.toString());
        });
    
        python.on('close', async (code) => {
            if (code == 0) {
                qcorr = JSON.parse(qcorr[0]);
            }
            else {
                qcorr = [];
            }
            fs.appendFileSync(path.join(cmdsPath, `${path.parse(scriptName).name}.log`), execInfo.join(''));
            resolve(qcorr);
        })
    }) 
}

module.exports = MultiGeneCorrelations;