# Olympus-Observatory
Software to remotely control a OM-D EM10 MKIII. Should be compatile with any Olympus Camera that supports the OI.Share app. This program gives the user the ability to remotly control their camera's shutter speed, intrevelometer, and ISO. This program is primairaly aimed toward astrophotography but is not limited to it. This program can run on any computer which supports NodeJS.

# List of Commands
`shutter [shutter speed in seconds or fraction of a second]`<br>
This command will set the shutter speed of the camera for later use through the intravelometer.<br><br>
`inter`<br>
This command will prompt you through the inizialization of the intervelometer and will start it depanding on what the user inputs.<br><br>
`iso [ISO value]`<br>
This command will adjust the ISO setting of the camera's sensor.<br><br>
`info`<br>
This command will print to the console the camera's current known settings.<br><br>
`init`<br>
This command will reinitilize the software and should only be used if you or your camera were to run into any issue.<br><br>
`changeIP [###.###.###.###]`<br>
This command will change what the program thinks the IP of your camera is and will reinitilaize the program.<br><br>
`exit`<br>
The exit command will restore the noise reduction setting back to auto which through the initialziaiton process was switched to `off` for the purposses of astrophotograpy. This command will also exit the console/program.<br><br>
`help`<br>
The help command will display all available commands and their functions.
