import { getFeaturedPosts } from "@/lib/blog";
import { EgoeraNav } from "@/components/egoera/EgoeraNav";
import { EgoeraFooter } from "@/components/egoera/EgoeraFooter";
import HomeClient from "./home-client";

export const revalidate = 3600;

/**
 * HomePage — server component que envuelve <HomeClient> (use client) con
 * el nav y footer compartidos. EgoeraNav es async (lee locale + dict),
 * por eso no puede importarse desde HomeClient. Aquí, en el server, sí.
 */
export default async function HomePage() {
  const posts = await getFeaturedPosts(6);
  return (
    <>
      <EgoeraNav active="home" />
      <HomeClient posts={posts} />
      <EgoeraFooter />
    </>
  );
}
