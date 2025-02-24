import { Outlet } from "react-router";

import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

import "./styles.css";

export default function MainLayout() {
  return (
    <div>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
