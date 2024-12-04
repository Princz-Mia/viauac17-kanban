import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Board, Id } from "../../types/types";
import { useState } from "react";
import TrashIcon from "../../icons/TrashIcon";
import EditIcon from "../../icons/EditIcon";
import { toast } from "react-toastify";

/**
 * `BoardLabel` komponens, amely lehetővé teszi egy tábla címének megjelenítését és szerkesztését.
 * A tábla kijelölésére és törlésére is biztosít funkciókat, és drag-and-drop műveletekhez is használható.
 *
 * @param {Board} props.board - A megjelenítendő tábla adatai, beleértve a címét.
 * @param {Function} props.onSelectBoard - Függvény a tábla kijelölésére.
 * @param {Function} props.onDeleteBoard - Függvény a tábla törlésére.
 * @param {Function} props.updateBoardTitle - Függvény a tábla címének frissítésére.
 */
interface BoardLabelProps {
  board: Board;
  onSelectBoard: (id: Id) => void;
  onDeleteBoard: () => void;
  updateBoardTitle: (id: Id, title: string) => void;
}

/**
 * A BoardLabel komponens implementációja.
 * `BoardLabel` komponens, amely lehetővé teszi egy tábla címének megjelenítését és szerkesztését.
 * A tábla kijelölésére és törlésére is biztosít funkciókat, és drag-and-drop műveletekhez is használható.
 *
 * @param {BoardLabelProps} props - A komponens paraméterei.
 *
 */
export default function BoardLabel(props: BoardLabelProps) {
  const { board, onSelectBoard, onDeleteBoard, updateBoardTitle } = props;

  // A kurzor helyzetét tároló állapot (egér fölötte).
  const [mouseIsOver, setMouseIsOver] = useState(false);

  // Az állapot, amely jelzi, hogy szerkesztési módban vagyunk-e.
  const [editMode, setEditMode] = useState(false);

  /**
   * A drag-and-drop funkciókhoz szükséges beállítások, amelyek lehetővé teszik a címkék átrendezését.
   *
   * @returns {object} - A drag-and-drop műveletekhez szükséges referenciák és események.
   */
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: board.id, disabled: editMode });

  // A stílus, amely a drag-and-drop átalakításhoz szükséges.
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  /**
   * Átvált a szerkesztési mód és a mouseIsOver állapotok között.
   *
   * A szerkesztési mód aktiválása, illetve a kurzor alatt történő események lekezelése.
   */
  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  // Ha a feladatot húzzák, akkor halványabban jelenítjük meg a tartalmát.
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className=" bg-mainBackgroundColor
            text-md
            h-[75px]
            cursor-grab
            roundend-md
            p-3
            font-bold
            flex
            items-center
            justify-between
            opacity-30
            border-2
          border-indigo-500
    "
      >
        {board.title}
      </div>
    );
  }

  // Ha szerkesztési módba lépünk, textarea-t jelenítünk meg a címke címével.
  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-mainBackgroundColor 
    p-2.5 
    h-[75px] 
    min-h-[75px] 
    items-center 
    flex 
    text-left 
    rounded-xl 
    hover:ring-2 
    hover:ring-inset 
    hover:ring-indigo-500
    cursor-grabs 
    relative"
      >
        <textarea
          className="h-[40px]
      w-full
      resize-none
      border-none
      rounded
      bg-transparent
      text-white
      focus:outline-none
      "
          value={board.title}
          autoFocus
          placeholder="Board title here"
          onBlur={toggleEditMode} // A szerkesztés befejezése, ha elhagyjuk a mezőt.
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) toggleEditMode(); // Enter + Shift kombinációra kilépünk a szerkesztésből.
          }}
          onChange={(e) => {
            updateBoardTitle(board.id, e.target.value); // A címke címének frissítése.
          }}
        />
      </div>
    );
  }

  // Alapértelmezett megjelenés, ha nem szerkesztési módban vagyunk.
  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => {
        onSelectBoard(board.id); // Kattintásra kiválasztja a hozzátartozó táblát.
      }}
      onMouseEnter={() => {
        setMouseIsOver(true); // Egérkurzor fölé kerüléskor megjelenik a törlés gomb.
      }}
      onMouseLeave={() => {
        setMouseIsOver(false); // Egérkurzor eltávolítása után elrejti a törlés gombot.
      }}
    >
      <div
        {...attributes}
        {...listeners}
        className="
            bg-mainBackgroundColor
            text-md
            h-[75px]
            cursor-grab
            roundend-md
            rounded-b-none
            p-3
            font-semibold
            border-columnBackgroundColor
            border-4
            flex
            items-center
            justify-between
         hover:bg-gray-950
            "
      >
        <div
          className="
            flex
            gap-2"
        >
          {!editMode && board.title} {/* A címke címének megjelenítése. */}
          {editMode && (
            <input
              className="bg-black focus:border-indigo-500 border rounded outline-none"
              value={board.title}
              onChange={(e) => updateBoardTitle(board.id, e.target.value)} // A címke címének frissítése.
              autoFocus
              onBlur={() => {
                setEditMode(false); // Kilépés a címke szerkesztéséből.
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false); // Kilépés a címke szerkesztéséből.
              }}
            />
          )}
        </div>
        {mouseIsOver && (
          <div>
            <button
              onClick={() => {
                setEditMode(true); // A címke szerkesztési módjába lépés.
              }}
              className="
        stroke-gray-500
        hover:stroke-white
        rounded
        px-1
        py-2"
            >
              <EditIcon />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Ne aktiválja a tábla kijelölését
                onDeleteBoard(); // A tábla törlése.
                toast.success("Board has been deleted");
              }}
              className="
        stroke-gray-500
        hover:stroke-white
        rounded
        px-1
        py-2"
            >
              <TrashIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
