import { getFeaturedPosts } from "@/lib/blog";
import HomeClient from "./home-client";

export const revalidate = 3600;

export default async function HomePage() {
  const posts = await getFeaturedPosts(6);
  return <HomeClient posts={posts} />;
}
