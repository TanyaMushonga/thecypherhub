declare interface Article {
  id: string;
  coverImgUrl: string;
  title: string;
  description: string;
  category: string;
  content: string;
  readTime: string;
  tags: string[];
  createdAt: string;
  updateAt: string;
}

declare interface Subscribers {
  id: string;
  email: string;
  status: 1 | 0;
  createdAt: string;
}

declare interface ArticleStore {
  blog: Article[];
  setBlog: (blog: Article[]) => void;
}
