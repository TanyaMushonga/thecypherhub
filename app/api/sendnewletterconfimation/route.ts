import { sendConfirmationEmailAfterSubscribe } from "@/lib/emails";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const subscribers = await prisma.subscribers.findMany({
      where: {
        status: 0,
      },
    });

    for (const subscriber of subscribers) {
      const email = subscriber.email;
      const token = Math.random().toString(36).substring(2, 15);

      const tokenExist = await prisma.verificationTokens.findUnique({
        where: { token },
      });
      const emailExistInToken = await prisma.verificationTokens.findUnique({
        where: { email },
      });

      if (tokenExist || emailExistInToken) {
        console.log(`Token or email already exists for ${email}`);
        continue;
      }

      const verificationToken = await prisma.verificationTokens.create({
        data: {
          token,
          email,
        },
      });

      if (verificationToken) {
        // Send confirmation email
        await sendConfirmationEmailAfterSubscribe(email, token);
      }
    }

    return new Response(
      JSON.stringify({ message: "Confirmation emails sent successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
