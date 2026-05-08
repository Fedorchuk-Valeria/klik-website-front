declare global {
  interface Window {
    ymaps?: {
      ready: (callback: () => void) => void;
    };
  }
}

/** Загрузка JS API Яндекс.Карт 2.1 и ожидание `ymaps.ready`. */
export function loadYandexMaps(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    const ready = () => {
      if (!window.ymaps) {
        reject(new Error("Yandex Maps: глобальный ymaps не найден"));
        return;
      }
      window.ymaps.ready(() => resolve());
    };

    if (window.ymaps) {
      ready();
      return;
    }

    const scriptId = "yandex-maps-api-2.1";
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener("load", ready, { once: true });
      existing.addEventListener("error", () => reject(new Error("Yandex Maps: ошибка загрузки скрипта")), {
        once: true,
      });
      if (window.ymaps) ready();
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`;
    script.onload = () => ready();
    script.onerror = () => reject(new Error("Yandex Maps: ошибка загрузки скрипта"));
    document.head.appendChild(script);
  });
}
