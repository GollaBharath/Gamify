import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { ThemeProvider } from "./Context/ThemeContext.jsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ErrorBoundary>
			<ThemeProvider>
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
			</ThemeProvider>
		</ErrorBoundary>
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
