import Container from "@/_components/container";
import { HeroPost } from "@/_components/hero-post";
import { Intro } from "@/_components/intro";
import { MoreStories } from "@/_components/more-stories";
import { Article } from "@/interfaces/Article";
import { fetchArticles } from "@/lib/api";

export default function Index() {
  // const allPosts: any = fetchArticles();

  // const heroPost = allPosts.length > 0 ? allPosts[0] : null;

  // const morePosts = allPosts.slice(1);

  return (
    <main>
      <Container>
        <Intro />
        {/* <HeroPost
          title={heroPost?.title}
          coverImage={heroPost?.coverImage}
          date={heroPost?.date}
          author={heroPost?.author}
          slug={heroPost?.slug}
          excerpt={heroPost?.excerpt}
        />
        {morePosts.length > 0 && <MoreStories posts={morePosts} />} */}
        Here should be posts....
      </Container>
    </main>
  );
}
