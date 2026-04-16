/**
 * Format a package value (stored in LPA) using Indian convention:
 *  ≥ 100 LPA  → show as Cr  (e.g. 178 → "1.78 Cr")
 *  < 100 LPA  → show as LPA (e.g. 8.5 → "8.5 LPA")
 */
export function formatPkg(lpa) {
  if (lpa == null) return "—";
  if (lpa >= 100) {
    const cr = (lpa / 100).toFixed(2).replace(/\.?0+$/, "");
    return `${cr} Cr`;
  }
  return `${lpa} LPA`;
}
