import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Board as BoardType, Id } from "../../types/types";
import BoardLabel from "./BoardLabel";
import { useEffect, useState } from "react";
import PlusIcon from "../../icons/PlusIcon";
import CloseSidebarIcon from "../../icons/CloseSidebarIcon";
import OpenSidebarIcon from "../../icons/OpenSidebarIcon";
import { toast } from "react-toastify";

/**
 * Sidebar komponens, amely a Kanban táblák listáját és kezelőfelületét biztosítja.
 * A sidebar tartalmazza a táblák listáját, a táblák létrehozására és törlésére szolgáló gombokat,
 * valamint drag-and-drop funkciót a táblák sorrendjének módosítására.
 *
 * @param {BoardTpye[]} boards - A Kanban táblák listája.
 * @param {Function} onSelectBoard - A funkció, amely egy tábla kiválasztására szolgál.
 * @param {Function} onCreateBoard - A funkció, amely új tábla létrehozására szolgál.
 * @param {Function} onDeleteBoard - A funkció, amely egy tábla törlésére szolgál.
 * @param {Function} onUpdateBoards - A funkció, amely a táblák sorrendjének frissítésére szolgál.
 * @param {Function} onUpdateBoardTitle - A funkció, amely egy tábla címének frissítésére szolgál.
 * @param {boolean} isOpen - A sidebar állapota, hogy nyitva van-e.
 * @param {Function} onToggle - A funkció, amely a sidebar állapotának váltására szolgál (nyitás/zárás).
 */
interface SidebarProps {
  boards: BoardType[];
  onSelectBoard: (id: Id) => void;
  onCreateBoard: () => void;
  onDeleteBoard: (id: Id) => void;
  onUpdateBoards: (boards: BoardType[]) => void;
  onUpdateBoardTitle: (id: Id, title: string) => void;

  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Sidebar komponens implementációja.
 * A komponens kezeli a táblák listáját, azok drag-and-drop sorrendjének változtatását,
 * és biztosítja az új tábla létrehozását és törlését.
 *
 * @param {Props} props - A komponens bemeneti paraméterei.
 *
 */
export default function Sidebar(props: SidebarProps) {
  const {
    boards,
    onSelectBoard,
    onCreateBoard,
    onDeleteBoard,
    onUpdateBoards,
    onUpdateBoardTitle,
    isOpen,
    onToggle,
  } = props;
  const [boardLabels, setBoardLabels] = useState<BoardType[]>([]);

  /**
   * A drag-and-drop funkciókhoz szükséges szenzorok inicializálása.
   *
   * A `PointerSensor` a pointer eszközöket használja a drag-and-drop műveletekhez, míg a `KeyboardSensor`
   * a billentyűzet navigációt kezeli.
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Minimális távolság, mielőtt a drag-and-drop aktiválódik.
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * A komponens frissítésekor beállítja a boardLabels állapotot a kapott táblákra.
   */
  useEffect(() => {
    setBoardLabels(boards);
  }, [boards]);

  return (
    <>
      {/* Sidebar */}
      <div
        className={`z-10 w-64 h-screen bg-gray-950 fixed text-white flex flex-col top-0 shadow-lg 
          transition-all duration-2000 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
          <h2
            className="text-xl font-semibold cursor-pointer
            bg-gradient-to-r bg-clip-text  text-transparent 
            from-indigo-500 via-purple-500 to-indigo-500
            animate-text"
            onClick={() => {
              onSelectBoard(-1);
            }}
          >
            Kanban Boards
          </h2>
          <button
            onClick={onToggle}
            className="text-white focus:outline-none cursor-pointer
            rounded-full
            bg-mainBackgroundColor
            border-2
            border-columnBackgroundColor
            p-2
            ring-indigo-500
            hover:ring-2
            flex
            gap-2
                   opacity-80
       hover:opacity-100"
          >
            <CloseSidebarIcon />
          </button>
        </div>
        <ul className="flex-grow overflow-y-auto overflow-x-hidden">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={boardLabels}
              strategy={verticalListSortingStrategy}
            >
              {boardLabels.map((board) => (
                <BoardLabel
                  key={board.id}
                  board={board}
                  onDeleteBoard={() => onDeleteBoard(board.id)}
                  onSelectBoard={onSelectBoard}
                  updateBoardTitle={onUpdateBoardTitle}
                />
              ))}
            </SortableContext>
          </DndContext>
        </ul>
        <div className="flex justify-center items-end p-4">
          <button
            onClick={() => {
              onCreateBoard();
              toast.success("Board has been created");
            }}
            className="
            h-[60px]
            w-[250px]
            min-w-[250px]
            cursor-pointer
            rounded-lg
            bg-mainBackgroundColor
            border-2
            border-columnBackgroundColor
            p-2
            ring-indigo-500
            hover:ring-2
            flex
            gap-2
          "
          >
            <PlusIcon />
            Create New Board
          </button>
        </div>
      </div>
      {/* Toggle Button (Always Visible When Sidebar is Closed) */}
      <button
        onClick={onToggle}
        className={`z-10 fixed top-4 left-2 bg-gray-800 text-white p-2 rounded-full shadow-lg focus:outline-none transition-transform duration-300 opacity-80
       hover:opacity-100 ring-indigo-500 hover:ring-2 ${isOpen ? "hidden" : "block"}`}
      >
        <OpenSidebarIcon />
      </button>
    </>
  );

  /**
   * A drag-and-drop esemény kezelése.
   * A táblák újrarendezése a felhasználói interakció alapján.
   *
   * @param {DragEndEvent} event - A drag-and-drop esemény.
   */
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    // Ha a drag-and-drop aktív elemének és az új elemnek az ID-je eltér, akkor újrarendezzük őket
    if (over && active.id !== over.id) {
      setBoardLabels((labels) => {
        const oldIndex = labels.findIndex((label) => label.id === active.id);
        const newIndex = labels.findIndex((label) => label.id === over.id);

        const updatedBoards = arrayMove(labels, oldIndex, newIndex); // Az elemek újrarendezése
        onUpdateBoards(updatedBoards); // A táblák frissítése
        return updatedBoards;
      });
    }
  }
}
