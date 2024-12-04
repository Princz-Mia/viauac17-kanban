/**
 * A táblákhoz, oszlopokhoz és feladatokhoz használt egyedi azonosító típusa.
 * A típus lehet string vagy szám.
 */
export type Id = string | number;

/**
 * A Board típus egy táblát reprezentál, amely tartalmazza a táblához tartozó adatokat.
 *
 * @param {Id} id - A tábla egyedi azonosítója
 * @param {string} title - A tábla címe
 */
export type Board = {
  id: Id;
  title: string;
};

/**
 * A Column típus egy oszlopot reprezentál a táblán, amely tartalmazza az oszlophoz tartozó adatokat.
 *
 * @param {Id} id - Az oszlop egyedi azonosítója
 * @param {string} title - Az oszlop címe
 */
export type Column = {
  id: Id;
  title: string;
};

/**
 * A Task típus egy feladatot reprezentál, amely tartalmazza a feladathoz tartozó adatokat.
 *
 * @param {Id} id - A feladat egyedi azonosítója
 * @param {Id} columnId - Az oszlop azonosítója, amelyhez a feladat tartozik
 * @param {string} content - A feladat tartalma
 */
export type Task = {
  id: Id;
  columnId: Id;
  content: string;
};
