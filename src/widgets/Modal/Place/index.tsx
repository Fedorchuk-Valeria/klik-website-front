"use client";

import classNames from "classnames";
import { useRouter } from "next/navigation";
import { FC, useCallback, useMemo, useState } from "react";

import Button from "@/src/components/ui/Button/Button";
import CitySwitcher from "@/src/components/ui/CitySwitcher/CitySwitcher";
import Modal from "@/src/components/ui/Modal";

import { City, getCities } from "@/src/lib/getCities";
import { useAppDispatch } from "@/src/store/hooks";
import { hideModal } from "@/src/store/slices/modalSlice";
import { PLACE_STORAGE_KEY } from "@/src/utils/constant";

type PropTypes = {
  isVisible: boolean;
  className?: string;
};

const WidgetModalPlace: FC<PropTypes> = ({ className, isVisible }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cities = useMemo(() => getCities(), []);
  const [city, setCity] = useState<City>(cities[0]);

  const handleAccept = useCallback(() => {
    localStorage.setItem(PLACE_STORAGE_KEY, city.url);

    router.push(city.url);

    dispatch(hideModal());
  }, [dispatch, city.url, router]);

  return (
    <Modal className={classNames("place-select-modal", className)} isVisible={isVisible}>
      <h1 className={"place-select-modal__title"}>Где вы будете учиться?</h1>

      <CitySwitcher
        className={"place-select-modal__city-switcher"}
        cities={cities}
        currentCity={city}
        onClick={(city) => setCity(city)}
      />

      <Button
        className={"place-select-modal__button"}
        variant="main-green-dark"
        onClick={handleAccept}
      >
        Продолжить
      </Button>
    </Modal>
  );
};

export default WidgetModalPlace;
