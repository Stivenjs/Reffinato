import React, { useEffect } from "react";
import AppRoutes from "../../routes/AppRoutes";
import { BrowserRouter as Router, useLocation } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <ConditionalChat>
        <AppRoutes />
      </ConditionalChat>
    </Router>
  );
};

const ConditionalChat = ({ children }) => {
  const location = useLocation();

  // Rutas donde el chat no debe aparecer
  const noChatRoutes = ["/login", "/register", "/reset-password"];

  // Determina si debe mostrarse el chat
  const shouldShowChat = !noChatRoutes.includes(location.pathname);

  useEffect(() => {
    // Función para cargar el script de Tidio
    const loadTidioScript = () => {
      const existingScript = document.querySelector(
        'script[src="//code.tidio.co/wmf5plr9m9pneouvk3yuxnyuvrxnqh31.js"]'
      );
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "//code.tidio.co/wmf5plr9m9pneouvk3yuxnyuvrxnqh31.js";
        script.async = true;
        document.body.appendChild(script);
        script.onload = () => {
          if (shouldShowChat) {
            window.tidioChatApi?.show?.();
          } else {
            window.tidioChatApi?.hide?.();
          }
        };
      } else if (shouldShowChat) {
        window.tidioChatApi?.show?.();
      } else {
        window.tidioChatApi?.hide?.();
      }
    };

    loadTidioScript();

    return () => {
      // Oculta el chat al desmontar si es necesario
      window.tidioChatApi?.hide?.();
    };
  }, [shouldShowChat]);

  return <>{children}</>;
};

export default App;
