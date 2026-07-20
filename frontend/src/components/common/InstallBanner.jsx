import { useState } from "react";
import { X, Download, Share } from "lucide-react";
import { useInstallPrompt } from "../../hooks/useInstallPrompt";

export default function InstallBanner() {
  const { canInstall, isIos, installed, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem("installBannerDismissed") === "true"
  );

  const dismiss = () => {
    sessionStorage.setItem("installBannerDismissed", "true");
    setDismissed(true);
  };

  if (installed || dismissed) return null;
  if (!canInstall && !isIos) return null; // nothing useful to show (already installed / unsupported browser)

  return (
    <div className="mx-4 mt-4 flex items-center justify-between gap-3 rounded-stamp border border-ember/30 bg-ember/10 p-3 text-sm">
      <div className="flex items-center gap-2 text-pine dark:text-paper">
        {isIos ? <Share size={16} className="shrink-0" /> : <Download size={16} className="shrink-0" />}
        {isIos ? (
          <span>
            Install Trailmark: tap <strong>Share</strong> → <strong>Add to Home Screen</strong>
          </span>
        ) : (
          <span>Install Trailmark on this device for the full app experience</span>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {!isIos && (
          <button
            onClick={promptInstall}
            className="rounded-stamp bg-ember px-3 py-1.5 text-xs font-medium text-paper"
          >
            Install
          </button>
        )}
        <button onClick={dismiss} aria-label="Dismiss">
          <X size={16} className="text-pine/50 dark:text-paper/40" />
        </button>
      </div>
    </div>
  );
}
