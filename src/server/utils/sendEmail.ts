import sgMail, { type MailDataRequired } from "@sendgrid/mail";
import { env } from "~/env";

sgMail.setApiKey(env.SENDGRID_API_KEY);

export enum EmailSender {
  NO_REPLY = "no-reply@hot-takes.io",
  SUPPORT = "support@hot-takes.io",
  CONTACT = "contact@hot-takes.io",
  MARKETING = "marketing@hot-takes.io",
  NOTIFICATIONS = "notifications@hot-takes.io",
}

export enum EmailTemplate {
  GENERAL = "ac069b8e4da74b879e5dcc98812f6412",
}

interface EmailDynamicData {
  Button_Body: string;
  Button_URL: string;
  Email_Subject: string;
  Email_Preheader: string;
  Email_Title?: string;
  Email_Salutation?: string;
  Email_Body: string;
  Email_Signature?: string;
}

const sendEmail = async ({
  sender,
  recipient,
  template,
  data,
}: {
  sender: EmailSender;
  recipient: string;
  template: EmailTemplate;
  data: EmailDynamicData;
}) => {
  const msg: MailDataRequired = {
    from: sender,
    to: recipient,
    templateId: template,
    dynamicTemplateData: {
      ...data,
    },
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
  }
};

export default sendEmail;
