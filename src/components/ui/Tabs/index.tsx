import classNames from "classnames";
import { FC } from "react";

type PropTypes = {
  tabs: {
    label: string;
    value: string;
  }[];
  activeTab: string;
  onChange: (tab: string) => void;
  className?: string;
};

const Tabs: FC<PropTypes> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={classNames("tabs", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={classNames("tabs__tab", {
            "tabs__tab--active": activeTab === tab.value,
          })}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
