import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useArticle } from "../../store";

export const useFetchArticles = (value: string) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const setBlogs = useArticle((state) => state.setBlog);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/blog", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response.data.filter((article: Article) => {
        if (value === "all") {
          return article;
        }
        return article.category === value;
      });
      setArticles(data);
      setBlogs(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [setBlogs, value]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return { articles, loading, refetch: fetchArticles, setArticles };
};
