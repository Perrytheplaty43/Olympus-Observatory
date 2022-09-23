import fetch from 'node-fetch'

import readline from 'readline'
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let shutterSpeed = 10
let cameraIP = '192.168.0.10'

prompt()

async function prompt() {
    await init()
    rl.question(`Olympus-Observatory-Console>`, input => {
        if (input.includes("shutter")) {
            changeShutterSpeed(parseInt(input.substring(8)))
        } else if (input.includes("inter")) {
            inter()
        } else if (input.includes("iso")) {
            changeISO(parseInt(input.substring(4)))
        }
    })
}

async function init() {
    await fetch(`http://${cameraIP}/get_connectmode.cgi`, {
        method: 'get',
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/switch_cammode.cgi?mode=play`, {
        method: 'get',
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
}

function changeISO(iso) {
    fetch(`http://${cameraIP}/set_camprop.cgi?prop=set&propname=isospeedvalue`, {
        method: 'post',
        body: `<?xml version="1.0"?><set><value>${iso}</value></set>`
    })
        .catch(error => console.log('error:', error))
        .then(() => {
            rl.close()
        })
    prompt()
}

function changeShutterSpeed(speed) {
    shutterSpeed = speed
    prompt()
}

function inter() {
    let shots
    rl.question('Number of shoots: ', async shot => {
        shots = shot
        for (let i = 1; i <= shots; i++) {
            let res = await fetch(`http://${cameraIP}/exec_takemotion.cgi?com=starttake`, {
                method: 'get',
                headers: {
                    'Host': cameraIP,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Encoding': 'identity',
                    'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
                }
            }).catch(error => console.log('error:', error))
            await new Promise(r => setTimeout(r, shutterSpeed * 1000));
            await fetch(`http://${cameraIP}/exec_takemotion.cgi?com=stoptake`, {
                method: 'get',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Encoding': 'identity',
                    'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
                }
            })
            console.log(`Image ${i}/${shots} caputered...`)
            await new Promise(r => setTimeout(r, 500));
        }
        prompt()
    })
}