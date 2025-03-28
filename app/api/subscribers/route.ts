import { validateRequest } from "@/auth";
import prisma from "../../../lib/prisma";
import { sendConfirmationEmailAfterSubscribe } from "@/lib/emails";

export async function GET() {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const subscribers = await prisma.subscribers.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return new Response(JSON.stringify(subscribers), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving blog:", error);
    return new Response(
      JSON.stringify({ message: "error", error: (error as Error).message }),
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;
    if (!email) {
      return new Response(JSON.stringify({ error: "The email is required" }), {
        status: 400,
      });
    }

    const emailExist = await prisma.subscribers.findUnique({
      where: { email },
    });

    if (emailExist) {
      const isSubscribed = emailExist.status === 1;
      if (isSubscribed) {
        return new Response(
          JSON.stringify({
            message: "You are already subscribed to our newsletter.",
          }),
          { status: 200 }
        );
      } else {
        await prisma.subscribers.update({
          where: { email },
          data: { status: 1 },
        });
        const token = Math.random().toString(36).substring(2, 15);

        const tokenExist = await prisma.verificationTokens.findUnique({
          where: { token },
        });
        const emailExistInToken = await prisma.verificationTokens.findUnique({
          where: { email },
        });

        if (tokenExist || emailExistInToken)
          return new Response(
            JSON.stringify({
              error: "Something went wrong! Please try again later.",
            }),
            { status: 400 }
          );

        const verificationToken = await prisma.verificationTokens.create({
          data: {
            token,
            email,
          },
        });

        if (verificationToken) {
          //send confirmation email
          await sendConfirmationEmailAfterSubscribe(email, token);
        }

        return new Response(
          JSON.stringify({
            message:
              "Thank you for subscribing to our newsletter, please check you inbox to confirm your subscription!.",
          }),
          { status: 200 }
        );
      }
    }
    const data = {
      email,
    };

    await prisma.subscribers.create({
      data,
    });

    //generate token
    const token = Math.random().toString(36).substring(2, 15);

    const tokenExist = await prisma.verificationTokens.findUnique({
      where: { token },
    });
    const emailExistInToken = await prisma.verificationTokens.findUnique({
      where: { email },
    });

    if (tokenExist || emailExistInToken)
      return new Response(
        JSON.stringify({
          message: "Something went wrong! Please try again later.",
        }),
        { status: 400 }
      );

    const verificationToken = await prisma.verificationTokens.create({
      data: {
        token,
        email,
      },
    });

    if (verificationToken) {
      //send confirmation email
      await sendConfirmationEmailAfterSubscribe(email, token);
    }

    return new Response(
      JSON.stringify({
        message:
          "Thank you for subscribing to our newsletter, please check you inbox to confirm your subscription!. You might need to check your spam folder if you don't see the email in your inbox.",
      }),
      { status: 201 }
    );
  } catch (error) {
    console.log("internal server error", error);
    return new Response(JSON.stringify({ error: "internal server error" }));
  }
}
