import fetch from 'node-fetch'
import parser from 'xml2json'
import readline from 'readline'
import cliProgress from 'cli-progress'
import colors from 'ansi-colors'
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let shutterSpeed = 10
let cameraIP = '192.168.0.10'
let firstRun = true

let initBar = new cliProgress.SingleBar({
    format: 'Initializing |' + colors.red('{bar}') + '| {percentage}% || {value}/{total} Requests',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
}, cliProgress.Presets.shades_grey);

let interBar = new cliProgress.SingleBar({
    format: 'Imaging |' + colors.red('{bar}') + '| {percentage}% || {value}/{total} Frames',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
}, cliProgress.Presets.shades_grey);

prompt()
/*
taking more than one image doesnt work
*/
async function prompt() {
    if (firstRun) await init()
    firstRun = false
    rl.question(`Olympus-Observatory-Console>`, input => {
        if (input.includes("shutter")) {
            changeShutterSpeed(input.substring(8))
        } else if (input.includes("inter")) {
            firstRun = true
            inter()
        } else if (input.includes("iso")) {
            changeISO(parseInt(input.substring(4)))
        } else if (input.includes("info")) {
            console.log(info())
            prompt()
        } else if (input.includes("init")) {
            init()
        } else if (input.includes("changeIP")) {
            cameraIP = input.substring(9)
            init()
            prompt()
        } else {
            console.log(
                "'shutter [shutter speed in seconds]' : sets the shutter speed of the camera\n" +
                "'inter'                              : you will be prompted through setting up the intervelometer\n" +
                "'iso [ISO value]'                    : will set the ISO setting of the sensor\n" +
                "'info'                               : will show you all the cameras settings\n" +
                "'init'                               : initializes the command software\n" +
                "'changeIP [###.###.###.###]'         : will change the pre programed ip of the camera and will reinitialize it\n" +
                "'help'                               : will list all commands"
            )
            prompt()
        }
    })
}

async function info() {
    let fStop = "f/" + (parser.toJson(await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=focalvalue`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    }), { object: true }).desc.value)

    let shutter = shutterSpeed + "\""

    let isospeedvalue = "ISO" + (parser.toJson(await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=isospeedvalue`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    }), { object: true }).desc.value)

    return "Camera Settings:\nShutter Speed: " + shutter + "\nF-Stop: " + fStop + "\nISO: " + isospeedvalue
}

async function init() {
    initBar.start(28, 0)
    await fetch(`http://${cameraIP}/get_connectmode.cgi`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(1)
    await fetch(`http://${cameraIP}/get_commandlist.cgi`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(2)
    await fetch(`http://${cameraIP}/get_connectmode.cgi`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(3)
    await fetch(`http://${cameraIP}/switch_cammode.cgi?mode=rec&lvqty=0320x0240`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(4)
    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=takemode`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(5)
    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=focalvalue`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(6)
    //props
    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=shutspeedvalue`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(7)
    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=isospeedvalue`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(8)
    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=wbvalue`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(9)
    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=expcomp`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(10)
    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=drivemode`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(11)
    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=touchactiveframe`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(12)
    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=noisereduction`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(13)
    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=lowvibtime`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(14)
    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=bulbtimelimit`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(15)
    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=artfilter`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(16)
    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=digitaltelecon`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(17)
    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=colortone`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(18)
    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=colorphase`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(19)
    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=cameradrivemode`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(20)
    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=exposemovie`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(21)
    await fetch(`http://${cameraIP}/switch_cammode.cgi?mode=play`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(22)
    await fetch(`http://${cameraIP}/get_caminfo.cgi`, {
        method: 'get',
        headers: {
            'Host': '192.168.0.10',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(23)
    await fetch(`http://${cameraIP}/get_connectmode.cgi`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(24)
    await fetch(`http://${cameraIP}/get_connectmode.cgi`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(25)
    await fetch(`http://${cameraIP}/switch_cammode.cgi?mode=play`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(26)
    await fetch(`http://${cameraIP}/switch_cammode.cgi?mode=rec&lvqty=0640x0480`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(27)
    await fetch(`http://${cameraIP}/exec_takemisc.cgi?com=startliveview&port=28488`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    initBar.increment()
    initBar.update(28)
    initBar.stop();
}

async function changeISO(iso) {
    await fetch(`http://${cameraIP}/set_camprop.cgi?prop=set&propname=isospeedvalue`, {
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
    //TODO: actually implement 'now'
    rl.question("Time to start hh:mm ('now' to start now): ", async timeToStart => {
        if (timeToStart.length != 5) {
            console.log("Invalid time.")
            prompt()
        }
        let currentDate = new Date()
        let startDate = new Date(`${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()} ${timeToStart}`)
        let milsUntilStart = startDate.getTime() - currentDate.getTime()
        rl.question('Number of shots: ', async shot => {
            shots = shot
            let oldDateObj = new Date()
            console.log("Estimated Imaging Time: " + (shots * (shutterSpeed + 0.5)) < 60 ? ((shots * (shutterSpeed + 0.5)) + "min\nEstimated End Of Imaging: " + formatDate(new Date(oldDateObj.getTime() + (shots * (shutterSpeed + 0.5)) * 60000))) : ((shots * (shutterSpeed + 0.5)) / 60 + "hrs\nEstimated End Of Imaging: " + formatDate(new Date(oldDateObj.getTime() + (shots * (shutterSpeed + 0.5)) * 60000))))
            console.log(`Waiting for ${milsUntilStart / 1000 / 60} minutes (${timeToStart})...`)
            await new Promise(r => setTimeout(r, milsUntilStart));
            console.log('Starting Imaging...')
            interBar.start(shots, 0)
            for (let i = 1; i <= shots; i++) {
                let res = await fetch(`http://${cameraIP}/exec_takemotion.cgi?com=starttake`, {
                    method: 'get',
                    headers: {
                        'Host': cameraIP,
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'Accept-Encoding': 'identity',
                        'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)',
                    }
                }).catch(error => console.log('error:', error))
                await new Promise(r => setTimeout(r, shutterSpeed * 915));
                await fetch(`http://${cameraIP}/exec_takemotion.cgi?com=stoptake`, {
                    method: 'get',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'Accept-Encoding': 'identity',
                        'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
                    }
                })
                interBar.increment()
                interBar.update(i)
                //change back to 500ms once noise reduction is turned off
                await new Promise(r => setTimeout(r, shutterSpeed * 1000 + 500));
            }
            interBar.stop();
            prompt()
        })
    })
}

function formatDate(date) {
    var hours = date.getHours()
    var minutes = date.getMinutes()
    var ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12
    hours = hours ? hours : 12
    minutes = minutes < 10 ? '0' + minutes : minutes
    var strTime = hours + ':' + minutes + ' ' + ampm
    let dateStr = "Today"
    if (new Date().getDate() != date.getDate) dateStr = "Tomorrow"
    return (dateStr + " , " + strTime)
}