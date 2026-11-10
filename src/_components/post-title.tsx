import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export function PostTitle({ children }: Props) {
  return (
    <h1
      className="font-uniSans font-bold text-port-black mb-12 text-center md:text-left leading-[80px]"
      style={{ fontSize: "clamp(42px, 6vw, 70px)" }}
    >
      {children}
    </h1>
  );
}