import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { pagesConfig } from "@/pages.config";

export default function NavigationTracker() {
  const location = useLocation();
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log("Current page:", location.pathname);
  }, [location]);

  return null;
}
