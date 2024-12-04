import { useEffect, useMemo, useState } from "react";
import PlusIcon from "../../icons/PlusIcon";
import { Column as ColumnType, Task as TaskType, Id } from "../../types/types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { toast } from "react-toastify";

/**
 * A Board komponensz a táblához tartozó oszlopok és feladatok kezelésére szolgál.
 * Az oszlopok és feladatok elrendezése a Drag and Drop technológiával történik.
 *
 * @param {BoardProps} props - A komponens bemeneti paraméterei
 * @param {Id} boardId - A táblához tartozó egyedi azonosító
 */
interface BoardProps {
  boardId: Id;
}

/**
 * A Board komponensz a táblához tartozó oszlopok és feladatok kezelésére szolgál.
 * Az oszlopok és feladatok elrendezése a Drag and Drop technológiával történik.
 * A komponens a következő állapotokat kezeli:
 * - Oszlopok és feladatok betöltése és mentése localStorage-ba
 * - Oszlopok és feladatok szűrése a táblához
 * - Oszlopok és feladatok létrehozása, frissítése, törlése
 *
 * @param {BoardProps} props - A komponens paraméterei
 *
 */
export default function Board(props: BoardProps) {
  const { boardId } = props;

  // Oszlopok állapota, betöltve a localStorage-ból, ha elérhető
  const [columns, setColumns] = useState<ColumnType[]>(() => {
    const savedColumns = localStorage.getItem(`columns_${boardId}`);
    return savedColumns ? JSON.parse(savedColumns) : [];
  });

  // Feladatok állapota, betöltve a localStorage-ból, ha elérhető
  const [tasks, setTasks] = useState<TaskType[]>(() => {
    const savedTasks = localStorage.getItem(`tasks_${boardId}`);
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // Az oszlopok ID-jai
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  // Aktív oszlop
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);

  // Aktív kártya
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  // Betöltjük az oszlopokat és feladatokat a localStorage-ból
  useEffect(() => {
    const savedColumns = localStorage.getItem(`columns_${boardId}`);
    const savedTasks = localStorage.getItem(`tasks_${boardId}`);
    if (savedColumns) setColumns(JSON.parse(savedColumns));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, [boardId]);

  // Oszlopok mentése a localStorage-ba
  useEffect(() => {
    localStorage.setItem(`columns_${boardId}`, JSON.stringify(columns));
  }, [columns, boardId]);

  // Feladatok mentése a localStorage-ba
  useEffect(() => {
    localStorage.setItem(`tasks_${boardId}`, JSON.stringify(tasks));
  }, [tasks, boardId]);

  // A szenzorok beállítása a Drag and Drop-hoz
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  // Oszlopok szűrése az aktuális táblához
  const filteredColumns = useMemo(
    () =>
      columns.filter((col) => col.id.toString().startsWith(boardId.toString())),
    [columns, boardId]
  );

  // Feladatok szűrése az oszlopok alapján
  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) =>
        filteredColumns.some((col) => col.id === task.columnId)
      ),
    [tasks, filteredColumns]
  );

  return (
    <div
      className="
    m-auto
    flex
    min-h-screen
    w-full
    items-center
    overflow-x-auto
    overflow-y-hidden
    px-[40px]
    relative
  "
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4 z-10">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {filteredColumns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                  tasks={filteredTasks.filter(
                    (task) => task.columnId === col.id
                  )}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              createNewColumn();
              toast.success("Column has been created");
            }}
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-2 ring-indigo-500 hover:ring-2 flex gap-2"
          >
            <PlusIcon />
            Add Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                updateTask={updateTask}
                deleteTask={deleteTask}
                tasks={filteredTasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  /**
   * Új oszlop létrehozása
   */
  function createNewColumn() {
    const columnToAdd: ColumnType = {
      id: `${boardId}-${generateId()}`, // Egyedi azonosító a táblához
      title: `Column ${filteredColumns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  /**
   * Oszlop törlése
   * @param {Id} id - Az oszlop ID-ja, amelyet törölni kell
   */
  function deleteColumn(id: Id) {
    const filteredColumn = columns.filter((col) => col.id !== id);
    setColumns(filteredColumn);

    const newTasks = tasks.filter((task) => task.columnId !== id);
    setTasks(newTasks);
  }

  /**
   * Oszlop címének frissítése
   * @param {Id} id - Az oszlop ID-ja
   * @param {string} title - Az új oszlop cím
   */
  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  /**
   * Új feladat létrehozása
   * @param {Id} columnId - Az oszlop ID-ja, amelyhez a feladat tartozik
   */
  function createTask(columnId: Id) {
    const newTask: TaskType = {
      id: generateId(),
      columnId,
      content: "Task content",
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
  }

  /**
   * Feladat tartalmának frissítése
   * @param {Id} id - A feladat ID-ja
   * @param {string} content - Az új tartalom
   */
  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }

  /**
   * Feladat törlése
   * @param {Id} id - A feladat ID-ja, amelyet törölni kell
   */
  function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  /**
   * Egyedi ID generálása
   * @returns {number} - Egy új véletlenszerű ID
   */
  function generateId() {
    return Math.floor(Math.random() * 10000);
  }

  /**
   * Az oszlop vagy feladat húzásának indítása
   * @param {DragStartEvent} event - A húzás kezdési eseménye
   */
  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  /**
   * Az oszlopok vagy feladatok áthelyezésének befejezése
   * @param {DragEndEvent} event - Az áthelyezési esemény
   */
  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    setColumns((cols) => {
      const activeIndex = cols.findIndex((col) => col.id === activeId);
      const overIndex = cols.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeIndex, overIndex);
    });
  }

  /**
   * Az oszlopok vagy feladatok húzásának közbeni események kezelése
   * @param {DragOverEvent} event - Az áthelyezési esemény
   */
  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOVerATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOVerATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}
