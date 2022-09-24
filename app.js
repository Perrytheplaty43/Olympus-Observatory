import fetch from 'node-fetch'
import parser from 'xml2json'
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
            changeShutterSpeed(input.substring(8))
        } else if (input.includes("inter")) {
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
    await fetch(`http://${cameraIP}/get_connectmode.cgi`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/get_commandlist.cgi`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/get_connectmode.cgi`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
    await fetch(`http://${cameraIP}/switch_cammode.cgi?mode=rec&lvqty=0320x0240`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=takemode`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=focalvalue`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

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

    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=isospeedvalue`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=wbvalue`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=expcomp`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=drivemode`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=touchactiveframe`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=noisereduction`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=lowvibtime`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=bulbtimelimit`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=artfilter`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=digitaltelecon`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=colortone`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=colorphase`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=cameradrivemode`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/get_camprop.cgi?prop=desc&propname=exposemovie`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/switch_cammode.cgi?mode=play`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/get_caminfo.cgi`, {
        method: 'get',
        headers: {
            'Host': '192.168.0.10',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/get_connectmode.cgi`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/get_connectmode.cgi`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/switch_cammode.cgi?mode=play`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/switch_cammode.cgi?mode=rec&lvqty=0640x0480`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })

    await fetch(`http://${cameraIP}/exec_takemisc.cgi?com=startliveview&port=28488`, {
        method: 'get',
        headers: {
            'Host': cameraIP,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'User-Agent': 'Mozilla/3.0 (compatible; Indy Library)'
        }
    })
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
    rl.question('Number of shoots: ', async shot => {
        shots = shot
        console.log("Estimated Imaging Time: " + (shots * (shutterSpeed + 0.5)) < 60 ? ((shots * (shutterSpeed + 0.5)) + "min\nEstimated End Of Imaging: " + formatDate(new Date(oldDateObj.getTime() + (shots * (shutterSpeed + 0.5)) * 60000))) : ((shots * (shutterSpeed + 0.5)) / 60 + "hrs\nEstimated End Of Imaging: " + formatDate(new Date(oldDateObj.getTime() + (shots * (shutterSpeed + 0.5)) * 60000))))
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
            console.log(`Image ${i}/${shots} caputered...`)
            await new Promise(r => setTimeout(r, 500));
        }
        prompt()
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