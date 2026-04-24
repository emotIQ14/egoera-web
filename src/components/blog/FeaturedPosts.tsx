"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Clock, ArrowRight } from "lucide-react";
import { CATEGORIES, type BlogPost } from "@/lib/blog";

interface Props {
  posts: BlogPost[];
}

function colorFor(slug: string): string {
  return CATEGORIES[slug]?.color ?? "#6BA3BE";
}

export function FeaturedPosts({ posts }: Props) {
  if (posts.length === 0) return null;

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Featured post - large */}
      <ScrollReveal>
        <Link
          href={`/blog/${featured.slug}`}
          className="block bg-gradient-to-br from-teal/5 to-mint/10 rounded-2xl p-8 border border-teal/10 card-hover group h-full"
        >
          {featured.category && (
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white mb-4"
              style={{ backgroundColor: colorFor(featured.categorySlug) }}
            >
              {featured.category}
            </span>
          )}
          <h3 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-heading)] text-dark-text mb-4 group-hover:text-teal transition-colors leading-tight">
            {featured.title}
          </h3>
          <p className="text-grey-text leading-relaxed mb-6">
            {featured.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-grey-text">
              <span>{featured.date}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {featured.readTime}
              </span>
            </div>
            <ArrowRight className="w-5 h-5 text-teal group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </ScrollReveal>

      {/* Rest of posts */}
      <div className="space-y-4">
        {rest.map((post, i) => {
          const color = colorFor(post.categorySlug);
          return (
            <ScrollReveal key={post.slug} delay={(i + 1) * 0.1}>
              <Link
                href={`/blog/${post.slug}`}
                className="flex gap-4 p-4 bg-white rounded-xl border border-border card-hover group"
              >
                <div
                  className="w-2 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1 min-w-0">
                  {post.category && (
                    <span
                      className="text-xs font-medium"
                      style={{ color }}
                    >
                      {post.category}
                    </span>
                  )}
                  <h4 className="text-sm font-semibold text-dark-text mt-1 group-hover:text-teal transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-2 text-xs text-grey-text">
                    <span>{post.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
