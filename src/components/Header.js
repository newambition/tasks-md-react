import React from "react";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import SearchAndFilter from "./SearchAndFilter";
import HeaderActions from "./HeaderActions";

const Header = React.memo(
  ({
    searchTerm,
    onSearchChange,
    boardLabels = [],
    selectedLabelIds = [],
    onSelectedLabelIdsChange,
    dueDateFilter,
    onDueDateFilterChange,
  }) => {
    return (
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full sticky top-0 z-40"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderBottom: "3px solid var(--cartoon-border-dark)",
          boxShadow: "0px 4px 0px var(--cartoon-header-shadow)",
          fontFamily: "var(--cartoon-font)",
        }}
      >
        <div className="flex items-center justify-between w-full px-4 py-1.5 ">
          <div className="flex items-center gap-3 md:gap-4 flex-wrap">
            <h1
              className="text-xl md:text-2xl font-black ml-4 md:mx-4 mt-1 tracking-tighter cursor-default select-none"
              style={{
                color: "var(--text-heading)",
                fontFamily: "var(--cartoon-font)",
              }}
            >
              TaskMD Pro
            </h1>
            <img
              src={"./TaskMDProIcon.png"}
              alt="TaskMD Pro Logo"
              width="50"
              className="-ml-8 "
            />

            <SearchAndFilter
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              boardLabels={boardLabels}
              selectedLabelIds={selectedLabelIds}
              onSelectedLabelIdsChange={onSelectedLabelIdsChange}
              dueDateFilter={dueDateFilter}
              onDueDateFilterChange={onDueDateFilterChange}
            />
          </div>

          <HeaderActions />
        </div>
      </motion.header>
    );
  }
);

export default Header;
