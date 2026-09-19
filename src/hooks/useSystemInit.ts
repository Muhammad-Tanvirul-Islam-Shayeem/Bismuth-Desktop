import { useEffect } from "react";
import { checkElevation, getOsInfo } from "@/bridge";
import { useElevationStore } from "@/stores";

/**
 * Hook that initializes system state on app mount:
 * - Checks admin elevation status
 * - Loads OS info
 * - Stores both in the global elevation store
 */
export function useSystemInit(): void {
  const { setElevation, setOsInfo } = useElevationStore();

  useEffect(() => {
    async function init() {
      try {
        const [elev, os] = await Promise.all([checkElevation(), getOsInfo()]);
        setElevation(elev.is_elevated, elev.process_arch);
        setOsInfo(os.version, os.build, os.edition);
      } catch (err) {
        console.error("[Bismuth] Failed to initialize system info:", err);
      }
    }
    init();
  }, [setElevation, setOsInfo]);
}