"use client";

import { useFetchArticles } from "../../hooks/useFetchArticles";
import Image from "next/image";
import React from "react";
import { Trash2, FilePenLine } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { formatDate } from "../../lib/utils";
import axios from "axios";
import { Button } from "../ui/button";

function ArticleList() {
  const { loading, articles, setArticles, setPage } = useFetchArticles("all");
  const handleDelete = async (slug: string) => {
    try {
      await axios.delete(`/api/blog/${slug}`);
      setArticles((prev) => prev.filter((article) => article.slug !== slug));
      toast.success("Article deleted successfully");
    } catch (error) {
      console.log("error deleting article", error);
    }
  };
  return (
    <>
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : articles?.length > 0 ? (
        articles.map((article) => (
          <div
            key={article.slug}
            className="flex items-center border-b border-slate-600 pb-4 hover:bg-blue-900 p-2 rounded"
          >
            <Link
              href={`/article/${article.slug}`}
              className="flex items-center space-x-2 w-3/4"
            >
              <Image
                src={article?.coverImgUrl}
                alt="article cover image"
                width={100}
                height={100}
              />
              <div>
                <p className="text-white font-semibold text-lg md:text-xl line-clamp-1">
                  {article.title}
                </p>
                <p className="text-slate-300 line-clamp-1">
                  {article.description}
                </p>
              </div>
            </Link>
            <div className="flex items-center space-x-4 mt-5 ms-auto">
              <p className="text-slate-200">
                {formatDate(new Date(article?.createdAt))}
              </p>
              <AlertDialog>
                <AlertDialogTrigger>
                  <Trash2 className="text-red-400 hover:text-destructive" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your the article.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive hover:bg-destructive"
                      onClick={() => handleDelete(article.slug)}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Link href="/article/[slug]" as={`/article/${article.slug}`}>
                <FilePenLine className="text-white hover:text-slate-200" />
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p className="text-white">No articles found</p>
      )}
      {!loading && (
        <div className="flex flex-row gap-5">
          <Button className="bg" onClick={() => setPage((prev) => prev + 1)}>Load more</Button>
          <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
            Load less
          </Button>
        </div>
      )}
    </>
  );
}

export default ArticleList;
