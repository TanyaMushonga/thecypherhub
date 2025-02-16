import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useArticle } from "../store";

const articleCache: { [key: string]: Article[] } = {};

export const useFetchArticles = (value: string) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const setBlogs = useArticle((state) => state.setBlog);

  const fetchArticles = useCallback(async () => {
    const cacheKey = `${page}-${pageSize}-${value}`;
    if (articleCache[cacheKey]) {
      setArticles(articleCache[cacheKey]);
      setBlogs(articleCache[cacheKey]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `/api/blog?page=${page}&page_size=${pageSize}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data.blogs.filter((article: Article) => {
        if (value === "all") {
          return article;
        }
        return article.category === value;
      });
      setTotalCount(response.data.pagination.totalCount);
      setArticles(data);
      setBlogs(data);
      articleCache[cacheKey] = data;
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, setBlogs, value]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return {
    articles,
    loading,
    refetch: fetchArticles,
    setArticles,
    setPage,
    setPageSize,
    totalCount,
  };
};