import { HomePageContent } from "@/src/lib/content/types";
import { UsersPricesResponse } from "@/src/services/http/users";
import { buildApiUrl } from "@/src/utils/buildApiUrl";

export type HomePrices = NonNullable<HomePageContent["prices"]>;

function mapApiPrices(data: UsersPricesResponse): Pick<HomePrices, "title" | "price" | "list"> {
  return {
    title: data.title,
    price: data.price,
    list: data.items,
  };
}

async function fetchPricesFromApi(): Promise<Pick<HomePrices, "title" | "price" | "list"> | null> {
  const apiUrl = buildApiUrl("/users/prices/");

  if (!apiUrl) {
    return null;
  }

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as UsersPricesResponse;

    return mapApiPrices(data);
  } catch {
    return null;
  }
}

export async function getHomePrices(cmsPrices?: HomePrices): Promise<HomePrices | null> {
  const apiPrices = await fetchPricesFromApi();

  if (!cmsPrices && !apiPrices) {
    return null;
  }

  return {
    ...cmsPrices,
    ...apiPrices,
  };
}
