"use client";

import { useEffect, useRef } from "react";
import { City } from "@/src/lib/getCities";
import Icon from "@/src/components/ui/Icon/Icon";

type CitySwitcherProps = {
  cities: City[];
  currentCity: City;
};

const CitySwitcher = ({ cities, currentCity }: CitySwitcherProps) => {
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

  return (
    <div className="city-switcher" ref={ref}>
      <button
        type="button"
        className="city-switcher__current"
        onClick={toggleDropdown}
      >
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
                <span className="city-switcher__item active">
                  {city.name}
                </span>
              ) : (
                <a href={city.url} className="city-switcher__item">
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
