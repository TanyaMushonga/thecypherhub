import ArticleList from "../../../components/othercomponents/articleList";
import React from "react";
import { ScrollArea } from "../../../components/ui/scroll-area";

export default async function Page() {

  return (
    <main className="p-5 md:p-10 h-[90vh] w-full bg-primary">
      <div className="w-full md:w-2/3 h-full">
        <h1 className="text-white font-semibold text-lg md:text-2xl mb-5">
          Published articles
        </h1>
        <ScrollArea className="h-5/6 w-full">
          <ArticleList  />
        </ScrollArea>
      </div>
    </main>
  );
}
