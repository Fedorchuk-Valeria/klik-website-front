declare global {
  interface Window {
    fbq?: (command: "track", eventName: string) => void;
  }
}

export {};
