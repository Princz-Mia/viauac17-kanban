import { useEffect, useState } from "react";
import Sidebar from "../components/common/Sidebar";
import Board from "../components/common/Board";
import { Board as BoardType, Id } from "../types/types";
import { BackgroundBeams } from "../components/ui/background-beams";

/**
 * A Kanban alkalmazás főoldala, amely tartalmazza a táblák (boards) kezelését,
 * valamint az oldalsó menüt (Sidebar) és a táblák megjelenítését (Board).
 */
export default function HomePage() {
  // A táblák állapota, amelyet a localStorage-ból tölt be inicializáláskor
  const [boards, setBoards] = useState<BoardType[]>(() => {
    const savedBoards = localStorage.getItem("kanban_boards");
    return savedBoards ? JSON.parse(savedBoards) : [];
  });

  // Az aktuálisan kiválasztott tábla ID-je
  const [selectedBoardId, setSelectedBoardId] = useState<Id | null>(() => {
    const savedSelectedBoardId = localStorage.getItem("selected_boardId");
    return savedSelectedBoardId ? JSON.parse(savedSelectedBoardId) : null;
  });

  // Az oldalsó menü nyitott/zárt állapota
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar állapot

  /**
   * Oldalsó menü nyitása/zárása.
   */
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Táblák és kiválasztott tábla ID betöltése a localStorage-ból, amikor a komponens betöltődik.
  useEffect(() => {
    const savedBoards = localStorage.getItem("kanban_boards");
    if (savedBoards) {
      setBoards(JSON.parse(savedBoards));
    }

    const savedSelectedBoardId = localStorage.getItem("selected_boardId");
    if (savedSelectedBoardId) {
      setSelectedBoardId(JSON.parse(savedSelectedBoardId));
    }
  }, []);

  // Táblák állapotának mentése localStorage-ba, amikor az állapot változik.
  useEffect(() => {
    localStorage.setItem("kanban_boards", JSON.stringify(boards));
  }, [boards]);

  // Kiválasztott tábla ID mentése localStorage-ba, amikor az állapot változik.
  useEffect(() => {
    localStorage.setItem("selected_boardId", JSON.stringify(selectedBoardId));
  }, [selectedBoardId]);

  /**
   * Új tábla létrehozása, alapértelmezett címkével.
   */
  const createBoard = () => {
    const newBoard: BoardType = {
      id: Math.floor(Math.random() * 10000),
      title: `Board ${boards.length + 1}`,
    };
    setBoards((prev) => [...prev, newBoard]);
  };

  /**
   * Tábla törlése azonosító alapján.
   * @param id - A törlendő tábla azonosítója.
   */
  const deleteBoard = (id: Id) => {
    // Ha az aktív tábla törlődik, válassz új táblát, vagy állítsd nullára.
    setBoards((prevBoards) => prevBoards.filter((board) => board.id !== id));
    if (selectedBoardId === id) {
      const remainingBoards = boards.filter((board) => board.id !== id);
      setSelectedBoardId(
        remainingBoards.length > 0 ? remainingBoards[0].id : null
      );
    }

    // Kapcsolódó oszlopok és kártyák törlése.
    localStorage.removeItem(`columns_${id}`);
    localStorage.removeItem(`tasks_${id}`);
  };

  /**
   * Tábla kiválasztása azonosító alapján.
   * @param id - A kiválasztandó tábla azonosítója.
   */
  const selectBoard = (id: Id) => {
    setSelectedBoardId(id);
  };

  /**
   * Táblák sorrendjének vagy listájának frissítése.
   * @param updatedBoards - Az új táblalista.
   */
  const handleUpdateBoards = (updatedBoards: BoardType[]) => {
    setBoards(updatedBoards); // Frissítjük a táblák sorrendjét
  };

  /**
   * Tábla címének frissítése.
   * @param id - A tábla azonosítója.
   * @param title - Az új cím.
   */
  const handleUpdateBoardTitle = (id: Id, title: string) => {
    setBoards((prevBoards) => {
      const boardIndex = prevBoards.findIndex((board) => board.id === id);

      if (boardIndex !== -1) {
        const updatedBoards = [...prevBoards];
        updatedBoards[boardIndex] = {
          ...updatedBoards[boardIndex],
          title: title,
        };
        return updatedBoards;
      }

      return prevBoards;
    });
  };

  // Az aktuálisan kiválasztott tábla azonosító alapján történő kikeresése.
  const selectedBoard = boards.find((board) => board.id === selectedBoardId);

  return (
    <div className="flex h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        boards={boards}
        onSelectBoard={selectBoard}
        onCreateBoard={createBoard}
        onDeleteBoard={deleteBoard}
        onUpdateBoards={handleUpdateBoards}
        onUpdateBoardTitle={handleUpdateBoardTitle}
      />
      <div
        className={`flex-1 transition-all overflow-x-auto flex justify-center items-center ${isSidebarOpen ? "ml-64" : "ml-0"}`}
      >
        <BackgroundBeams />
        {selectedBoard ? (
          <Board boardId={selectedBoard.id} />
        ) : (
          <div className="text-gray-500 text-center animate-customPulse">
            Select a board or create a new one to start!
          </div>
        )}
      </div>
    </div>
  );
}
