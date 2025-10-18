import { Suspense } from "react";
import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { PLAYLIST_BY_SLUG_QUERY, STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import markdownit from "markdown-it";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import React from "react";

const md = markdownit();
export const experimental_ppr = true;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });

  // ✅ safer pattern
  const playlist = await client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "editor-pick" });
  const editorPosts = playlist?.select || [];

  if (!post) return notFound();

  const parseContent = md.render(post?.pitch || "");

  return (
    <div>
      {/* Hero Section */}
      <section className="pink_container !min-h-[180px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      {/* Main Section */}
      <section className="section_container !lg-flex">
        <img
          src={post.image}
          alt="thumb"
          className="w-[800px] h-100 rounded-xl"
        />

        <div className="space-y-5 mt-10 max-w-3xl mx-auto">
          <div className="flex-between gap-4">
            <Link href={`/user/${post.author?._id}`} className="flex gap-2 mb-3">
              <Image
                src={post.author.image}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />
              <div>
                <p className="text-20-medium">{post.author.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{post.author.username}
                </p>
              </div>
            </Link>
            <p className="category-tag">{post.category}</p>
          </div>

          <h3 className="text-30-bold">Pitch Details</h3>
          {parseContent ? (
            <article
              className="prose max-w-4xl font-work-sans break-all"
              dangerouslySetInnerHTML={{ __html: parseContent }}
            />
          ) : (
            <p className="no-result">No Details Provided</p>
          )}
        </div>

        <hr className="divider" />

        {/* Editor’s Picks */}
        {editorPosts.length > 0 && (
          <div className="max-w-4xl">
            <p className="text-30-semibold">Editor’s Picks</p>
            <ul className="mt-7 card_grid-sm">
              {editorPosts.map((post: StartupTypeCard, i: number) => (
                <StartupCard key={i} post={post} />
              ))}
            </ul>
          </div>
        )}

        {/* Views Component (Suspense for async) */}
        <Suspense fallback={<Skeleton />}>
          <View id={id} />
        </Suspense>
      </section>
    </div>
  );
};

export default Page;
