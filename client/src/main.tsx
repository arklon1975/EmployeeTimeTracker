import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add required Google Fonts for the design
const linkElement = document.createElement("link");
linkElement.rel = "stylesheet";
linkElement.href = "https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;500;600;700&display=swap";

const iconLinkElement = document.createElement("link");
iconLinkElement.rel = "stylesheet";
iconLinkElement.href = "https://fonts.googleapis.com/icon?family=Material+Icons";

document.head.appendChild(linkElement);
document.head.appendChild(iconLinkElement);

// Update the title
document.title = "Call Center Time Tracker";

createRoot(document.getElementById("root")!).render(<App />);
