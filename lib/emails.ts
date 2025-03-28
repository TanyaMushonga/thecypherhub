import NoteEmail from "@/emails/note";
import { Resend } from "resend";
import { extractNameFromEmail } from "./utils";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendConfirmationEmailAfterSubscribe = async (
  email: string,
  token: string
) => {
  const confirmationLink = `https://www.thecypherhub.tech/new-verification?token=${token}`;
  try {
    const { data, error } = await resend.emails.send({
      from: "TanyaMushonga@thecypherhub.tech",
      to: email,
      subject: `Hi ${extractNameFromEmail(email)}, confirm your subscription to The Cypher Hub!`,
      html: `
        <table
          align="center"
          width="600"
          cellpadding="0"
          cellspacing="0"
          style="
            border: 1px solid #ddd;
            border-radius: 10px;
            background-color: #f9f9f9;
            padding: 20px;
            font-family: Arial, sans-serif;
            color: #333;
          "
        >
          <tr>
            <td align="center">
              <img
                src="https://www.thecypherhub.tech/fallback.webp"
                alt="The CypherHub Logo"
                style="max-width: 150px; margin-bottom: 20px"
              />
            </td>
          </tr>
          <tr>
            <td align="center">
              <h2 style="color: #333; text-align: center; font-size: 24px;">
                Hi ${extractNameFromEmail(email)},
              </h2>
              <p style="font-size: 16px; line-height: 1.5; color: #555;">
                Thank you for subscribing to The Cypher Hub! We're excited to have you on board.
              </p>
              <p style="font-size: 16px; line-height: 1.5; color: #555;">
                Please confirm your subscription by clicking the button below:
              </p>
              <a
                href="${confirmationLink}"
                style="
                  display: inline-block;
                  padding: 10px 20px;
                  color: #fff;
                  background-color: #007bff;
                  text-decoration: none;
                  border-radius: 5px;
                  font-size: 16px;
                "
              >
                Confirm Subscription
              </a>
              <p style="font-size: 14px; line-height: 1.5; color: #777; margin-top: 20px;">
                If you did not subscribe to our newsletter, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="font-size: 12px; color: #777;">
                You're receiving this email because you subscribed to The Cypher Hub.
                If you no longer wish to receive these emails, you can
                <a
                  href="https://www.thecypherhub.tech/unsubscribe"
                  style="color: #007bff; text-decoration: underline;"
                >
                  unsubscribe here
                </a>.
              </p>
              <p style="font-size: 12px; color: #777;">
                <strong>The Cypher Hub</strong>, Bulawayo, Zimbabwe
              </p>
            </td>
          </tr>
        </table>
      `,
    });

    if (error) {
      console.error("Error sending confirmation email:", error);
      throw new Error("Error sending confirmation email");
    }

    return data;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw new Error("Error sending confirmation email");
  }
};

export const sendEmailToMyself = async (
  htmlContent: string,
  subject: string
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "TanyaMushonga@thecypherhub.tech",
      to: "tanyaradzwatmushonga@gmail.com",
      subject: `${subject}`,
      react: NoteEmail({ htmlContent }),
    });

    if (error) {
      console.error("Error sending confirmation email:", error);
      throw new Error("Error sending confirmation email");
    }

    return data;
  } catch (error) {
    console.error("Error sending email to myself:", error);
    throw new Error("Error sending email to myself");
  }
};

export const sendEmailToSubscribers = async (
  htmlContent: string,
  subject: string,
  email: string
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "TanyaMushonga@thecypherhub.tech",
      to: `${email}`,
      subject: `${subject}`,
      react: NoteEmail({ htmlContent, email }),
    });

    if (error) {
      console.error("Error sending confirmation email:", error);
      throw new Error("Error sending confirmation email");
    }

    return data;
  } catch (error) {
    console.error("Error sending email to myself:", error);
    throw new Error("Error sending email to myself");
  }
};
