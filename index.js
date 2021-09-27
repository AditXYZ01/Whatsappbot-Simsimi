const { create, Client } = require('@open-wa/wa-automate')
const { color } = require('./util')
const msgHandler = require('./msgHandler')
const options = require('./util/options')


const start = (client = new Client()) => {
            console.log('[DEV]', color('Yaelahda', 'yellow'))
            console.log('[CLIENT] CLIENT Started!')

            // Force it to keep the current session
            client.onStateChanged((state) => {
                console.log('[Client State]', state)
                if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
            })

            // listening on message
            client.onMessage((message) => {
                // Message Handler
                msgHandler(client, message)
            })
            
            client.onIncomingCall(( async (call) => {
            await client.sendText(call.peerJid, 'Maaf, BOT tidak menerima panggilan.\n\nCALL = BLOCK!')
            .then(() => client.contactBlock(call.peerJid))
        }))
}

create(options(true, start))
    .then((client) => start(client))
    .catch((err) => new Error(err))