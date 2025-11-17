import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Building from "@pages/Building";
import Hub from "@/pages/Hub";
import NotFound from "@pages/NotFound";
// import ScreenBlockage from "@pages/ScreenBlockage";

import RouteChangeTracker from "@components/RouteChangeTracker";
import ToastProvider from "@components/ToastProvider/ToastProvider";

import { ThemeProvider } from "@context/ThemeContext";
import { ModalProvider } from "@context/ModalContext";
import { TasksProvider } from "@board/context/TasksContext";
import { ScreenProvider } from "@context/ScreenContext";

import useScreenBlocker from "@hooks/useScreenBlocker";

function AppContent({ location }) {
  // useScreenBlocker(480);

  return (
    <div id="main">
      <Routes location={location}>
        <Route path="/" element={<Building />} />
        <Route path="/hub" element={<Hub />} />
        {/* <Route path="/block" element={<ScreenBlockage />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  useEffect(() => {
    const enableActiveOnIOS = () => { };
    document.addEventListener("touchstart", enableActiveOnIOS, true);
    return () => document.removeEventListener("touchstart", enableActiveOnIOS, true);
  }, []);

  return (
    <ThemeProvider>
      <TasksProvider>
        <ScreenProvider>
          <Router basename={import.meta.env.DEV ? "/" : "/development-board"}>
            <RouteChangeTracker>
              {(location) => (
                <ModalProvider>
                  <div className="App">
                    <AppContent location={location} />
                    <ToastProvider />
                  </div>
                </ModalProvider>
              )}
            </RouteChangeTracker>
          </Router>
        </ScreenProvider>
      </TasksProvider>
    </ThemeProvider>
  );
}

export default App;
