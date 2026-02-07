import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
import fs from 'fs'
import moment from 'moment-timezone'
import PhoneNumber from 'awesome-phonenumber'
let handler = async (m, { conn, usedPrefix, args, command, __dirname, participants }) => {
try {
let listaPrincipal = `\`\`\`⧡ menu » all       [0]
⧡ menu » info      [1]
⧡ menu » dls       [2]
⧡ menu » conv      [3]
⧡ menu » search    [4]
⧡ menu » group     [5]
⧡ menu » shop      [6]
⧡ menu » rpg       [7]
⧡ menu » utils     [8]
⧡ menu » stickers  [9]
⧡ menu » logos     [10]
⧡ menu » cc     [11]
⧡ menu » random    [12]
⧡ menu » reac      [13]
⧡ menu » ai        [14]
⧡ menu » editor    [15]
⧡ menu » premium   [16]
⧡ menu » juegos    [17]
⧡ menu » owner     [own]\`\`\``
let menuInfo = `│⧡ *${usedPrefix}ᴀɴᴜɴᴄɪᴏs*
│⧡ *${usedPrefix}ᴘɪɴɢ*
│⧡ *${usedPrefix}ᴘʟᴀɴ*
│⧡ *${usedPrefix}ᴘʀᴇᴍs!*
│⧡ *${usedPrefix}ᴍᴏᴅs!*
│⧡ *${usedPrefix}ᴀᴅᴍɪɴs!*
│⧡ *${usedPrefix}ʀᴜɴ*
│⧡ *${usedPrefix}sᴛᴀᴛ*
│⧡ *${usedPrefix}ɪɴғᴏ*
│⧡ *${usedPrefix}ᴄʀᴇᴀᴅᴏʀ*
│⧡ *${usedPrefix}ᴄᴀɴᴀʟ*
│⧡ *${usedPrefix}ᴅᴏɴᴀʀ*
│⧡ *${usedPrefix}ᴍᴘ*
│⧡ *${usedPrefix}ʙᴋ*
│⧡ *${usedPrefix}ᴘᴀʏ*
│⧡ *${usedPrefix}sᴘᴇᴇᴅ*
│⧡ *${usedPrefix}ʀᴇᴘᴏʀᴛ*
╰────────────────•`
let menuDesc = `│⧡ *${usedPrefix}ᴀᴜᴅɪᴏ*
│⧡ *${usedPrefix}ᴠɪᴅᴇᴏ*
│⧡ *${usedPrefix}ᴘʟᴀʏ*
│⧡ *${usedPrefix}ғᴀᴄᴇʙᴏᴏᴋ*
│⧡ *${usedPrefix}ɪɴsᴛᴀɢʀᴀᴍ*
│⧡ *${usedPrefix}ᴛᴡɪᴛᴛᴇʀ*
│⧡ *${usedPrefix}ᴛɪᴋᴛᴏᴋ*
│⧡ *${usedPrefix}sᴘᴏᴛɪғʏ*
│⧡ *${usedPrefix}ᴍᴇᴅɪᴀғɪʀᴇ*
│⧡ *${usedPrefix}ᴘɪɴᴛᴇʀᴇsᴛ*
│⧡ *${usedPrefix}ɢɪᴛʜᴜʙ*
│⧡ *${usedPrefix}ᴅʀɪᴠᴇ*
│⧡ *${usedPrefix}sʟʏ*
╰────────────────•`
let menuConv = `│⧡ *${usedPrefix}ᴜᴘʟᴏᴀᴅ*
│⧡ *${usedPrefix}ʜᴅ*
│⧡ *${usedPrefix}ᴜᴘᴍғ*
│⧡ *${usedPrefix}ᴛᴜʀʟ*
│⧡ *${usedPrefix}ᴛɪᴍɢ*
│⧡ *${usedPrefix}ᴛᴏɢɪғ*
│⧡ *${usedPrefix}ᴄᴀᴛʙᴏx*
╰────────────────•`
let menuSearch = `│⧡ *${usedPrefix}ɪᴍᴀɢᴇɴ*
│⧡ *${usedPrefix}ғᴅʀᴏɪᴅs*
│⧡ *${usedPrefix}ᴀᴘᴋ*
│⧡ *${usedPrefix}ᴀᴘᴘʟᴇs*
│⧡ *${usedPrefix}ʏᴛs*
│⧡ *${usedPrefix}sʟʏs*
│⧡ *${usedPrefix}ᴘɪɴɪᴍɢ*
│⧡ *${usedPrefix}ᴛᴇɴᴏʀ*
│⧡ *${usedPrefix}sᴘᴏᴛɪғʏs*
│⧡ *${usedPrefix}ɢᴏᴏɢʟᴇ*
╰────────────────•`
let menuGroup = `│⧡ *${usedPrefix}ᴇɴʟᴀᴄᴇ*
│⧡ *${usedPrefix}ʀᴇᴠᴏᴋ*
│⧡ *${usedPrefix}ɪɴᴜᴍ*
│⧡ *${usedPrefix}ᴅɴᴜᴍ*
│⧡ *${usedPrefix}ʟɪɴᴇᴀ*
│⧡ *${usedPrefix}ᴀᴅᴅ*
│⧡ *${usedPrefix}ᴋɪᴄᴋ*
│⧡ *${usedPrefix}ᴀᴅᴍɪɴ+*
│⧡ *${usedPrefix}ᴀᴅᴍɪɴ-*
│⧡ *${usedPrefix}ᴡᴀʀɴ+*
│⧡ *${usedPrefix}ᴡᴀʀɴ-*
│⧡ *${usedPrefix}ᴍᴜᴛᴇ+*
│⧡ *${usedPrefix}ᴍᴜᴛᴇ-*
│⧡ *${usedPrefix}ɢ-ɴᴀᴍᴇ*
│⧡ *${usedPrefix}ɢ-ᴅᴇsᴄ*
│⧡ *${usedPrefix}ɢ-ɪᴍɢ*
│⧡ *${usedPrefix}ᴛᴀɢs*
╰────────────────•`
let menuShop = `│⧡ *${usedPrefix}ᴘʟᴀɴ*
│⧡ *${usedPrefix}ᴘʟᴀɴ 1*
│⧡ *${usedPrefix}ᴘʟᴀɴ 2*
│⧡ *${usedPrefix}ᴘʟᴀɴ 3*
│⧡ *${usedPrefix}ᴘʟᴀɴ 4*
│⧡ *${usedPrefix}ᴘʟᴀɴ sᴛᴀᴛs*
╰────────────────•`
let menuRpg = `│⧡ *${usedPrefix}ᴀᴠᴇɴᴛᴜʀᴀ*
│⧡ *${usedPrefix}ᴍɪɴᴀʀ*
│⧡ *${usedPrefix}ᴘᴇsᴄᴀʀ*
│⧡ *${usedPrefix}ᴄᴏғʀᴇ*
│⧡ *${usedPrefix}ᴄᴜʀᴀʀ*
│⧡ *${usedPrefix}ɴɪᴠᴇʟ*
│⧡ *${usedPrefix}ʀᴇᴠᴇʟᴀʀ*
│⧡ *${usedPrefix}ᴍᴇʀᴄᴀᴅᴇʀ*
│⧡ *${usedPrefix}ᴡᴏʀᴋ*
│⧡ *${usedPrefix}ᴄᴏɪɴs*
│⧡ *${usedPrefix}ʀᴇɢᴀʟᴏ*
│⧡ *${usedPrefix}ᴄᴀᴢᴀʀ*
│⧡ *${usedPrefix}ᴛᴀʟᴀʀ*
│⧡ *${usedPrefix}ʀᴏʙᴀʀ*
│⧡ *${usedPrefix}ᴘɪᴄᴏ*
│⧡ *${usedPrefix}ᴇsᴘᴀᴅᴀ*
│⧡ *${usedPrefix}ʜᴀᴄʜᴀ*
│⧡ *${usedPrefix}ɪɴᴠ*
│⧡ *${usedPrefix}ʀᴘɢ*
│⧡ *${usedPrefix}ᴅᴇᴘ/ᴅᴇᴘ2*
│⧡ *${usedPrefix}ʀᴇᴛ/ʀᴇᴛ2*
│⧡ *${usedPrefix}sʜᴏᴘ*
│⧡ *${usedPrefix}sᴛᴀᴛs*
╰────────────────•`
let menuUtils = `│⧡ *${usedPrefix}ʟɪᴅ*
│⧡ *${usedPrefix}ʟɪᴅs*
│⧡ *${usedPrefix}ᴄɪᴅ*
│⧡ *${usedPrefix}ғᴇᴛᴄʜ*
│⧡ *${usedPrefix}ɢᴇᴛᴘɪᴄ*
│⧡ *${usedPrefix}ᴘᴀɪs*
│⧡ *${usedPrefix}ʜᴡᴇʙ*
╰────────────────•`
let menuStick = `│⧡ *${usedPrefix}ᴇxɪғ-*
│⧡ *${usedPrefix}ᴇxɪғ+*
│⧡ *${usedPrefix}sᴛɪᴄᴋᴇʀ*
│⧡ *${usedPrefix}ᴇᴍᴏᴊɪ*
│⧡ *${usedPrefix}ʙʀᴀᴛ*
│⧡ *${usedPrefix}ǫᴄ*
╰────────────────•`
let menuLogos = `│⧡ *${usedPrefix}ʟᴏɢᴏ1*
│⧡ *${usedPrefix}ʟᴏɢᴏ2*
│⧡ *${usedPrefix}ʟᴏɢᴏ3*
│⧡ *${usedPrefix}ʟᴏɢᴏ4*
│⧡ *${usedPrefix}ʟᴏɢᴏ5*
│⧡ *${usedPrefix}ʟᴏɢᴏ6*
│⧡ *${usedPrefix}ʟᴏɢᴏ7*
│⧡ *${usedPrefix}ʟᴏɢᴏ8*
│⧡ *${usedPrefix}ʟᴏɢᴏ9*
│⧡ *${usedPrefix}ʟᴏɢᴏ10*
│⧡ *${usedPrefix}ʟᴏɢᴏ11*
│⧡ *${usedPrefix}ʟᴏɢᴏ12*
│⧡ *${usedPrefix}ʟᴏɢᴏ13*
│⧡ *${usedPrefix}ʟᴏɢᴏ14*
│⧡ *${usedPrefix}ʟᴏɢᴏ15*
│⧡ *${usedPrefix}ʟᴏɢᴏ16*
│⧡ *${usedPrefix}ʟᴏɢᴏ17*
│⧡ *${usedPrefix}ʟᴏɢᴏ18*
│⧡ *${usedPrefix}ʟᴏɢᴏ19*
│⧡ *${usedPrefix}ʟᴏɢᴏ20*
│⧡ *${usedPrefix}ʟᴏɢᴏ21*
│⧡ *${usedPrefix}ʟᴏɢᴏ22*
│⧡ *${usedPrefix}ʟᴏɢᴏ23*
│⧡ *${usedPrefix}ʟᴏɢᴏ24*
│⧡ *${usedPrefix}ʟᴏɢᴏ25*
│⧡ *${usedPrefix}ʟᴏɢᴏ26*
│⧡ *${usedPrefix}ʟᴏɢᴏ27*
│⧡ *${usedPrefix}ʟᴏɢᴏ28*
│⧡ *${usedPrefix}ʟᴏɢᴏ29*
│⧡ *${usedPrefix}ʟᴏɢᴏ30*
│⧡ *${usedPrefix}ʟᴏɢᴏ31*
│⧡ *${usedPrefix}ʟᴏɢᴏ32*
│⧡ *${usedPrefix}ʟᴏɢᴏ33*
│⧡ *${usedPrefix}ʟᴏɢᴏ34*
│⧡ *${usedPrefix}ʟᴏɢᴏ35*
│⧡ *${usedPrefix}ʟᴏɢᴏ36*
│⧡ *${usedPrefix}ʟᴏɢᴏ37*
╰────────────────•`
let menuColec = `│⧡ *${usedPrefix}ᴄs*
│⧡ *${usedPrefix}ᴄᴘᴀʏ*
│⧡ *${usedPrefix}ᴅɪɴғᴏ*
│⧡ *${usedPrefix}ʙᴀᴛᴛʟᴇ*
│⧡ *${usedPrefix}ᴠᴇɴᴅᴇʀ*
│⧡ *${usedPrefix}ᴄᴏᴍᴘʀᴀʀ*
╰────────────────•`
let menuRandom = `│⧡ *${usedPrefix}ᴡᴀʟʟᴘ*
│⧡ *${usedPrefix}ʀᴅ ᴍᴇssɪ*
│⧡ *${usedPrefix}ʀᴅ ᴄʀ7*
│⧡ *${usedPrefix}ʀᴅ ʙᴛs*
│⧡ *${usedPrefix}ʀᴅ ɴᴀᴠɪᴅᴀᴅ*
│⧡ *${usedPrefix}ʀᴅ ʜᴀʟʟᴏᴡᴇɴ*
│⧡ *${usedPrefix}ʀᴅ ɪᴛᴢʏ*
│⧡ *${usedPrefix}ʀᴅ ᴜɴɪᴠᴇʀsᴏ*
╰────────────────•`
let menuReac = `│⧡ *${usedPrefix}ᴀɴɢʀʏ*
│⧡ *${usedPrefix}ʙᴀᴛʜ*
│⧡ *${usedPrefix}ʙɪᴛᴇ*
│⧡ *${usedPrefix}ʙʟᴇʜ*
│⧡ *${usedPrefix}ʙʟᴜsʜ*
│⧡ *${usedPrefix}ʙᴏᴛᴇᴅ*
│⧡ *${usedPrefix}ᴄʟᴀᴘ*
│⧡ *${usedPrefix}ᴄᴏғғᴇᴇ*
│⧡ *${usedPrefix}ᴄʀʏ*
│⧡ *${usedPrefix}ᴄᴜᴅᴅʟᴇ*
│⧡ *${usedPrefix}ᴅᴀɴᴄᴇ*
│⧡ *${usedPrefix}ᴅʀᴜɴᴋ*
│⧡ *${usedPrefix}ᴇᴀᴛ*
│⧡ *${usedPrefix}ғᴀᴄᴇᴘᴀʟᴍ*
│⧡ *${usedPrefix}ʜᴜɢ*
│⧡ *${usedPrefix}ᴋɪʟʟ*
│⧡ *${usedPrefix}ᴋɪss*
│⧡ *${usedPrefix}ʟᴀᴜɢʜ*
│⧡ *${usedPrefix}ʟɪᴄᴋ*
│⧡ *${usedPrefix}sʟᴀᴘ*
│⧡ *${usedPrefix}sʟᴇᴇᴘ*
│⧡ *${usedPrefix}sᴍᴏᴋᴇ*
│⧡ *${usedPrefix}sᴘɪᴛ*
│⧡ *${usedPrefix}sᴛᴇᴘ*
│⧡ *${usedPrefix}ᴛʜɪɴᴋ*
│⧡ *${usedPrefix}ʟᴏᴠᴇ*
│⧡ *${usedPrefix}ᴘᴀᴛ*
│⧡ *${usedPrefix}ᴘᴏᴋᴇ*
│⧡ *${usedPrefix}ᴘᴏᴜᴛ*
│⧡ *${usedPrefix}ᴘᴜɴᴄʜ*
│⧡ *${usedPrefix}ᴘʀᴇɢ*
│⧡ *${usedPrefix}sᴘʀɪɴᴛ*
│⧡ *${usedPrefix}sᴀᴅ*
│⧡ *${usedPrefix}sᴄᴀʀᴇᴅ*
│⧡ *${usedPrefix}sᴇᴅᴜᴄᴇ*
│⧡ *${usedPrefix}sʜᴜ*
│⧡ *${usedPrefix}ᴡᴀʟᴋ*
│⧡ *${usedPrefix}ᴅʀᴀᴍᴀᴛɪᴄ*
│⧡ *${usedPrefix}ᴋɪssᴄʜᴇᴇᴋ*
│⧡ *${usedPrefix}ᴡɪɴᴋ*
│⧡ *${usedPrefix}ᴄʀɪɴɢᴇ*
│⧡ *${usedPrefix}sᴍᴜɢ*
│⧡ *${usedPrefix}sᴍɪʟᴇ*
│⧡ *${usedPrefix}ᴍᴀɴᴏ*
│⧡ *${usedPrefix}ʙᴜʟʟʏɴɢ*
│⧡ *${usedPrefix}ᴡᴀᴠᴇ*
╰────────────────•`
let menuAi = `│⧡ *${usedPrefix}ᴛᴏʀᴜ*
│⧡ *${usedPrefix}ᴄᴏᴅᴇx*
│⧡ *${usedPrefix}ᴠᴇɴɪᴄᴇ*
│⧡ *${usedPrefix}ɪᴍᴀɢɪɴᴀ*
╰────────────────•`
let menuEdit = `│⧡ *${usedPrefix}ɴᴇᴡ-ɴᴀᴍᴇ*
│⧡ *${usedPrefix}ɴᴇᴡ-ᴅᴇsᴄ*
│⧡ *${usedPrefix}ɴᴇᴡ-ᴄʜ*
│⧡ *${usedPrefix}ɴᴇᴡ-ɢʀᴏᴜᴘ*
│⧡ *${usedPrefix}ɴᴇᴡ-ɪᴄᴏɴ*
│⧡ *${usedPrefix}ɴᴇᴡ-ᴍᴇɴᴜ*
╰────────────────•`
let menuPrem = `│⧡ *${usedPrefix}ᴛᴇᴍʙʟᴏʀ*
│⧡ *${usedPrefix}ʀᴠ*
│⧡ *${usedPrefix}ᴀɪᴠɪᴅ*
│⧡ *${usedPrefix}ᴀɪᴠɪᴅ2*
│⧡ *${usedPrefix}ᴛxᴛɪᴍɢ*
│⧡ *${usedPrefix}ᴇᴅɪᴛᴀɪ*
│⧡ *${usedPrefix}ᴄʟɪᴍᴀ*
╰────────────────•`
let menuJuegos = `│⧡ *${usedPrefix}ᴡɪx*
╰────────────────•`
let menuOption = `│⧡ *${usedPrefix}ᴏɴ/ᴏғғ ᴡᴇʟᴄᴏᴍᴇ*
│⧡ *${usedPrefix}ᴏɴ/ᴏғғ ᴀᴅᴍɪɴs*
│⧡ *${usedPrefix}ᴏɴ/ᴏғғ ᴇɴʟᴀᴄᴇs*
│⧡ *${usedPrefix}ᴏɴ/ᴏғғ ᴇɴʟᴀᴄᴇs2*
│⧡ *${usedPrefix}ᴏɴ/ᴏғғ ɪɴғᴏʀᴍᴀᴄɪᴏɴ*
│⧡ *${usedPrefix}ᴏɴ/ᴏғғ ᴅᴇsᴄᴀʀɢᴀs*
│⧡ *${usedPrefix}ᴏɴ/ᴏғғ ᴊᴜᴇɢᴏs*
│⧡ *${usedPrefix}ᴏɴ/ᴏғғ ʙᴜsᴄᴀᴅᴏʀ*
│⧡ *${usedPrefix}ᴏɴ/ᴏғғ ᴄᴏɴᴠᴇʀᴛɪᴅᴏʀ*
│⧡ *${usedPrefix}ᴏɴ/ᴏғғ sᴛɪᴄᴋᴇʀs*
│⧡ *${usedPrefix}ᴏɴ/ᴏғғ ɢʀᴜᴘᴏs*
│⧡ *${usedPrefix}ᴏɴ/ᴏғғ ʀᴘɢ*
│⧡ *${usedPrefix}ᴏɴ/ᴏғғ ɪᴀ*
│⧡ *${usedPrefix}ᴏɴ/ᴏғғ ᴀᴊᴜsᴛᴇs*
│⧡ *${usedPrefix}ᴏɴ/ᴏғғ ʟᴏɢᴏs*
│⧡ *${usedPrefix}ᴏɴ/ᴏғғ ʀᴇᴀᴄᴛ*
│⧡ *${usedPrefix}ᴏɴ/ᴏғғ ᴀᴜᴅɪᴏs*
│⧡ *${usedPrefix}ᴏɴ/ᴏғғ ᴀᴜᴛᴏsᴛɪᴄᴋᴇʀ*
│⧡ *${usedPrefix}ᴏɴ/ᴏғғ ᴡsᴛɪᴄᴋ*
│⧡ *${usedPrefix}ᴏɴ/ᴏғғ ᴀᴄᴇᴘᴛ*
│⧡ *${usedPrefix}ᴏɴ/ᴏғғ ᴅᴇɴᴇɢ*
│⧡ *${usedPrefix}ᴏɴ/ᴏғғ ᴀʀɢ*
│⧡ *${usedPrefix}ᴏɴ/ᴏғғ ɢʟᴏʙᴀʟ*
╰────────────────•`
let menuOwn = `│⧡ *${usedPrefix}ғɪx*
│⧡ *${usedPrefix}ᴇʀʀ*
│⧡ *${usedPrefix}ғᴜʟʟ!*
│⧡ *${usedPrefix}ʀ*
│⧡ *${usedPrefix}ᴄ*
│⧡ *${usedPrefix}ᴛʀᴜᴇ*
│⧡ *${usedPrefix}ғᴀʟsᴇ*
│⧡ *${usedPrefix}xʙᴏᴛ*
│⧡ *${usedPrefix}++ᴀᴅᴍɪɴ*
│⧡ *${usedPrefix}ᴡx-*
│⧡ *${usedPrefix}ғʀɪᴇɴᴅ*
│⧡ *${usedPrefix}+ᴍᴏᴅ*
│⧡ *${usedPrefix}+ᴀᴅᴍɪɴ*
│⧡ *${usedPrefix}-ᴘʀᴇᴍ*
│⧡ *${usedPrefix}-ᴍᴏᴅ*
│⧡ *${usedPrefix}-ᴀᴅᴍɪɴ*
│⧡ *${usedPrefix}ɢᴘʟᴜɢ*
│⧡ *${usedPrefix}ғɪʟᴇ+*
│⧡ *${usedPrefix}ғɪʟᴇ-*
│⧡ *${usedPrefix}ʙᴀɴ+*
│⧡ *${usedPrefix}ʙᴀɴ-*
│⧡ *${usedPrefix}ʙʟᴏᴄᴋ+*
│⧡ *${usedPrefix}ʙʟᴏᴄᴋ-*
╰────────────────•`

const user = global.db.data.users[m.sender] || {}
const name = await conn.getName(m.sender)
const thumbBot = Buffer.from(await (await fetch(`${global.toruMenu}`)).arrayBuffer())
const thumbBot2 = Buffer.from(await (await fetch(`${global.toruImg}`)).arrayBuffer())
const premium = user.premium ? '✓' : '✘'
const torucoin = user.torucoin || 0
const totalreg = Object.keys(global.db.data.users).length
const groupUserCount = m.isGroup ? participants.length : '-'
const groupsCount = Object.values(conn.chats).filter(v => v.id.endsWith('@g.us')).length
const uptime = clockString(process.uptime() * 1000)
const dFormato = new Date(new Date + 3600000)
const fecha = new Date(Date.now())
const locale = 'es-AR'
const dia = fecha.toLocaleDateString(locale, { weekday: 'long' })
const fechaTxt = fecha.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
const hora = `${moment.tz('America/Buenos_Aires').format('HH:mm:ss')}`
const totalCommands = Object.keys(global.plugins).length
const userId = m.sender.split('@')[0]
const phone = PhoneNumber('+' + userId)
const pais = phone.getRegionCode() || 'Desconocido'
const perfil = await conn.profilePictureUrl(conn.user.jid, 'image').catch(() => `${ifoto}`)

await m.react("📍")
if (!args[0]) {
let menu = `> ${hora}, ${dia} ${fechaTxt}

〝👋🏻  Bot automático via *(WhatsApp/Business)*, puede obtener información/datos o otras ventajas para proporcionar un uso util para todo usuario.〞

⧨ ᴍᴏᴅᴇ : *Privado*
🜲 ᴜsᴜᴀʀɪᴏ : @${name}
＃ ᴘʀᴇғɪx : *(/ ! # - .)*
✦ ᴠᴇʀsɪᴏɴ : *${vs}*
⎋ ᴜʀʟ : ${botweb}
${readMore}
\t〩 \`Categorias:\`
${listaPrincipal}

\t⚶ Por ejemplo:
*#menu info*`
return conn.sendMessage(m.chat, { text: menu, contextInfo: { forwardingScore: 1, isForwarded: false, externalAdReply: { showAdAttribution: false, renderLargerThumbnail: false, title: botname, body: textbot, containsAutoReply: true, mediaType: 1, thumbnailUrl: global.toruImg, sourceUrl: botweb }}}, { quoted: m })
} else if (args[0] === 'info' || args[0] === '1') {
let categoInfo = `> ${hora}, ${dia} ${fechaTxt}

⧨ ᴍᴏᴅᴇ : *Privado*
🜲 ᴜsᴜᴀʀɪᴏ : @${name}
＃ ᴘʀᴇғɪx : *(/ ! # - .)*
✦ ᴠᴇʀsɪᴏɴ : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Informacion\`
${menuInfo}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoInfo, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'dls' || args[0] === '2') {
let categoDesc = `> ${hora}, ${dia} ${fechaTxt}

⧨ ᴍᴏᴅᴇ : *Privado*
🜲 ᴜsᴜᴀʀɪᴏ : @${name}
＃ ᴘʀᴇғɪx : *(/ ! # - .)*
✦ ᴠᴇʀsɪᴏɴ : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Descargadores\`
${menuDesc}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoDesc, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'conv' || args[0] === '3') {
let categoConv = `> ${hora}, ${dia} ${fechaTxt}

⧨ ᴍᴏᴅᴇ : *Privado*
🜲 ᴜsᴜᴀʀɪᴏ : @${name}
＃ ᴘʀᴇғɪx : *(/ ! # - .)*
✦ ᴠᴇʀsɪᴏɴ : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Convertidor\`
${menuConv}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoConv, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'search' || args[0] === '4') {
let categoSearch = `> ${hora}, ${dia} ${fechaTxt}

⧨ ᴍᴏᴅᴇ : *Privado*
🜲 ᴜsᴜᴀʀɪᴏ : @${name}
＃ ᴘʀᴇғɪx : *(/ ! # - .)*
✦ ᴠᴇʀsɪᴏɴ : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Buscador\`
${menuSearch}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoSearch, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'group' || args[0] === '5') {
let categoGroup = `> ${hora}, ${dia} ${fechaTxt}

⧨ ᴍᴏᴅᴇ : *Privado*
🜲 ᴜsᴜᴀʀɪᴏ : @${name}
＃ ᴘʀᴇғɪx : *(/ ! # - .)*
✦ ᴠᴇʀsɪᴏɴ : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Grupos\`
${menuGroup}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoGroup, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'shop' || args[0] === '6') {
let categoShop = `> ${hora}, ${dia} ${fechaTxt}

⧨ ᴍᴏᴅᴇ : *Privado*
🜲 ᴜsᴜᴀʀɪᴏ : @${name}
＃ ᴘʀᴇғɪx : *(/ ! # - .)*
✦ ᴠᴇʀsɪᴏɴ : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Beneficios\`
${menuShop}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoShop, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'rpg' || args[0] === '7') {
let categoRpg = `> ${hora}, ${dia} ${fechaTxt}

⧨ ᴍᴏᴅᴇ : *Privado*
🜲 ᴜsᴜᴀʀɪᴏ : @${name}
＃ ᴘʀᴇғɪx : *(/ ! # - .)*
✦ ᴠᴇʀsɪᴏɴ : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Juegos RPG\`
${menuRpg}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoRpg, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'utils' || args[0] === '8') {
let categoUtils = `> ${hora}, ${dia} ${fechaTxt}

⧨ ᴍᴏᴅᴇ : *Privado*
🜲 ᴜsᴜᴀʀɪᴏ : @${name}
＃ ᴘʀᴇғɪx : *(/ ! # - .)*
✦ ᴠᴇʀsɪᴏɴ : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Ajustes\`
${menuUtils}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoUtils, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'stickers' || args[0] === '9') {
let categoStick = `> ${hora}, ${dia} ${fechaTxt}

⧨ ᴍᴏᴅᴇ : *Privado*
🜲 ᴜsᴜᴀʀɪᴏ : @${name}
＃ ᴘʀᴇғɪx : *(/ ! # - .)*
✦ ᴠᴇʀsɪᴏɴ : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Stickers\`
${menuStick}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoStick, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'logos' || args[0] === '10') {
let categoLogos = `> ${hora}, ${dia} ${fechaTxt}

⧨ ᴍᴏᴅᴇ : *Privado*
🜲 ᴜsᴜᴀʀɪᴏ : @${name}
＃ ᴘʀᴇғɪx : *(/ ! # - .)*
✦ ᴠᴇʀsɪᴏɴ : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Logos\`
${menuLogos}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoLogos, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'cc' || args[0] === '11') {
let categoCol = `> ${hora}, ${dia} ${fechaTxt}

⧨ ᴍᴏᴅᴇ : *Privado*
🜲 ᴜsᴜᴀʀɪᴏ : @${name}
＃ ᴘʀᴇғɪx : *(/ ! # - .)*
✦ ᴠᴇʀsɪᴏɴ : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Coleccion\`
${menuColec}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoCol, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'random' || args[0] === '12') {
let categoRandom = `> ${hora}, ${dia} ${fechaTxt}

⧨ ᴍᴏᴅᴇ : *Privado*
🜲 ᴜsᴜᴀʀɪᴏ : @${name}
＃ ᴘʀᴇғɪx : *(/ ! # - .)*
✦ ᴠᴇʀsɪᴏɴ : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Random\`
${menuRandom}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoRandom, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'reac' || args[0] === '13') {
let categoReac = `> ${hora}, ${dia} ${fechaTxt}

⧨ ᴍᴏᴅᴇ : *Privado*
🜲 ᴜsᴜᴀʀɪᴏ : @${name}
＃ ᴘʀᴇғɪx : *(/ ! # - .)*
✦ ᴠᴇʀsɪᴏɴ : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Reaccion\`
${menuReac}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoReac, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'ai' || args[0] === '14') {
let categoAi = `> ${hora}, ${dia} ${fechaTxt}

⧨ ᴍᴏᴅᴇ : *Privado*
🜲 ᴜsᴜᴀʀɪᴏ : @${name}
＃ ᴘʀᴇғɪx : *(/ ! # - .)*
✦ ᴠᴇʀsɪᴏɴ : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Inteligencia\`
${menuAi}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoAi, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'editor' || args[0] === '15') {
let categoEdit = `> ${hora}, ${dia} ${fechaTxt}

⧨ ᴍᴏᴅᴇ : *Privado*
🜲 ᴜsᴜᴀʀɪᴏ : @${name}
＃ ᴘʀᴇғɪx : *(/ ! # - .)*
✦ ᴠᴇʀsɪᴏɴ : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Editor\`
${menuEdit}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoEdit, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'premium' || args[0] === '16') {
let categoPrem = `> ${hora}, ${dia} ${fechaTxt}

⧨ ᴍᴏᴅᴇ : *Privado*
🜲 ᴜsᴜᴀʀɪᴏ : @${name}
＃ ᴘʀᴇғɪx : *(/ ! # - .)*
✦ ᴠᴇʀsɪᴏɴ : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Premium\`
${menuPrem}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoPrem, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'juegos' || args[0] === '17') {
let categoPrem = `> ${hora}, ${dia} ${fechaTxt}

⧨ ᴍᴏᴅᴇ : *Privado*
🜲 ᴜsᴜᴀʀɪᴏ : @${name}
＃ ᴘʀᴇғɪx : *(/ ! # - .)*
✦ ᴠᴇʀsɪᴏɴ : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Premium\`
${menuPrem}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoPrem, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === "options" || args[0] === "enable") {
let categoOption = `> ${hora}, ${dia} ${fechaTxt}

⧨ ᴍᴏᴅᴇ : *Privado*
🜲 ᴜsᴜᴀʀɪᴏ : @${name}
＃ ᴘʀᴇғɪx : *(/ ! # - .)*
✦ ᴠᴇʀsɪᴏɴ : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Gestion\`
${menuOption}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoOption, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'owner' || args[0] === 'own') {
let categoOwn = `> ${hora}, ${dia} ${fechaTxt}

⧨ ᴍᴏᴅᴇ : *Privado*
🜲 ᴜsᴜᴀʀɪᴏ : @${name}
＃ ᴘʀᴇғɪx : *(/ ! # - .)*
✦ ᴠᴇʀsɪᴏɴ : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Propietario\`
${menuOwn}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoOwn, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'all' || args[0] === '0') {
let categoAll = `> ${hora}, ${dia} ${fechaTxt}

〝👋🏻  Bot automático via *(WhatsApp/Business)*, puede obtener información/datos o otras ventajas para proporcionar un uso util para todo usuario.〞

⧨ ᴍᴏᴅᴇ : *Privado*
🜲 ᴜsᴜᴀʀɪᴏ : @${name}
＃ ᴘʀᴇғɪx : *(/ ! # - .)*
✦ ᴠᴇʀsɪᴏɴ : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Informacion\`
${menuInfo}


╭•[ 𔒝 ] ⧿ \`Descargas\`
${menuDesc}


╭•[ 𔒝 ] ⧿ \`Convertidor\`
${menuConv}


╭•[ 𔒝 ] ⧿ \`Buscador\`
${menuSearch}


╭•[ 𔒝 ] ⧿ \`Grupos\`
${menuGroup}


╭•[ 𔒝 ] ⧿ \`Tienda\`
${menuShop}


╭•[ 𔒝 ] ⧿ \`Juegos RPG\`
${menuRpg}


╭•[ 𔒝 ] ⧿ \`Ajustes\`
${menuUtils}


╭•[ 𔒝 ] ⧿ \`Stickers\`
${menuStick}


╭•[ 𔒝 ] ⧿ \`Logos\`
${menuLogos}


╭•[ 𔒝 ] ⧿ \`Coleccion\`
${menuColec}


╭•[ 𔒝 ] ⧿ \`Random\`
${menuRandom}


╭•[ 𔒝 ] ⧿ \`Reaccion\`
${menuReac}


╭•[ 𔒝 ] ⧿ \`Inteligencia\`
${menuAi}


╭•[ 𔒝 ] ⧿ \`Editor\`
${menuEdit}


╭•[ 𔒝 ] ⧿ \`Premium\`
${menuPrem}


╭•[ 𔒝 ] ⧿ \`Juegos\`
${menuJuegos}


╭•[ 𔒝 ] ⧿ \`Gestion\`
${menuOption}


╭•[ 𔒝 ] ⧿ \`Propietario\`
${menuOwn}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoAll, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else {
let pruebaXd = `📍  El menu *( ${args[0]} )* no existe.\n- Use *${usedPrefix + command}* para ver las categorías.`
return conn.sendMessage(m.chat, { text: pruebaXd }, { quoted: m })
 } 
} catch (e) {
console.error(e)
await conn.sendMessage(m.chat, { text: `${e.message}` }, { quoted: m })
}
}

handler.command = ['menu', 'help', 'menú']

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

 function clockString(ms) {
const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
  }
