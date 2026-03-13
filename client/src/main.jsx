import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import App from "./App.jsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
			<ToastContainer
				position="bottom-right"
				autoClose={3500}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				pauseOnHover
				theme="dark"
			/>
		</BrowserRouter>
	</React.StrictMode>,
);

if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("/gamify-sw.js")
			.then((reg) => console.log("SW registered", reg))
			.catch((err) => console.error("SW failed", err));
	});
}
