import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body;
    if (!token) {
      return new Response(JSON.stringify({ error: "The token is required" }), {
        status: 400,
      });
    }
    const verificationToken = await prisma.verificationTokens.findUnique({
      where: { token },
    });
    if (!verificationToken) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 400,
      });
    }

    const subscriber = await prisma.subscribers.findUnique({
      where: { email: verificationToken.email },
    });
    if (!subscriber) {
      return new Response(JSON.stringify({ error: "Subscriber not found" }), {
        status: 400,
      });
    }
    const updatedSubscriber = await prisma.subscribers.update({
      where: { email: subscriber.email },
      data: { status: 1 },
    });
    if (updatedSubscriber) {
      await prisma.verificationTokens.delete({
        where: { token },
      });
    }
    return new Response(
      JSON.stringify({
        message:
          "Subscription confirmed successfully, We're excited to have you on board.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
