import prisma from "../../../lib/prisma";

export async function GET(request: Request) {
  try {
    // Parse query parameters for pagination
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "5", 10);

    // Calculate skip and take values
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Fetch the blogs with pagination
    const blogs = await prisma.articles.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
    });

    // Get the total count for pagination
    const totalCount = await prisma.articles.count();

    // Return the paginated result with metadata
    return new Response(
      JSON.stringify({
        blogs,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
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
