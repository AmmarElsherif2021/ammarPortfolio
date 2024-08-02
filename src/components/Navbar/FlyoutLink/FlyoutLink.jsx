/*
FlyoutLink component contains the motion of the dropdown collapse and 
  motion of the underline of each link, all info displayed in the dropdown are retrieved by dropdown component.
  Nav --> FlyoutLink --->linkname ---> dropDownData.json
*/

import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import Dropdown from "../Dropdown/Dropdown";

const FlyoutLink = ({ children, href, FlyoutContent, linkName }) => {
  const [open, setOpen] = useState(false);

  const showFlyout = FlyoutContent && open;

  return (
    <div
      //Mouse hover event on link and on drop down
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative w-auto h-auto"
      style={{
        display: "inline",
      }}
    >
      <a href={href} className="relative text-white">
        {children}
      </a>
      {/*Underline hover animation */}
      <AnimatePresence>
        {showFlyout && (
          <motion.div
            initial={{
              position: "absolute",
              opacity: 1,
              left: "-50%",

              scaleX: 0,
            }}
            animate={{
              position: "absolute",
              opacity: 1,
              left: 0,

              scaleX: 1,
            }}
            exit={{
              position: "absolute",
              opacity: 1,
              right: 0,
              translateX: "50%",
              scaleX: 0,
            }}
            style={{ width: "100%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute left-0 top-3 w-[90%] text-black pl-2"
          >
            <div
              style={{
                minHeight: "1px",
                background: "white",
              }}
            ></div>
          </motion.div>
        )}
      </AnimatePresence>
      {/*Dropdown content hover animation */}

      {linkName ? (
        <AnimatePresence>
          {showFlyout && (
            <motion.div
              style={{
                position: "fixed",
                top: "12vh",
                height: "auto",
                left: 0,
                width: "100%",
                zIndex: "-1000",
              }}
              transition={{ delay: 0.1, duration: 0.2, ease: "easeInOut" }}
              className="absolute left-0 top-3  text-black"
              initial={{ opacity: 0, scaleY: 1, y: 0 }}
              animate={{ opacity: 1, scaleY: 1, y: 0 }}
              exit={{ opacity: 0, scaleY: 1, y: 0, transitionDuration: 0.7 }}
            >
              <Dropdown linkName={linkName} />
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <div></div>
      )}
    </div>
  );
};
export default FlyoutLink;
