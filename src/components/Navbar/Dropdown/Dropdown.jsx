import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./Dropdown.css";
import dropDowndata from "../../../ui-data/dropDownData.json";
/*
All info displayed in the dropdown are retrieved by dropdown component from dropDownData.json.
  Nav --> FlyoutLink --->linkname ---> dropDownData.json
Note: To modify the content just edit dropDownData.json file
*/
const Dropdown = ({ linkName }) => {
  const [isOpen, setIsOpen] = useState(false);
  let dropInfo = dropDowndata.find((x) => x.linkname === linkName);
  if (!dropInfo) {
    return <div></div>;
  }
  let contentColumns = dropInfo.data;
  const LIST_ITEM_VARIANTS = {
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
        staggerChildren: 0.05,
        staggerDirection: 1,
      },
    },
  };

  return (
    <div className={`dropdown-font collapsible ${isOpen ? "open" : ""}`}>
      <AnimatePresence>
        <ul className="dropdown-font content">
          {contentColumns &&
            contentColumns.map((x, idx) => (
              <motion.li
                className="dropdown-font mx-[5vw] content-column"
                initial={{ opacity: 1, y: "100%" }}
                animate={{ opacity: 1, y: "0%" }}
                transition={{
                  delay: 0.1 * idx,
                  duration: 0.2,
                }}
                key={idx} // Use a unique key
              >
                {x.photo && (
                  <img
                    src={x.photo}
                    alt={x.header}
                    style={{ background: "black" }}
                    className="mb-5"
                  />
                )}
                <strong
                  className={
                    x.list && x.list.length
                      ? "text-left ml-0"
                      : "text-center ml-0"
                  }
                >
                  {x.header}
                </strong>
                <p>{x.paragraph && x.paragraph}</p>
                <motion.ol
                  className="text-left ml-0 pl-0"
                  variants={LIST_ITEM_VARIANTS}
                >
                  {x.list &&
                    x.list.map((y, idx) => (
                      <li className="dropdown-font" key={idx}>
                        <p className="mt-2">
                          <small>{y}</small>
                        </p>
                      </li>
                    ))}
                </motion.ol>
              </motion.li>
            ))}
        </ul>
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
