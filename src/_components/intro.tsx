"use client";
import { CMS_NAME } from "@/lib/constants";
import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { BabylonSceneHandle } from "./babylonScene";

const BabylonScene = dynamic(() => import("@/_components/babylonScene"), {
  ssr: false,
});

export function Intro() {
  const fullText = [
    "Software engineer with prior mechanical engineering experience.",
    "Passionate about digital twin engineering, modeling and simulation and other cool stuff.",
    "Building vibrant web experiences with variant stacks.",
  ];
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const sceneRef = useRef<BabylonSceneHandle | null>(null);
  const [actionIndex, setActionIndex] = useState(0);

  // Typewriter effect (unchanged)
  useEffect(() => {
    const handleTyping = () => {
      const currentLine = fullText[index];
      if (isDeleting) {
        setDisplayText(currentLine.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
        if (charIndex === 0) {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % fullText.length);
        }
      } else {
        setDisplayText(currentLine.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
        if (charIndex === currentLine.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      }
    };
    const timer = setTimeout(handleTyping, isDeleting ? 50 : 100);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, index]);

  const handleActionTrigger = () => {
    const actionId = `action${actionIndex}`;
    sceneRef.current?.triggerAction(actionId);
    setActionIndex((prev) => (prev === 0 ? 1 : 0));
  };

  return (
    <section
      className="relative w-screen h-screen overflow-hidden bg-transparent"
      onWheel={handleActionTrigger}
    >
      {/* 
        Full‑screen 3D scene 
        - absolute fill
        - behind the text (z‑0 by default)
      */}
      <div className="absolute inset-0">
        <BabylonScene ref={sceneRef} />
      </div>

      {/* 
        Overlay content – sits on top, allows scrolling if needed 
        
      */}
      <div className="relative z-10 w-[2vw] h-full flex items-center justify-start pt-[15vh] px-6 md:px-12 lg:px-20 ">
        <div className="max-w-2xl text-port-black ">
          {/* Main heading */}

          <h1 className="text-4xl font-bold leading-snug line-clamp-3 md:text-5xl lg:text-6xl xl:text-8xl xl:leading-[1.1]">
            <span className="inline-block bg-yellow-300 px-2 py-1 font-martianMono font-bold">
              {" "}
              Design,
            </span>
            <br />
            <span className="inline-block bg-yellow-300 px-2 py-1 font-martianMono font-bold">
              {" "}
              Develop
            </span>
            <br />
            <span className="inline-block bg-yellow-300 px-2 py-1 font-martianMono font-bold">
              {" "}
              &amp; Twin
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-sm mt-4 font-martianMono font-bold ">
            I create user friendly, interesting and creative digital products.
          </p>

          {/* Typewriter */}
          <div className="min-h-[84px] mt-2 font-martianMono font-semi-condensed-bold">
            <p className="port-body1 text-port-dark">
              {displayText}
              <span className="inline-block w-[2px] h-5 bg-port-black ml-1 animate-blink" />
            </p>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-6 pt-2">
            <button className="port-btn font-bold">Get in touch</button>
            <div className="flex items-center gap-3">
              <span className="port-more">More</span>
              <span
                className="inline-block border-t border-port-black"
                style={{ width: 30 }}
              />
            </div>
          </div>

          {/* Contacts */}
          <div className="flex flex-col gap-1 pt-4 border-t border-port-dark/20 mt-4">
            <span className="port-label uppercase">Contacts</span>
            <a href="mailto:designer@gmail.com" className="port-link">
              designer@gmail.com
            </a>
            <a href="/cv.pdf" className="port-link">
              Download CV
            </a>
          </div>

          {/* Powered by */}
          <p className="port-body2 opacity-60 mt-4">
            Powered by{" "}
            <a href="https://nextjs.org/" className="port-link text-sm">
              Next.js
            </a>{" "}
            and {CMS_NAME}
          </p>
        </div>
      </div>

      {/* 
        Action button – also overlaid, fixed position on the scene
        (could also be placed inside the text container, but we put it bottom‑left)
      */}
      <button
        className="retro-btn fixed bottom-8 left-8 z-20 color-blue"
        onClick={handleActionTrigger}
        onWheel={handleActionTrigger}
      >
        action {actionIndex + 1}
      </button>

      {/* 
        (Optional) decorative frame/corners – removed because scene is full‑screen.
        If you still want them, you can add them as absolute positioned elements 
        with higher z‑index, but they would sit on top of the scene.
      */}
    </section>
  );
}
