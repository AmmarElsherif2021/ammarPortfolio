// app/page.tsx
import Container from "@/_components/container";
import Header from "@/_components/header";
import { Intro } from "@/_components/intro";
import { MoreStories } from "@/_components/more-stories";
import ProjectCard from "@/_components/project-card";
import { mockArticles, mockProjects } from "@/lib/mockData";

export default async function Index() {
  return (
    <main>
      <Header />
      <Container>
        <Intro />

        {/* ARTICLES SECTION */}
        {mockArticles.length > 0 && (
          <section className="mt-16">
            <h2 className="retro-section-title mb-6">Articles</h2>
            <MoreStories posts={mockArticles} />
          </section>
        )}

        {/* PROJECTS SECTION */}
        <section className="mt-20">
          <h2 className="retro-section-title mb-6">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}