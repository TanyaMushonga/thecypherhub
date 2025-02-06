import prisma from "../../../../lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return new Response(JSON.stringify({ message: "ID is required" }), {
        status: 400,
      });
    }

    const blog = await prisma.articles.findUnique({
      where: { id: id },
    });

    if (!blog) {
      return new Response(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(blog), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
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
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const updatedData = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ message: "ID is required" }), {
        status: 400,
      });
    }

    const blog = await prisma.articles.findUnique({
      where: { id: id },
    });

    if (!blog) {
      return new Response(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }

    const updatedBlog = await prisma.articles.update({
      where: { id: id },
      data: updatedData,
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

    return new Response(JSON.stringify(updatedBlog), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
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
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return new Response(JSON.stringify({ message: "ID is required" }), {
        status: 400,
      });
    }

    const blog = await prisma.articles.findUnique({
      where: { id: id },
    });
    if (!blog) {
      return new Response(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }
    await prisma.articles.delete({
      where: { id: id },
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
      JSON.stringify({ message: "Blog deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting blog:", error);
    return new Response(
      JSON.stringify({ message: "error", error: (error as Error).message }),
      {
        status: 500,
      }
    );
  }
}
