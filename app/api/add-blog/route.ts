import prisma from "../../../lib/prisma";
import { calculateReadTime } from "../../../lib/utils";
import { validateRequest } from "@/auth";

export async function POST(req: Request) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const { title, description, category, coverImgUrl, content } =
      await req.json();

    const readTime: string = calculateReadTime(content!);

    const data = {
      title,
      description,
      category,
      coverImgUrl,
      content,
      readTime: readTime,
      authorId: loggedInUser.id,
    };

    await prisma.articles.create({
      data,
    });

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paths: ["/api/blog"],
      }),
    });

    return new Response(
      JSON.stringify({ message: "Blog created successfully" }),
      {
        status: 201,
      }
    );
  } catch (error: unknown) {
    console.error("Error saving blog:", error);
    return new Response(JSON.stringify({ message: "error", error: error }), {
      status: 500,
    });
  }
}
