import "./App.css";
import HomePage from "./pages/HomePage";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Az `App` komponens az alkalmazás fő komponense, amely megjeleníti a HomePage komponenst és a ToastContainer-t.
 *
 * A komponens nem vár semmilyen props-ot, így nincs szükség props interfészre.
 *
 * A `ToastContainer` a toast értesítéseket jeleníti meg az alkalmazásban.
 */
function App() {
  return (
    <div>
      <HomePage /> {/* A HomePage komponens betöltése */}
      <ToastContainer
        position="bottom-right" // Az értesítés helye az oldalon
        autoClose={1000} // Az értesítés automatikusan bezárul 1000 ms után
        hideProgressBar={false} // Az értesítés alatt látható a haladási sáv
        newestOnTop={false} // Az új értesítések nem kerülnek a régi elé
        closeOnClick // Az értesítés bezárása kattintásra
        rtl={false} // Az értesítés nem jobboldali (jobbra igazított) irányban jelenik meg
        pauseOnFocusLoss // Az értesítés szünetel, ha az alkalmazás háttérbe kerül
        draggable // Az értesítés húzható
        pauseOnHover // Az értesítés szünetel, ha fölötte tartjuk az egeret
        theme="dark" // Az értesítés témája sötét
        transition={Slide} // Az értesítés átmeneti animációja
      />
    </div>
  );
}

export default App;
