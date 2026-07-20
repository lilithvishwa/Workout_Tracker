import { useCallback } from "react";
import axiosClient from "../api/axiosClient";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function usePushNotifications() {
  const enablePush = useCallback(async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      alert("Push notifications aren't supported on this browser.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const { data } = await axiosClient.get("/notifications/vapid-public-key");
    if (!data.publicKey) {
      console.warn("VAPID public key not configured on backend yet.");
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(data.publicKey),
    });

    await axiosClient.post("/notifications/subscribe", subscription.toJSON());
  }, []);

  return { enablePush };
}
