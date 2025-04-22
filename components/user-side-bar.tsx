"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LinkItem {
  href: string;
  label: string;
}

interface UserSideBarProps {
  links: LinkItem[];
}

const UserSideBar: React.FC<UserSideBarProps> = ({ links }) => {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-[#A35C7A] text-white p-5">
      <nav>
        <ul className="space-y-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block px-4 py-2 rounded-lg transition ${
                  pathname === link.href
                    ? "bg-white text-[#A35C7A]"
                    : "hover:bg-[#92486A]"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default UserSideBar;
