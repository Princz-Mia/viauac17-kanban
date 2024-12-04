/**
 * A `PlusIcon` egy SVG ikont jelenít meg, amely a plusz jelet ábrázolja.
 *
 * Ez a komponens nem fogad bemeneti paramétereket.
 *
 * A komponens egy SVG elemet renderel, amely a plusz jelet ábrázolja a megadott
 * mérettel és színekkel.
 */
export default function PlusIcon() {
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
        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}
