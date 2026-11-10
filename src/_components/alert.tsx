import Container from "@/_components/container";
import { EXAMPLE_PATH } from "@/lib/constants";
import cn from "classnames";

type Props = {
  preview?: boolean;
};

const Alert = ({ preview }: Props) => {
  return (
    <div className="w-full px-5 py-2">
      <Container>
        <div
          className={cn(
            "retro-alert",
            preview ? "retro-alert-preview" : "retro-alert-default"
          )}
        >
          <span
            className={cn(
              "retro-alert-dot",
              preview ? "bg-retro-red animate-blink" : "bg-retro-orange"
            )}
          />
          <span className="font-mono text-retro-xs font-bold uppercase tracking-wider">
            {preview ? (
              <>
                ⚠ PREVIEW MODE —{" "}
                <a
                  href="/api/exit-preview"
                  className="underline underline-offset-2 hover:text-retro-teal transition-colors"
                >
                  EXIT PREVIEW
                </a>
              </>
            ) : (
              <>
                SOURCE CODE AVAILABLE ON{" "}
                <a
                  href={`https://github.com/vercel/next.js/tree/canary/examples/${EXAMPLE_PATH}`}
                  className="underline underline-offset-2 hover:text-retro-teal transition-colors"
                >
                  GITHUB →
                </a>
              </>
            )}
          </span>
          <span className="ml-auto retro-badge">
            {preview ? "DRAFT" : "LIVE"}
          </span>
        </div>
      </Container>
    </div>
  );
};

export default Alert;