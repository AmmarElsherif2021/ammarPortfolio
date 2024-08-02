import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";
import Bubble from "../Bubble/Bubble";

const Strip = (props) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh]  w-[90vw]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-4">
          {props.libsList.map((x, index) => (
            <Bubble key={index} img={x.img} stat={x.stat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
export default Strip;
