import { CMS_NAME } from "@/lib/constants";

export function Intro() {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
        Ammar101.
      </h1>
      <p className="text-center md:text-left text-lg mt-5 md:pl-8">
        Former mechanical engineer turned app developer, with a passion for digital creativity and amateur artistry.{" "}
      </p>
      <small className="text-center md:text-left mt-5">
        Powered by{" "}
        <a
          href="https://nextjs.org/"
          className="underline hover:text-blue-600 duration-200 transition-colors"
        >
          Next.js
        </a>{" "}
        and {CMS_NAME}.
      </small>
    </section>
  );
}
