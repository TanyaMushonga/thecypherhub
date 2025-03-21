import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendConfirmationEmailAfterSubscribe = async (
  email: string,
  token: string
) => {
  const confirmationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/newsubscription?token=${token}`;
  try {
    const { data, error } = await resend.emails.send({
      from: "newsletter@thecypherhub.tech", // Update with your registered domain
      to: email,
      subject: "Thank you for subscribing to our newsletter!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Thank you for subscribing to our newsletter!</h2>
          <p>We're excited to have you on board. Please confirm your subscription by clicking the link below:</p>
          <a href="${confirmationLink}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Confirm Subscription</a>
          <p>If you did not subscribe to our newsletter, please ignore this email.</p>
          <p>Best regards,<br>The CypherHub Team</p>
        </div>
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
