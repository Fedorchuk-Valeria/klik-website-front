"use client";

import classNames from "classnames";
import { useEffect, useRef } from "react";

import Icon from "@/src/components/ui/Icon/Icon";
import { City } from "@/src/lib/getCities";

import { setPlaceCookie } from "@/src/utils/clientCookies";

type CitySwitcherProps = {
  cities: City[];
  currentCity: City;
  onClick?: (city: City) => void;
  className?: string;
};

const CitySwitcher = ({ cities, currentCity, onClick, className }: CitySwitcherProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current) return;

      if (!ref.current.contains(event.target as Node)) {
        ref.current.classList.remove("active");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    if (!ref.current) return;

    ref.current.classList.toggle("active");
  };

  const handleCitySelect = (e: React.MouseEvent<HTMLAnchorElement>, city: City) => {
    e.preventDefault();
    e.stopPropagation();

    if (onClick) {
      onClick(city);
    } else {
      setPlaceCookie(city.url);
      window.location.assign(city.url);
    }

    toggleDropdown();
  };

  return (
    <div className={classNames("city-switcher", className)} ref={ref}>
      <button type="button" className="city-switcher__current" onClick={toggleDropdown}>
        <Icon className="city-switcher__icon" name="pin" />

        {currentCity.name}

        <span className="city-switcher__current-btn">
          <Icon className="city-switcher__current-icon" name="arrow" />
        </span>
      </button>

      <ul className="city-switcher__dropdown">
        {cities.map((city) => {
          const isActive = city.slug === currentCity.slug;

          return (
            <li key={city.slug}>
              {isActive ? (
                <span className="city-switcher__item active">{city.name}</span>
              ) : (
                <a
                  href={city.url}
                  className="city-switcher__item"
                  onClick={(e) => handleCitySelect(e, city)}
                >
                  {city.name}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CitySwitcher;
