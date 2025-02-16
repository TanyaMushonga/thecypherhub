import { validateRequest } from "@/auth";
import prisma from "../../../../lib/prisma";

export async function GET(req: Request) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return new Response(JSON.stringify({ message: "ID is required" }), {
        status: 400,
      });
    }

    const subscriber = await prisma.subscribers.findUnique({
      where: { id: id },
    });

    if (!subscriber) {
      return new Response(JSON.stringify({ message: "subscriber not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(subscriber), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching subscriber:", error);
    return new Response(
      JSON.stringify({ message: "error", error: (error as Error).message }),
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return new Response(JSON.stringify({ message: "ID is required" }), {
        status: 400,
      });
    }

    const subscriber = await prisma.subscribers.findUnique({
      where: { id: id },
    });

    if (!subscriber) {
      return new Response(JSON.stringify({ message: "subscriber not found" }), {
        status: 404,
      });
    }

    const updatedData = await req.json();

    const updatedsubscriber = await prisma.subscribers.update({
      where: { id: id },
      data: updatedData,
    });

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paths: ["/api/subscribers"],
      }),
    });

    return new Response(JSON.stringify(updatedsubscriber), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching subscriber:", error);
    return new Response(
      JSON.stringify({ message: "error", error: (error as Error).message }),
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return new Response(JSON.stringify({ message: "ID is required" }), {
        status: 400,
      });
    }

    const subscriber = await prisma.subscribers.findUnique({
      where: { id: id },
    });
    if (!subscriber) {
      return new Response(JSON.stringify({ message: "subscriber not found" }), {
        status: 404,
      });
    }
    await prisma.subscribers.delete({
      where: { id: id },
    });

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paths: ["/api/subscribers"],
      }),
    });

    return new Response(
      JSON.stringify({ message: "subscriber deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleteing subscriber", error);
    return new Response(
      JSON.stringify({ message: "error", error: (error as Error).message }),
      {
        status: 500,
      }
    );
  }
}
