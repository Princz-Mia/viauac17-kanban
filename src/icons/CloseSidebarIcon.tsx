/**
 * A `CloseSidebarIcon` komponens egy SVG ikont renderel, amely a sidebar bezárására szolgál.
 * Az ikon egy egyszerű "X" formátumot ábrázol.
 *
 * A komponens nem fogad semmilyen prop-ot, ezért nem szükséges props interfész.
 */
export default function CloseSidebarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
      />
    </svg>
  );
}
