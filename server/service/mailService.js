const nodemailer = require('nodemailer')

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER, // generated ethereal user
                pass: process.env.SMTP_PASSWORD, // generated ethereal password
            },
        })
    }

    async sendActivationMail(to, link) {

        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: `Account activation for ${process.env.API_URL}.`,
            html:`
                <div>
                    <h1>To activate your email folow the link: <h1>
                    <a href="${link}">${link}</a>
                </div>
            `
        })
     }
}

module.exports = new MailService();