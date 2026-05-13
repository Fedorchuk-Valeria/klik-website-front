"use client";

import Image from "next/image";
import { FC } from "react";

import Icon from "@/src/components/ui/Icon/Icon";
import classNames from "classnames";

export type LocationItemData = {
  image: string;
  title: string;
  location: string;
  metro: string;
  coords: readonly [number, number];
  icon: React.ReactNode;
  iconPlacement?: "top" | "bottom" | "middle";
};

const LocationCardContent: FC<{
  item: LocationItemData;
  onShowOnMap: (coords: readonly [number, number]) => void;
}> = ({ item, onShowOnMap }) => (
  <>
    {item?.image && (
      <span className="home-page__location-body-item--image">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="home-page__location-body-item--image-img"
        />
      </span>
    )}

    {!item?.image && item?.icon && (
      <span
        className={classNames(
          "home-page__location-body-item--icon",
          `home-page__location-body-item--icon_${item?.iconPlacement || "middle"}`
        )}
      >
        {item.icon}
      </span>
    )}

    <div className="home-page__location-body-item-info">
      <p className="home-page__location-body-item-info--title">{item.title}</p>
      <p className="home-page__location-body-item-info--location">
        <Icon name="pin" />
        <span>{item.location}</span>
      </p>
      {!!item.metro && (
        <p className="home-page__location-body-item-info-metro">
          <Icon name="metro" />
          <span>{item.metro}</span>
        </p>
      )}

      <button
        type="button"
        onClick={() => onShowOnMap(item.coords)}
        className="home-page__location-body-item-info--button"
      >
        Показать на карте
      </button>
    </div>
  </>
);

export default LocationCardContent;
