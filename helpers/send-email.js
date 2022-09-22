const nodemailer = require('nodemailer')

const sendEmail = async (email, name) => {
    var transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    //Enviar Email

    const info = await transporter.sendMail({
        from: 'ALKEMY CHALLENGE - Juan Becerra',
        to: email,
        subject: `Bienvenido ${name}`,
        text: 'Gracias por Registrarte',
        html:`
            <p>Hola ${name}, te acabas de registrar en: ALKEMY CHALLENGE - Juan Becerra.</p>
        `
    })
    // console.log("Mensaje enviado %s", info.messageId)
};
module.exports = sendEmail