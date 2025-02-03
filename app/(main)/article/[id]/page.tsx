import UpdateBlog from "../../../../components/othercomponents/updateBlog";
import React from "react";
// import { notFound } from "next/navigation";

// async function getPost(id: string) {
//   const res = await fetch(`api/blog/${id}`, {
//     cache: "force-cache",
//   });
//   const post: Article = await res.json();
//   if (!post) notFound();
//   return post;
// }

// export async function generateStaticParams() {
//   const posts = await fetch("api/blog", {
//     cache: "force-cache",
//   }).then((res) => res.json());

//   return posts.map((post: Article) => ({
//     id: String(post.id),
//   }));
// }

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;
//   const post = await getPost(id);

//   return {
//     title: post.title,
//   };
// }

export default async function Page() {
  return (
    <main className="bg-primary h-[90vh] w-full pt-5">
      <div>
        <UpdateBlog />
      </div>
    </main>
  );
}
