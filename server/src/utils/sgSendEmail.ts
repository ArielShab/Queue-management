import sgMail from '@sendgrid/mail';

// set sendgrid api key
const apiKey: string | undefined = process.env.SENDGRID_API_KEY;
if (!apiKey)
  throw new Error(
    'SENDGRID_API_KEY is not defined in the environment variables.',
  );

sgMail.setApiKey(apiKey);

export const sgSendEmail = (email: string, randomCode: string) => {
  const msg = {
    to: email,
    from: 'aariall73@gmail.com',
    subject: 'Your verification code from Queue Manager',
    html: `<strong>Your verification code from Queue Manager is ${randomCode}.</strong>`,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
};
