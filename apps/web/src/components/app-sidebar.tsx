"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  ClipboardList,
  Files,
  Heart,
  Home,
  LayoutDashboard,
  Settings,
  Store,
  WalletCards,
} from "lucide-react";

const weddingMenuItems = [
  {
    title: "Dashboard",
    href: "/wedding/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Plan",
    href: "/wedding/plan",
    icon: ClipboardList,
  },
  {
    title: "Budget",
    href: "/wedding/budget",
    icon: WalletCards,
  },
  {
    title: "Vendors",
    href: "/wedding/vendors",
    icon: Store,
  },
  {
    title: "Documents",
    href: "/wedding/documents",
    icon: Files,
  },
];

const menuItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Wedding",
    href: "/wedding",
    icon: Heart,
    children: weddingMenuItems,
  },
  {
    title: "Archive",
    href: "/archive",
    icon: Archive,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-border bg-background sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r">
      <div className="border-border flex h-16 items-center border-b px-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-md text-sm font-semibold">
            WB
          </div>
          <span className="truncate text-sm font-semibold">Wang Bang</span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {menuItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <div key={item.href} className="space-y-1">
              <SidebarLink item={item} active={active} />
              {item.children && active ? (
                <div className="ml-4 flex flex-col gap-1 border-l pl-3">
                  {item.children.map((child) => (
                    <SidebarLink
                      key={child.href}
                      item={child}
                      active={pathname === child.href}
                      nested
                    />
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function SidebarLink({
  item,
  active,
  nested = false,
}: {
  item: (typeof menuItems)[number];
  active: boolean;
  nested?: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={[
        "flex h-10 items-center justify-start gap-3 rounded-md px-3 font-medium transition-colors",
        nested ? "text-[13px]" : "text-sm",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      ].join(" ")}
      aria-label={item.title}
      aria-current={active ? "page" : undefined}
    >
      <item.icon className="size-4 shrink-0" aria-hidden="true" />
      <span>{item.title}</span>
    </Link>
  );
}
