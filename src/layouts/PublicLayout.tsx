import { Outlet, useLocation } from "react-router-dom";
import { SiteHeader } from "../components/shared/SiteHeader";
import { SiteFooter } from "../components/shared/SiteFooter";
import { BusinessChatbot } from "../features/chatbot/components/BusinessChatbot";

export function PublicLayout() {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-50 -translate-y-24 rounded-lg bg-emerald-900 px-5 py-3 text-white focus:translate-y-0"
      >
        Saltar al contenido
      </a>
      <SiteHeader key={pathname} />
      <div className="flex-1">
        <Outlet />
      </div>
      <SiteFooter />
      {pathname !== "/establecimientos" && <BusinessChatbot />}
    </div>
  );
}
