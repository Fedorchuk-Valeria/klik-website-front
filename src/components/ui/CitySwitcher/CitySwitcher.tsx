"use client";

import { useEffect, useRef, useState } from "react";
import { City } from "@/src/lib/getCities";
import Icon from "@/src/components/ui/Icon/Icon";

type CitySwitcherProps = {
  cities: City[];
  currentCity: City;
};

const CitySwitcher = ({ cities, currentCity }: CitySwitcherProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current) return;

      if (!ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="city-switcher" ref={ref}>
      <button
        type="button"
        className="city-switcher__current"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Icon className="city-switcher__icon" name="pin" />
        {currentCity.name}
        <span className="city-switcher__current-btn">
          <Icon className="city-switcher__current-icon" name="arrow" />
        </span>
      </button>

      {open && (
        <ul className="city-switcher__dropdown">
          {cities.map((city) => {
            const isActive = city.slug === currentCity.slug;

            return (
              <li key={city.slug}>
                {isActive ? (
                  <span className="city-switcher__item active">{city.name}</span>
                ) : (
                  <a href={city.url} className="city-switcher__item">
                    {city.name}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CitySwitcher;
