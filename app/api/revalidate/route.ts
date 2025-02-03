import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const { paths } = await req.json();

    if (!paths || !Array.isArray(paths)) {
      return new Response(JSON.stringify({ message: "Invalid paths" }), {
        status: 400,
      });
    }

    for (const path of paths) {
      revalidatePath(path);
    }

    return new Response(JSON.stringify({ revalidated: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in revalidate blog:", error);
    return new Response(
      JSON.stringify({ message: "error", error: (error as Error).message }),
      {
        status: 500,
      }
    );
  }
}
