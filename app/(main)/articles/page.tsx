import ArticleList from "../../../components/othercomponents/articleList";
import React from "react";
import { ScrollArea } from "../../../components/ui/scroll-area";

async function fetchArticles() {
  const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/blog", {
    cache: "no-store", // Ensure fresh data on each request
  });
  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }
  return res.json();
}

export default async function Page() {
  const articles = await fetchArticles();

  return (
    <main className="p-5 md:p-10 h-[90vh] w-full bg-primary">
      <div className="w-full md:w-2/3 h-full">
        <h1 className="text-white font-semibold text-lg md:text-2xl mb-5">
          Published articles
        </h1>
        <ScrollArea className="h-5/6 w-full">
          <ArticleList articles={articles} />
        </ScrollArea>
      </div>
    </main>
  );
}
