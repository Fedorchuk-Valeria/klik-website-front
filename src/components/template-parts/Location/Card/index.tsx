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
  coords?: readonly [number, number];
  zoom?: number;
  map_url?: string;
  icon?: React.ReactNode;
  iconPlacement?: "top" | "bottom" | "middle";
};

const LocationCardContent: FC<{
  item: LocationItemData;
  onShowOnMap: (coords: readonly [number, number], zoom?: number) => void;
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
        onClick={() => {
          if (item.coords) {
            onShowOnMap(item.coords, item.zoom);
            return;
          }

          if (item.map_url) {
            window.open(item.map_url, "_blank", "noopener,noreferrer");
          }
        }}
        className="home-page__location-body-item-info--button"
      >
        Показать на карте
      </button>
    </div>
  </>
);

export default LocationCardContent;
