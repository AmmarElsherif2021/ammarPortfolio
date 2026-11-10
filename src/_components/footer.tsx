import Container from "@/_components/container";
import { EXAMPLE_PATH } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 px-5 py-8 bg-retro-cream border-t-2 border-retro-ink">
      <Container>
        <div className="checker-bg p-2 rounded-retro comic-border shadow-comic">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-retro-paper comic-border rounded-retro shadow-comic">
            {/* Left side */}
            <div className="bg-retro-deep p-6 rounded-retro comic-border shadow-comic flex flex-col gap-3">
              <p className="font-mono text-retro-xs font-bold uppercase tracking-wider text-retro-teal">
                ● BUILT WITH
              </p>
              <p className="font-display text-retro-2xl font-black uppercase text-retro-cream leading-tight">
                Statically Generated<br />with Next.js
              </p>
              <div className="checker-bg h-3 w-full rounded-retro border-2 border-retro-ink" />
            </div>

            {/* Right side */}
            <div className="bg-retro-paper p-6 rounded-retro comic-border shadow-comic flex flex-col items-end gap-3">
              <a
                href="https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates"
                className="retro-btn bg-retro-ink text-retro-gold hover:opacity-80"
              >
                Read Docs →
              </a>
              <a
                href={`https://github.com/vercel/next.js/tree/canary/examples/${EXAMPLE_PATH}`}
                className="retro-btn bg-retro-gold text-retro-ink hover:opacity-80"
              >
                View on GitHub ↗
              </a>
              <p className="font-mono text-retro-xs uppercase tracking-wider opacity-40 mt-2">
                ☻ Made with Next.js
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-retro-xs font-mono uppercase tracking-wider">
          <p>© {new Date().getFullYear()} Portfolio. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:opacity-70 transition-opacity">LinkedIn</a>
            <a href="#" className="hover:opacity-70 transition-opacity">Behance</a>
            <a href="#" className="hover:opacity-70 transition-opacity">Dribbble</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;