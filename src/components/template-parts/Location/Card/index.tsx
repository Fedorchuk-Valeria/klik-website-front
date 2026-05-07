"use client";

import Image from "next/image";
import { FC } from "react";

import Icon from "@/src/components/ui/Icon/Icon";

export type LocationItemData = {
  image: string;
  title: string;
  location: string;
  metro: string;
};

const LocationCardContent: FC<{
  item: LocationItemData;
  onShowOnMap: () => void;
}> = ({ item, onShowOnMap }) => (
  <>
    <span className="home-page__location-body-item--image">
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="home-page__location-body-item--image-img"
      />
    </span>

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
        onClick={onShowOnMap}
        className="home-page__location-body-item-info--button"
      >
        Показать на карте
      </button>
    </div>
  </>
);

export default LocationCardContent;
