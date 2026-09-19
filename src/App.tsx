import { useEffect } from "react";
import { useSystemInit } from "@/hooks";
import { useUIStore } from "@/stores";
import { applyTheme } from "@/themes";
import { registerAllModules } from "@/modules";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MainCanvas } from "@/components/layout/MainCanvas";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { ConsoleDrawer } from "@/components/layout/ConsoleDrawer";
import { ElevationBanner } from "@/components/ui/ElevationBanner";

export default function App() {
  useSystemInit();
  registerAllModules();

  const { currentTheme, toggleCommandPalette, sidebarCollapsed } = useUIStore();

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleCommandPalette();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleCommandPalette]);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div
        className="flex flex-col flex-1 min-w-0"
        style={{ marginLeft: sidebarCollapsed ? "56px" : "240px" }}
      >
        <Header />
        <ElevationBanner />
        <MainCanvas />
      </div>
      <CommandPalette />
      <ConsoleDrawer />
    </div>
  );
}