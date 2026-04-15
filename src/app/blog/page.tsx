import { Suspense } from "react";
import { getAllPosts, CATEGORIES } from "@/lib/blog";
import { BlogListClient } from "@/components/blog/BlogListClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog de Psicologia",
  description:
    "Articulos de psicologia sobre regulacion emocional, relaciones, autoconocimiento, limites, desmitificacion y psicologia cotidiana. Contenido accesible y basado en ciencia.",
  openGraph: {
    title: "Blog de Psicologia | Egoera",
    description:
      "Psicologia accesible para entenderte mejor. Articulos sobre emociones, relaciones, habitos y bienestar.",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-teal text-sm font-semibold uppercase tracking-widest">
            Blog
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-heading)] text-dark-text mt-3">
            Articulos de Psicologia
          </h1>
          <p className="text-grey-text mt-4 max-w-2xl mx-auto text-lg">
            Contenido accesible y basado en ciencia para entenderte mejor, gestionar tus
            emociones y mejorar tus relaciones.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-10 text-grey-text">Cargando articulos...</div>}>
          <BlogListClient
            posts={posts}
            categories={Object.values(CATEGORIES)}
          />
        </Suspense>
      </div>
    </div>
  );
}
