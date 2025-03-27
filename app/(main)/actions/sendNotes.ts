"use server";

import { sendEmailToMyself } from "@/lib/emails";

export const sendEmailToMyselfAction = async (htmlContent: string) => {
  const emailSend = await sendEmailToMyself(htmlContent);

  if (emailSend) {
    return { success: "Email sent successfully" };
  } else {
    return { error: "Error sending email" };
  }
};
