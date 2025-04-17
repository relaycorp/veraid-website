import React, { useState } from "react";
import type { ReactNode } from "react";

export interface Tab {
  label: string;
  icon?: string | React.ReactElement;
  content: ReactNode;
}

export interface TabContainerProps {
  tabs: Tab[];
  className?: string;
}

const getTabClasses = (isActive: boolean): string =>
  `px-4 py-2 text-xs lg:text-sm transition-colors flex items-center ${
    isActive ? "text-white border-b-2 border-white" : "text-neutral-400 hover:text-neutral-200"
  }`;

const renderIcon = (icon?: string | React.ReactElement) => {
  if (!icon) return null;

  if (typeof icon === "string") {
    return <img src={icon} alt="" className="w-6 h-6 mr-2" />;
  }
  return <span className="mr-2">{icon}</span>;
};

const TabContainer: React.FC<TabContainerProps> = ({ tabs, className = "" }) => {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  const activeTab = tabs[activeTabIndex];

  return (
    <div
      className={`rounded-md max-w-4xl mx-auto my-6 scrollbar bg-gradient-to-r from-indigo-500 from-10% via-indigo-400 via-30% to-emerald-500 to-90% p-[2px] ${className}`}
    >
      <div className="rounded-md overflow-hidden bg-black h-full">
        <div className="flex overflow-x-auto whitespace-nowrap flex-nowrap border-b border-neutral-800">
          {tabs.map((tab, index) => (
            <button
              key={`tab-${tab.label}-${index}`}
              className={getTabClasses(activeTabIndex === index)}
              onClick={() => setActiveTabIndex(index)}
            >
              {renderIcon(tab.icon)}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative bg-[#121212]">{activeTab.content}</div>
      </div>
    </div>
  );
};

export default TabContainer;
