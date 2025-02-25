"use client";
import Image from "next/image";
import React from "react";
import { Trash2, FilePenLine } from "lucide-react";
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
import toast from "react-hot-toast";
import { useFetchArticles } from "../../hooks/useFetchArticles";
import { formatDate } from "../../lib/utils"; 
import axios from "axios";

function NewArticles() {
  const { articles, loading, setArticles } = useFetchArticles("all");

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/blog/${id}`);
      setArticles(articles?.filter((article) => article?.id !== id));
      toast.success("Article deleted successfully");
    } catch (error) {
      console.log("error deleting article", error);
    }
  };

  return (
    <>
      {loading ? (
        <p className="text-white text-md mt-5">Loading...</p>
      ) : articles?.length > 0 ? (
        articles.slice(0, 5).map((article: Article) => (
          <div
            key={article.id}
            className="flex items-center mt-5 pb-5 bg-blue-950 px-4 rounded-sm"
          >
            <Link
              href={`/article/${article.slug}`}
              className="flex items-center space-x-2 mt-5"
            >
              <Image
                src={article?.coverImgUrl}
                alt="Picture of the author"
                width={50}
                height={50}
              />
              <p className="text-white font-semibold text-lg md:text-xl line-clamp-1">
                {article.title}
              </p>
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
                      onClick={() => handleDelete(article.id)}
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
        <p className="text-slate-200 text-md mt-5">No articles yet</p>
      )}
    </>
  );
}

export default NewArticles;
