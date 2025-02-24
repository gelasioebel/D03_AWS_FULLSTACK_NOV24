import { Section } from "../Section";
import "./styles.css";

type Column = {
  title: string;
  children: {
    label: string;
    href: string;
  }[];
};

const contacts = ["compassinho@gmail.com", "+55 41 99999-9999"];

const columns: Column[] = [
  {
    title: "Links",
    children: [
      {
        label: "About us",
        href: "/about-us",
      },
      {
        label: "Products",
        href: "/products",
      },
      {
        label: "Blogs",
        href: "/blogs",
      },
    ],
  },
  {
    title: "Community",
    children: [
      {
        label: "About us",
        href: "/about-us",
      },
      {
        label: "Products",
        href: "/products",
      },
      {
        label: "Blogs",
        href: "/blogs",
      },
    ],
  },
];

export function Footer() {
  return (
    <footer className="footer raleway">
      <Section className="footer-container">
        <main className="footer-content">
          <div className="footer-left">
            <h2 className="footer-title eb-garamond">Blumen</h2>
            {contacts.map((contact, index) => (
              <span key={index} className="footer-contact">{contact}</span>
            ))}
          </div>
          <div className="footer-right">
            {columns.map((column, index) => (
              <div key={index} className="footer-column">
                <h3>{column.title}</h3>
                <ul>
                  {column.children.map((child, childIndex) => (
                    <li key={childIndex}>
                      <a href={child.href}>{child.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </main>
        <div className="footer-bottom">
          <img src="/logo.svg" alt="Logo Blumen" className="footer-logo"/>
          <span className="footer-copyright">Compassinhos &copy;. All rights reserved.</span>
        </div>
      </Section>
    </footer>
  );
}
