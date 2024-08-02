import React from "react";
import { delay, motion } from "framer-motion";
import "./Aside.css";
const Aside = ({ toggleNav }) => {
  const items = ["Shop by Category", "Shop by Device", "Collections", "Blog"];

  const navList = {
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.07,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        delayChildren: 0,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const navItem = {
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        x: { stiffness: 100, velocity: 1500 },
        delay: 0,
      },
    },
    hidden: {
      x: "-120%",
      opacity: 0,
      transition: {
        x: { stiffness: 100, velocity: 100 },
      },
    },
  };

  return (
    <div className="aside">
      <svg
        onClick={toggleNav}
        fill="#000000"
        width="24px"
        height="24px"
        viewBox="0 0 32 32"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#000000"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <title>cancel2</title>{" "}
          <path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path>{" "}
        </g>
      </svg>
      <motion.ul
        className="navList"
        initial="hidden"
        animate="visible"
        exit="visible"
        variants={navList}
      >
        {items.map((item) => (
          <motion.li
            className="nav-item albert-sans-titlefont text-left mx-4 my-8 "
            variants={navItem}
            animate={{
              animationDelay: 0,
              animationDuration: 0.3,
            }}
            key={item}
          >
            <p className="text-left">{item}</p>
            <button className="text-right">+</button>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default Aside;
