const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const sendInvitationEmail = async (emails, event) => {
    const logoPath = path.resolve(__dirname, "../../public/logo.png");

    const mailPromises = emails.map(email => {
        const mailOptions = {
            from: "DILG Calendar Event Scheduling",
            to: email,
            subject: `Invitation to the Event: ${event.eventName}`,
            html: `
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f2f2f2;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 10px;
              border-bottom: 2px solid #ccc;
            }
            .header img {
              width: 100px;
            }
            .header h2 {
              margin: 0;
              color: #333;
            }
            .content {
              margin-top: 20px;
            }
            .content p {
              margin: 5px 0;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
              font-size: 12px;
              color: #777;
            }
          </style>
        </head>
        <body>
         <div class="container">
            <div class="header">
              <img src="cid:logo" alt="DILG Logo">
              <h2>Republic of the Philippines<br>Department of the Interior and Local Government</h2>
            </div>
            <div class="content">
              <p><strong>${
                  event.createdBy
              }</strong> <span style="float:right;">${
                  event.createdAt
              }</span></p>
              <p><strong>Event No.</strong> ${event.eventId}</p>
              <p><strong>TO:</strong> ${event.invitedEmails}</p>
              <p><strong>SUBJECT:</strong> ${event.eventName}, ${
                  event.eventDate
              } - ${event.eventDateEnd} ${event.eventSchedStart} to ${
                  event.eventSchedEnd
              }</p>
              <hr>
              <p>${event.description}</p>
              ${
                  event.meetingLink
                      ? `<a href="${event.meetingLink}">Click here for the meeting link!</a>`
                      : ""
              }
            </div>
          </div>
        </body>
        </html>
      `,
            attachments: [
                {
                    filename: "logo.png",
                    path: logoPath,
                    cid: "logo"
                }
            ]
        };
        return transporter.sendMail(mailOptions);
    });

    try {
        await Promise.all(mailPromises);
        console.log("Invitation emails sent successfully.");
    } catch (error) {
        console.error("Error sending invitation emails:", error);
        throw error;
    }
};

const sendInterruptionEmail = async (emails, event) => {
    const logoPath = path.resolve(__dirname, "../../public/logo.png");

    const mailPromises = emails.map(email => {
        const mailOptions = {
            from: "DILG Calendar Event Scheduling",
            to: email,
            subject: `Notification for the cancelled/postponed Event: ${event.eventName}`,
            html: `
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f2f2f2;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 10px;
              border-bottom: 2px solid #ccc;
            }
            .header img {
              width: 100px;
            }
            .header h2 {
              margin: 0;
              color: #333;
            }
            .content {
              margin-top: 20px;
            }
            .content p {
              margin: 5px 0;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
              font-size: 12px;
              color: #777;
            }
            .eventStatus {
              background-color: #e0f7fa;
              padding: 15px;
              border-left: 6px solid #00796b;
              margin-bottom: 20px;
              border-radius: 4px;
            }
            .eventStatus h2 {
              margin: 0;
              font-size: 18px;
              color: #00796b;
            }
            .eventStatus h3 {
              margin: 5px 0 0 0;
              font-size: 16px;
              color: #004d40;
            }
          </style>
        </head>
        <body>
          <div class="eventStatus">
            <h2>Status: ${event.approvedEventStatus}</h2>
            <h3>Reason: ${event.reasonPostponedCancelled}</h3>
          </div>
          <div class="container">
            <div class="header">
              <img src="cid:logo" alt="DILG Logo">
              <h2>Republic of the Philippines<br>Department of the Interior and Local Government</h2>
            </div>
            <div class="content">
              <p><strong>${
                  event.createdBy
              }</strong> <span style="float:right;">${
                  event.createdAt
              }</span></p>
              <p><strong>Event No.</strong> ${event.eventId}</p>
              <p><strong>TO:</strong> ${event.invitedEmails}</p>
              <p><strong>SUBJECT:</strong> ${event.eventName}, ${
                  event.eventDate
              } - ${event.eventDateEnd} ${event.eventSchedStart} to ${
                  event.eventSchedEnd
              }</p>
              <hr>
              <p>${event.description}</p>
              ${
                  event.meetingLink
                      ? `<a href="${event.meetingLink}">Click here for the meeting link!</a>`
                      : ""
              }
            </div>
          </div>
        </body>
        </html>

      `,
            attachments: [
                {
                    filename: "logo.png",
                    path: logoPath,
                    cid: "logo"
                }
            ]
        };
        return transporter.sendMail(mailOptions);
    });

    try {
        await Promise.all(mailPromises);
        console.log("Invitation emails sent successfully.");
    } catch (error) {
        console.error("Error sending invitation emails:", error);
        throw error;
    }
};

module.exports = { sendInvitationEmail, sendInterruptionEmail };
