import moment from "moment";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { sendMail } from "email-module";

export default class Logger {

    constructor() {
        if (Logger.__privateInstance) {
            throw new Error("CAN NOT CREATE A NEW INSTANCE OF LOGGER. USE Logger.getInstance()");
        }
        this.fileName = moment().format('DD_MM_YYYY');
        this.loggerHash = crypto.createHash('md5').update(this.fileName).digest("hex");
        this.register(`INTEGRATION START WITH HASH ${this.loggerHash}`);
    }

    static __privateInstance;

    /**
     *
     * @return {Logger}
     */
    static getInstance() {
        if (!Logger.__privateInstance) {
            Logger.__privateInstance = new Logger("");
        }
        return Logger.__privateInstance;
    }

    lines = [];

    /**
     *
     * @param {String} line
     * @return {Logger}
     */
    register(line) {
        const _line = `[${moment().format('DD/MM/YYYY H:mm:ss')}]:\n${line}\n\n`;
        if ((/error/ig).test(_line))
            console.error(_line.split('\n').slice(0, 2).join(' '));
        else
            console.log(_line.split('\n').slice(0, 2).join(' '));
        this.lines.push(_line);
        return this;
    }

    /**
     *
     * @param {String} line
     * @return {Logger}
     */
    flush(line) {
        this.register(line).register(`INTEGRATION DONE ${this.loggerHash}`).writeToFile();
        this.lines = [];
        return this;
    }

    /**
     *
     * @return {*|string|*}
     */
    get file() {
        return path.join(__dirname, '.log', `${this.loggerHash}.${this.fileName}.txt`);
    }

    /**
     *
     * @return {Logger}
     */
    writeToFile() {
        if (!fs.existsSync(path.join(__dirname, '.log'))) {
            fs.mkdirSync(path.join(__dirname, '.log'), 0o777);
        }
        if (!fs.existsSync(this.file)) {
            fs.createWriteStream(this.file).write('');
        }
        fs.writeFileSync(this.file, this.lines.join('\n'));
        return this;
    }

    /**
     *
     * @return {Promise<string>}
     */
    async sendMail() {
        try {
            const result = await sendMail({
                "port": 8086,
                "host": "192.168.0.250",
                secure: false, // true for 465, false for other ports
            }, {
                from: 'Sender Name <sender@example.com>',
                to: 'Recipient <recipient@example.com>',
                subject: 'Nodemailer is unicode friendly ✔',
                text: 'Hello to myself!',
                html: '<p><b>Hello</b> to myself!</p>'
            });
            console.log("WILL SEND TO MAIL", this.file);
            return "DONE";
        } catch (e) {
            console.log("ERROR TO SEND MAIL", e);
            throw e;

        }
    }
}