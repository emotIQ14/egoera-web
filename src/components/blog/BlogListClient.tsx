"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Clock, Search } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import type { BlogPost, CategoryInfo } from "@/lib/blog";

interface Props {
  posts: BlogPost[];
  categories: CategoryInfo[];
}

export function BlogListClient({ posts, categories }: Props) {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") ?? "";
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [search, setSearch] = useState("");

  const filtered = posts.filter((post) => {
    const matchesCat = !activeCategory || post.categorySlug === activeCategory;
    const matchesSearch =
      !search ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-text" />
          <input
            type="text"
            placeholder="Buscar articulos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal/50"
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("")}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
              !activeCategory
                ? "bg-teal text-white"
                : "bg-muted text-grey-text hover:bg-teal/10 hover:text-teal"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(activeCategory === cat.slug ? "" : cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat.slug
                  ? "text-white"
                  : "bg-muted text-grey-text hover:text-dark-text"
              }`}
              style={
                activeCategory === cat.slug
                  ? { backgroundColor: cat.color }
                  : undefined
              }
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Posts grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <ScrollReveal key={post.slug} delay={i * 0.05}>
              <Link
                href={`/blog/${post.slug}`}
                className="block bg-white rounded-2xl border border-border overflow-hidden card-hover group"
              >
                {/* Color bar */}
                <div
                  className="h-1.5"
                  style={{
                    backgroundColor:
                      categories.find((c) => c.slug === post.categorySlug)?.color ?? "#6BA3BE",
                  }}
                />
                <div className="p-6">
                  <span
                    className="text-xs font-medium"
                    style={{
                      color:
                        categories.find((c) => c.slug === post.categorySlug)?.color ?? "#6BA3BE",
                    }}
                  >
                    {post.category}
                  </span>
                  <h3 className="text-lg font-semibold text-dark-text mt-2 mb-3 group-hover:text-teal transition-colors line-clamp-2 font-[family-name:var(--font-heading)]">
                    {post.title}
                  </h3>
                  <p className="text-sm text-grey-text line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-grey-text">
                    <span>{post.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-grey-text text-lg">
            No se encontraron articulos. Prueba con otra busqueda o categoria.
          </p>
        </div>
      )}
    </>
  );
}
