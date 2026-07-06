import { FC } from "react";

import Icon from "@/src/components/ui/Icon/Icon";
import Popover from "@/src/components/ui/Popover";

import { getPlural } from "@/src/helper/getPlural";

type PropTypes = {
  item: {
    value?: number | string;
    icon: string;
    title: string;
    plural: string[];
    info?: string;
  } | null;
  generalIndex: number;
};

export const ProfileBLock: FC<PropTypes> = ({ item, generalIndex }) => {
  return (
    <div key={item?.icon ?? generalIndex} className="children-details-page__general_item">
      <div className="children-details-page__general_headline">
        <div className="children-details-page__general_headline-tag">
          <span>
            <Icon name={item?.icon ?? ""} />
          </span>
          <span>{item?.title ?? ""}</span>
        </div>

        {item?.info && (
          <Popover
            variant="hover"
            positionX="right"
            positionY="bottom"
            content={item?.info ?? ""}
            className="children-details-page__general_headline-info"
            popoverClassName="children-details-page__general_headline-info-popover"
          >
            <Icon name="info-circle-outline" />
          </Popover>
        )}
      </div>

      <p className="children-details-page__general_value">{item?.value ?? 0}</p>
      <span className="children-details-page__general_text">
        {getPlural(Number(item?.value ?? 0), item?.plural ?? [])}
      </span>
    </div>
  );
};
