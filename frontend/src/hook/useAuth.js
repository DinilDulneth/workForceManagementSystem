import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Custom Hook for Authentication
export const useAuth = (email, name) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!email || !name) {
        // User is not authenticated
        toast.error("Unauthorized! Redirecting to login...", {
          position: "top-right",
          autoClose: 2000
        });

        // Debounce redirect to avoid multiple calls
        setTimeout(() => {
          navigate("/UserLogin");
        }, 3000);
      } else {
        // User is authenticated
        setIsAuthenticated(true);

        toast.success(`Welcome back, ${name}!`, {
          position: "top-right",
          autoClose: 3000
        });
      }
    };

    checkAuthentication();
  }, [email, name, navigate]);

  return isAuthenticated;
};
