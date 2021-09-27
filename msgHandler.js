const { Client } = require('@open-wa/wa-decrypt')
const { color } = require('./util')
const moment = require('moment-timezone')
const urlencode = require("urlencode")
const fetch = require('node-fetch')
const gtts = require('node-gtts')('id');
const delay = require('delay');

gtts.createServer(1337);

moment.tz.setDefault('Asia/Jakarta').locale('id')

// random emoticon function	
function repeat(str, num) { 
return (new Array(num+1)).join(str); 
}

module.exports = msgHandler = async (client = new Client(), message) => {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia } = message
        let { body } = message
        let { pushname, verifiedName, formattedName } = sender
        pushname = pushname || verifiedName || formattedName // verifiedName is the name of someone who uses a business account
        if (pushname == undefined || pushname.trim() == '') console.log(sender)
        const dontptt = "Maaf aku tidak mengerti, tolong jangan kirim voice note lagi";
        const dontmedia = "Aku ga suka ya kalau kamu kirim gambar/video begitu 😡";
        const dontsticker = "Tolong jangan kirim aku sticker, aku jadi bingung mau balas apa 😭";
        const igdetect = "Tolong jangan kirim aku sticker, aku jadi bingung mau balas apa 😭";
        
        //// untuk menambah emot secara random
        let emot = ["🤣", "😳", "🤨", "😂", "😭", "🥰", "😡"];
        let random = Math.floor(Math.random() * emot.length);
        let randomemot =  repeat(emot[random], Math.floor(Math.random() * 5));
        
        //// untuk merandom delay mengetik
        let ms = [4000, 5000, 4500, 6000, 5200, 7000, 8000, 9000, 7500];
        let randomms = ms[Math.floor(Math.random() * ms.length)];

        body = (type === 'chat') ? body : ((type === 'image' || type === 'video')) ? caption : ''
            if (isGroupMsg === false) {
                if (isMedia) {
                    client.simulateTyping(from, true);
                    await delay(randomms)
                    client.sendText(from, dontmedia, id)
                    console.log(color(' [USER]', 'blue'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(pushname), color(`Media Detected\n`, 'red'))
                } else if (type == 'sticker') {
                    client.simulateTyping(from, true);
                    await delay(randomms)
                    client.sendText(from, dontsticker, id)
                    console.log(color(' [USER]', 'blue'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(pushname), color(`Sticker Detected\n`, 'red'))
                } else if (type == 'ptt') {
                    await delay(randomms)
                    client.sendPtt(from, 'http://localhost:1337/?text='+urlencode(dontptt)+'&lang=id');
                    console.log(color(' [USER]', 'blue'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(pushname), color(`Voicenote Detected\n`, 'red'))
                } else {
                    var jawab = Math.floor(Math.random() * 2);
                    const similo = body
                    var reqsimi = urlencode(similo);
                    var reqsimi = urlencode(similo.replace(/ /g,"%20"));
                    const simiu = await fetch(`https://api.simsimi.net/v2/?text=${reqsimi}&lc=id`, { method: "GET" })
                    .then(async res => {
                        const data = await res.json()
                            return data
                        })
                
                    if (jawab === 0) {
                        client.simulateTyping(from, true);
                        await delay(randomms)
                        client.sendText(from, simiu.success+randomemot);
	                } else {
                        client.simulateTyping(from, true);
                        await delay(randomms)
                        client.sendText(from, simiu.success);
	                }
                console.log(color(' [USER]', 'blue'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(pushname), color(`Bertanya:`, 'cyan'), `${similo}\n`,color('[SIMI]', 'blue'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Simi`), color(`Menjawab:`, 'cyan'), `${simiu.success}\n`)
            }
        }
    }
