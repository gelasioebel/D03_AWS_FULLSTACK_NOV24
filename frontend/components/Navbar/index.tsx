import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import "./styles.css";

type Navlink = {
  label: string;
  href: string;
};

const navlinks: Navlink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Register",
    href: "/register",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "About us",
    href: "/about-us",
  },
];

export function Navbar() {
  return (
    <header className="navbar">
      <img
        className="navbar-logo"
        src="/logo.svg"
        alt="Blumen Logo"
        draggable={false}
      />

      <ul className="navbar-links">
        {navlinks.map((link, index) => (
          <li key={index}>
            <a href={link.href} className="raleway">
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Clerk login */}
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
