import sgMail, { type MailDataRequired } from "@sendgrid/mail";
import { env } from "~/env";

sgMail.setApiKey(env.SENDGRID_API_KEY);

export enum EmailSender {
  AUTHENTICATION = "Hot-Takes.io Authentication <authentication@hot-takes.io>",
  NO_REPLY = "no-reply@hot-takes.io",
  SUPPORT = "support@hot-takes.io",
  CONTACT = "contact@hot-takes.io",
  MARKETING = "marketing@hot-takes.io",
  NOTIFICATIONS = "Hot-Takes.io Notifications <notifications@hot-takes.io>",
}

export enum EmailTemplate {
  GENERAL = "d-ac069b8e4da74b879e5dcc98812f6412",
}

export enum EmailGroupID {
  NEW_COMMENT = 25578,
  MENTION = 25579,
  NONE = 0,
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
  emailGroupId,
}: {
  sender: EmailSender;
  recipient: string;
  template: EmailTemplate;
  data: EmailDynamicData;
  emailGroupId: EmailGroupID;
}) => {
  const msg: MailDataRequired = {
    from: sender,
    to: recipient,
    templateId: template,
    asm: {
      groupId: emailGroupId,
      groupsToDisplay: [EmailGroupID.MENTION, EmailGroupID.NEW_COMMENT],
    },
    dynamicTemplateData: {
      ...data,
    },
  };

  if (emailGroupId === EmailGroupID.NONE) {
    delete msg.asm;
  }

  await sgMail.send(msg).catch((error: { response: { body: unknown } }) => {
    console.error(error.response.body as string);
  });
};

export default sendEmail;
