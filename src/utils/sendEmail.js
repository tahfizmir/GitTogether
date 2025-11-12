const {SendEmailCommand} = require("@aws-sdk/client-ses");
const sesClient=require("./sesClient.js")

const createSendEmailCommand = (toAddress, fromAddress,subject,text,html) => {
  return new SendEmailCommand({
    Destination: {
     
      CcAddresses: [
      ],
      ToAddresses: [
        toAddress,
        
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `${html}`,
        },
        Text: {
          Charset: "UTF-8",
          Data: `${text}`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
        
    ],
  });
};

const run = async (emailData) => {
    const {subject,text,html}=emailData;
  const sendEmailCommand = createSendEmailCommand(
    "tahfeezmir27@gmail.com",
    "tahfiz@gittogether.site",
    subject,text,html
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
     console.log(caught.message);
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };