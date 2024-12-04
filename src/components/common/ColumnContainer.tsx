import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../../icons/TrashIcon";
import { Column as ColumnType, Id, Task as TaskType } from "../../types/types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../../icons/PlusIcon";
import TaskCard from "./TaskCard";
import ListIcon from "../../icons/ListIcon";
import { toast } from "react-toastify";

/**
 * A ColumnContainer komponens felelős a feladatok és oszlopok kezeléséért, beleértve azok hozzáadását, törlését és módosítását.
 *
 * @param {ColumnType} column - Az oszlop adatmodellje, amely a feladatok tárolásáért felelős.
 * @param {Function} deleteColumn - Függvény, amely törli az oszlopot.
 * @param {Function} updateColumn - Függvény, amely frissíti az oszlop címét.
 * @param {Function} createTask - Függvény, amely új feladatot hoz létre az adott oszlopban.
 * @param {Function} updateTask - Függvény, amely frissíti a feladat tartalmát.
 * @param {Function} deleteTask - Függvény, amely törli a feladatot.
 * @param {TaskType[]} tasks - A feladatok listája, amely az adott oszlopban található feladatokat tartalmazza.
 */
interface ColumnProps {
  column: ColumnType;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;

  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  tasks: TaskType[];
}
/**
 * A ColumnContainer komponens felelős a feladatok és oszlopok kezeléséért, beleértve azok hozzáadását, törlését és módosítását.
 *
 * @param {ColumnProps} props - A komponens paraméterei
 *
 */
export default function ColumnContainer(props: ColumnProps) {
  const {
    column,
    deleteColumn,
    updateColumn,
    createTask,
    updateTask,
    deleteTask,
    tasks,
  } = props;

  // Az állapot, amely jelzi, hogy szerkesztési módban vagyunk-e.
  const [editMode, setEditMode] = useState(false);

  // A feladatok azonosítójának lista létrehozása, amelyet a SortableContext használ.
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  // A drag-and-drop funkcióval kapcsolatos állapotok és referencia beállítása
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  // A stílus, amely a drag-and-drop átalakításhoz szükséges.
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // Ha az oszlopot húzzák, akkor egy üres div jelenik meg, hogy a felhasználó láthassa a húzott elemet
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
    bg-columnBackgroundColor
    opacity-40
    border-2
    border-indigo-500
    w-[350px]
    h-[500px]
    max-h-[500px]
    rounded-md
    flex
    flex-col
    "
      ></div>
    );
  }

  // Alapértelmezett megjelenés, ha nem drag-and-move módban vagyunk.
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
    bg-columnBackgroundColor
    w-[350px]
    h-[500px]
    max-h-[500px]
    rounded-md
    flex
    flex-col
    transition-shadow duration-300 cursor-pointer hover:shadow-sm hover:shadow-indigo-500
    "
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="
    bg-mainBackgroundColor
    text-md
    h-[60px]
    cursor-grab
    rounded-md
    rounded-b-none
    p-3
    font-bold
    border-columnBackgroundColor
    border-4
    flex
    items-center
    justify-between
  "
      >
        <div
          className="
      flex
      gap-2
      items-center
      flex-grow
      overflow-hidden
    "
        >
          <div
            className="
        flex
        justify-center
        items-center
        bg-columnBackgroundColor
        px-2
        py-1
        text-sm
        rounded-full
        shrink-0
      "
          >
            <ListIcon />
          </div>
          {!editMode && (
            <div
              className="
          overflow-hidden
          text-ellipsis
          whitespace-nowrap
          flex-grow
        "
            >
              {column.title}
            </div>
          )}
          {editMode && (
            <input
              className="
      bg-black
      focus:border-indigo-500
      border
      rounded
      outline-none
      w-full
      min-w-0
      px-2
      py-1
      text-ellipsis
    "
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => {
            deleteColumn(column.id);
            toast.success("Column has been deleted");
          }}
          className="
      stroke-gray-500
      hover:stroke-white
      rounded
      px-1
      py-2
    "
        >
          <TrashIcon />
        </button>
      </div>
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => {
            return (
              <TaskCard
                key={task.id}
                task={task}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            );
          })}
        </SortableContext>
      </div>
      <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-indigo-500 active:bg-black"
        onClick={() => {
          createTask(column.id);
          toast.success("Task has been created");
        }}
      >
        <PlusIcon />
        Add Task
      </button>
    </div>
  );
}
