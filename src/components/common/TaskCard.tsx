import { useState } from "react";
import TrashIcon from "../../icons/TrashIcon";
import { Id, Task as TaskType } from "../../types/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "react-toastify";

/**
 * A TaskCard komponens egy Kanban feladathoz tartozó kártya, amely lehetővé teszi a felhasználó számára,
 * hogy szerkessze, törölje és átmozgassa a feladatokat.
 *
 * @param {TaskType} task - A kártya adatai.
 * @param {Function} deleteTask - A funkció, amely egy kártya törlésére szolgál.
 * @param {Function} updateTask - A funkció, amely egy kártya szerkesztésére szolgál.
 */
interface TaskProps {
  task: TaskType;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

/**
 * TaskCard komponens implementációja.
 * A TaskCard komponens egy Kanban feladathoz tartozó kártya, amely lehetővé teszi a felhasználó számára,
 * hogy szerkessze, törölje és átmozgassa a feladatokat.
 *
 * @param {TaskProps} props - A komponens bemeneti paraméterei.
 */
export default function TaskCard(props: TaskProps) {
  // A feladat, törlés és frissítés funkciók.
  const { task, deleteTask, updateTask } = props;

  // A kurzor helyzetét tároló állapot (egér fölötte).
  const [mouseIsOver, setMouseIsOver] = useState(false);

  // Az állapot, amely jelzi, hogy szerkesztési módban vagyunk-e.
  const [editMode, setEditMode] = useState(false);

  /**
   * A drag-and-drop funkciókhoz szükséges beállítások, amelyek lehetővé teszik a feladatok átrendezését.
   *
   * @returns {object} - A drag-and-drop műveletekhez szükséges referenciák és események.
   */
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id, // A feladat egyedi azonosítója
    data: {
      type: "Task",
      task, // A feladat adatai
    },
    disabled: editMode, // Ha szerkesztési módban vagyunk, a drag-and-drop letiltása.
  });

  // A stílus, amely a drag-and-drop átalakításhoz szükséges.
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
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

  // Ha a feladatot húzzák, nem jelenítünk meg tartalmat, csak egy átlátszó dobozt.
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-mainBackgroundColor 
    p-2.5 
    h-[100px] 
    min-h-[100px] 
    items-center 
    flex 
    text-left 
    rounded-xl 
    hover:ring-2 
    hover:ring-inset 
    cursor-grabs 
    relative
    opacity-30
    border-2
    border-indigo-500
    "
      />
    );
  }

  // Ha szerkesztési módba lépünk, textarea-t jelenítünk meg a feladat tartalmával.
  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-mainBackgroundColor 
    p-2.5 
    h-[100px] 
    min-h-[100px] 
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
          className="h-[90px]
      w-full
      resize-none
      border-none
      rounded
      bg-transparent
      text-white
      focus:outline-none
      "
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditMode} // A szerkesztés befejezése, ha elhagyjuk a mezőt.
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) toggleEditMode(); // Enter + Shift kombinációra kilépünk a szerkesztésből.
          }}
          onChange={(e) => {
            updateTask(task.id, e.target.value); // A feladat tartalmának frissítése.
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
      {...attributes}
      {...listeners}
      onClick={toggleEditMode} // Kattintásra szerkesztési módba lépünk.
      className="bg-mainBackgroundColor 
    p-2.5 
    h-[100px] 
    min-h-[100px] 
    items-center 
    flex 
    text-left 
    rounded-xl 
    hover:ring-2 
    hover:ring-inset 
    hover:ring-indigo-500
    cursor-grab
    relative"
      onMouseEnter={() => {
        setMouseIsOver(true); // Egérkurzor fölé kerüléskor megjelenik a törlés gomb.
      }}
      onMouseLeave={() => {
        setMouseIsOver(false); // Egérkurzor eltávolítása után elrejti a törlés gombot.
      }}
    >
      <p
        className="my-auto h-[90%] 
      w-full 
      overflow-y-auto 
      overflow-x-hidden
      whitespace-pre-wrap"
      >
        {task.content} {/* A feladat tartalmának megjelenítése. */}
      </p>
      {mouseIsOver && (
        <button
          onClick={() => {
            deleteTask(task.id); // A feladat törlése.
            toast.success("Task has been deleted"); // Sikeres törlés értesítése.
          }}
          className="stroke-white 
      absolute 
      right-4 top-1/2 
      -translate-y-1/2
       bg-columnBackgroundColor 
       p-2 
       rounded
       opacity-60
       hover:opacity-100"
        >
          <TrashIcon /> {/* A törlés ikon megjelenítése. */}
        </button>
      )}
    </div>
  );
}
