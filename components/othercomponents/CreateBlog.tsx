"use client";
import React, { useState, useRef, useEffect } from "react";
import Tiptap from "./Tiptap";
import toast from "react-hot-toast";
import { Image as ImageIcon } from "lucide-react";
import { readAndCompressImage } from "browser-image-resizer";

type blogContent = {
  title: string;
  description: string;
  category: string;
  content: string;
};

const CreateBlog = () => {
  const [content, setContent] = useState<blogContent>({
    title: "",
    description: "",
    category: "",
    content: "",
  });
  const [blogCover, setBlogCover] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clearEditor, setClearEditor] = useState(false);

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedContent = localStorage.getItem("blogContent");
    const savedBlogCover = localStorage.getItem("blogCover");

    if (savedContent) {
      setContent(JSON.parse(savedContent));
    }

    if (savedBlogCover) {
      const byteString = atob(savedBlogCover.split(",")[1]);
      const mimeString = savedBlogCover
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], "coverImage", { type: mimeString });
      setBlogCover(file);
    }
  }, []);

  useEffect(() => {
    const saveContent = () => {
      localStorage.setItem("blogContent", JSON.stringify(content));
      if (blogCover) {
        const reader = new FileReader();
        reader.onloadend = () => {
          localStorage.setItem("blogCover", reader.result as string);
        };
        reader.readAsDataURL(blogCover);
      } else {
        localStorage.removeItem("blogCover");
      }
    };
    window.addEventListener("beforeunload", saveContent);
    return () => {
      window.removeEventListener("beforeunload", saveContent);
    };
  }, [content, blogCover]);

  const handleContentChange = (newContent: string) => {
    setContent((prev) => ({ ...prev, content: newContent }));
  };

  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width === 1920 && img.height === 1080) {
          resolve(true);
        } else {
          resolve(false);
        }
      };
      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !content.title ||
      !content.description ||
      !content.category ||
      !content.content ||
      !blogCover
    ) {
      setError("Please fill all the fields");
      return;
    }

    const isValidImage = await validateImageDimensions(blogCover);
    if (!isValidImage) {
      setError("The blog cover must be 1920x1080 pixels");
      return;
    }

    setLoading(true);
    setError("");
    let coverImgBase64 = "";
    if (blogCover) {
      const resizedImage = await readAndCompressImage(blogCover, {
        quality: 0.7,
        maxWidth: 1920,
        maxHeight: 1080,
        debug: true,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        coverImgBase64 = reader.result as string;
        submitBlog(coverImgBase64);
      };
      reader.readAsDataURL(resizedImage);
    } else {
      submitBlog(coverImgBase64);
    }
  };

  const submitBlog = async (coverImgBase64: string) => {
    const payload = {
      title: content.title,
      description: content.description,
      category: content.category,
      content: content.content,
      coverImgUrl: coverImgBase64,
    };

    const response = await fetch("/api/add-blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setError("Error creating blog");
      setLoading(false);
      throw new Error(await response.text());
    } else {
      toast.success("Blog created successfully");
      setLoading(false);
      setContent({
        title: "",
        description: "",
        category: "",
        content: "",
      });
      setClearEditor(true);
      setBlogCover(undefined);
      localStorage.removeItem("blogContent");
      localStorage.removeItem("blogCover");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full grid place-items-center mx-auto"
    >
      <div className="w-full flex flex-row gap-20 justify-center">
        <div className="w-1/2">
          <Tiptap
            immediatelyRender={false}
            content={content.content}
            onChange={(newContent: string) => handleContentChange(newContent)}
            clearEditor={clearEditor}
          />
        </div>
        <div>
          <div className="flex flex-row gap-3">
            <div className="flex flex-col w-full mb-4">
              <label htmlFor="title" className="text-sky-300">
                Title
              </label>
              <input
                type="text"
                id="title"
                className="w-full border border-sky-300 rounded-md px-2 py-1"
                value={content.title}
                onChange={(e) =>
                  setContent((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col w-full mb-4">
              <label htmlFor="tags" className="text-sky-300">
                Category
              </label>
              <select
                id="tags"
                className="w-full border border-sky-300 rounded-md px-2 py-1"
                value={content.category}
                onChange={(e) =>
                  setContent((prev) => ({ ...prev, category: e.target.value }))
                }
              >
                <option value="" disabled>
                  Select a category
                </option>
                <option value="system-design">System Design</option>
                <option value="devops">DevOps</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="mobile-development">Others</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col w-full mb-4">
            <label htmlFor="description" className="text-sky-300">
              Description
            </label>
            <textarea
              id="description"
              className="w-full border border-sky-300 rounded-md px-2 py-1"
              value={content.description}
              onChange={(e) =>
                setContent((prev) => ({ ...prev, description: e.target.value }))
              }
            ></textarea>
          </div>
          <div className="flex flex-col w-full mb-4">
            <label htmlFor="blog_cover" className="text-sky-300 cursor-pointer">
              <ImageIcon className="w-10 h-10" />
            </label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setBlogCover(e.target.files?.[0])}
              ref={ref}
              id="blog_cover"
            />
          </div>
          {loading && (
            <p className="text-green-500 text-2xl font-semibold">
              Uploading your blog
            </p>
          )}
          {error && (
            <p className="text-red-500 text-2xl font-semibold">{error}</p>
          )}
        </div>
      </div>
    </form>
  );
};

export default CreateBlog;
