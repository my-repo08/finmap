import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import AppProviders from "./app/AppProviders";
import "./index.css";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <AppProviders>
    <App />
    <Toaster />
  </AppProviders>
);
