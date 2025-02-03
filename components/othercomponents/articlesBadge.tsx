"use client";
import { useFetchArticles } from "../../hooks/useFetchArticles";
import { Loader2 } from "lucide-react";
import React from "react";

function ArticlesBadge() {
  const { loading, articles } = useFetchArticles("all");
  return (
    <>
      {loading ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        <p className="text-slate-200">{articles.length}</p>
      )}
    </>
  );
}

export default ArticlesBadge;
