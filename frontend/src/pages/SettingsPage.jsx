import { useState } from "react";
import toast from "react-hot-toast";
import { updateReminderSettingsApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { usePushNotifications } from "../hooks/usePushNotifications";

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const { dark, toggle } = useThemeStore();
  const { enablePush } = usePushNotifications();
  const [reminderTime, setReminderTime] = useState("20:00");

  const saveReminder = async () => {
    try {
      await updateReminderSettingsApi({ reminderTime, reminderEnabled: true });
      toast.success("Reminder time saved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    }
  };

  const handleEnablePush = async () => {
    try {
      await enablePush();
      toast.success("Notifications enabled on this device");
    } catch {
      toast.error("Couldn't enable notifications");
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 p-4 pb-24 sm:pb-8">
      <h1 className="font-display text-2xl font-bold text-pine dark:text-paper">Settings</h1>

      <div className="rounded-stamp border border-pine/10 bg-white/60 p-5 dark:bg-dusk-card dark:border-paper/10">
        <h3 className="font-display font-semibold text-pine dark:text-paper">
          Evening reminder
        </h3>
        <p className="mt-1 text-sm text-pine/60 dark:text-paper/50">
          If you haven't logged today's workout by this time, we'll notify you.
        </p>
        <div className="mt-3 flex gap-2">
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="rounded-stamp border border-pine/20 bg-transparent p-2 text-sm dark:border-paper/20"
          />
          <button onClick={saveReminder} className="rounded-stamp bg-pine px-4 py-2 text-sm text-paper">
            Save
          </button>
        </div>
        <button
          onClick={handleEnablePush}
          className="mt-3 w-full rounded-stamp bg-ember px-4 py-2 text-sm font-medium text-paper"
        >
          Enable push notifications on this device
        </button>
        <p className="mt-2 text-xs text-pine/40 dark:text-paper/30">
          Enable this on each device (laptop + phone) separately to get reminders everywhere.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-stamp border border-pine/10 bg-white/60 p-5 dark:bg-dusk-card dark:border-paper/10">
        <div>
          <h3 className="font-display font-semibold text-pine dark:text-paper">Dark mode</h3>
          <p className="text-sm text-pine/60 dark:text-paper/50">Easier on the eyes at night.</p>
        </div>
        <button
          onClick={toggle}
          className={`h-7 w-12 rounded-full transition ${dark ? "bg-ember" : "bg-pine/20"}`}
        >
          <span
            className={`block h-5 w-5 translate-x-1 rounded-full bg-paper transition-transform ${
              dark ? "translate-x-6" : ""
            }`}
          />
        </button>
      </div>

      <div className="rounded-stamp border border-pine/10 bg-white/60 p-5 dark:bg-dusk-card dark:border-paper/10">
        <p className="text-sm text-pine/70 dark:text-paper/60">Logged in as {user?.email}</p>
        <button onClick={logout} className="mt-3 rounded-stamp bg-clay px-4 py-2 text-sm text-paper">
          Log out
        </button>
      </div>
    </div>
  );
}
