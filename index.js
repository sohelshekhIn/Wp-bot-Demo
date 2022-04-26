const wa = require('@open-wa/wa-automate');
wa.create({
    sessionId: "Test",
    multiDevice: true, //required to enable multiDevice support
    authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
    blockCrashLogs: true,
    disableSpins: true,
    headless: true,
    hostNotificationLang: 'PT_BR',
    logConsole: false,
    popup: true,
    restartOnCrash: true,
    useChrome: true,
    qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));

let masterCommand = "/bot"

function start(client) {
    console.log("[+] Client created");
    let isSessionStarted = false;
    let sessionMode = true;
    client.onMessage(async message => {
        if (sessionMode) {
            // command based bot
            if (message.body.substring(0, masterCommand.length) === masterCommand) {
                // use switch case to handle different commands
                switch (message.body.substring(masterCommand.length).trim().toLowerCase()) {
                    case "help":
                        await client.sendText(message.from, "List of commands: \n/bot help \n/bot ping \n/bot status \n/bot change session \nNew commands will be added soon");
                        break;
                    case "change session":
                        await client.sendText(message.from, "Session changed to Session Based Bot");
                        sessionMode = false;
                        break;
                    case "ping":
                        await client.sendText(message.from, "pong");
                        break;
                    case "status":
                        await client.sendText(message.from, "Status: Online");
                        break;
                    case "hello":
                    case "hi":
                        await client.sendText(message.from, "Hi, \nWelcome to my bot! \n Currently in Command Based Bot Mode");
                        break;
                    default:
                        await client.sendText(message.from, "Not a command");
                        break;
                }
            }
        } else {
            // Session based bot, which uses start command to start a session
            // check if session is already started, if yes then snd message that session is already running
            if (message.body.toLowerCase() === masterCommand + " start") {
                if (isSessionStarted) {
                    await client.sendText(message.from, "Session is already running");
                } else {
                    isSessionStarted = true;
                    await client.sendText(message.from, "Session started");
                }
            } else if (message.body.toLowerCase() === masterCommand + " stop") {
                if (isSessionStarted) {
                    isSessionStarted = false;
                    await client.sendText(message.from, "Session stopped!");
                } else {
                    await client.sendText(message.from, "Session is not running!");
                }
            } else if (message.body.toLowerCase() === masterCommand + " change session") {
                if (!isSessionStarted) {
                    await client.sendText(message.from, "Session is not running!");
                }
            }

            if (isSessionStarted) {
                switch (message.body.toLowerCase()) {
                    case "help":
                        await client.sendText(message.from, "List of commands: \nhelp\nping \nstatus \nchange session \nNew commands will be added soon");
                        break;
                    case "change session":
                        await client.sendText(message.from, "Session changed to Command Based Bot");
                        sessionMode = true;
                        break;
                    case "ping":
                        await client.sendText(message.from, "pong");
                        break;
                    case "status":
                        await client.sendText(message.from, "Status: Online");
                        break;
                    case "hello":
                    case "hi":
                    case masterCommand + " start":
                        await client.sendText(message.from, "Hi, \nWelcome to my bot! \n Currently in Session Based Bot Mode");
                        break;
                    default:
                        await client.sendText(message.from, "Not a command");
                        break;

                }
            }
        }
    });
}