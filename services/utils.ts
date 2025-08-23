import Locations from '@/constants/Locations';

export const currencyFormatter = new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    maximumFractionDigits: 0,
    currency: "CZK"
});

export const locationsCodeMap = Object.entries(Locations).reduce((acc, [key, loc]) => {
  acc[loc.code] = key
  return acc
}, {} as { [code: string]: string })

export function capitalize(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
