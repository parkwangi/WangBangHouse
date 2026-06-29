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
    <aside className="border-border bg-background sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r md:flex">
      <div className="border-border flex h-16 items-center border-b px-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-md text-sm font-semibold">
            WB
          </div>
          <span className="hidden truncate text-sm font-semibold md:block">
            Wang Bang
          </span>
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

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <>
      <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/75 sticky top-0 z-40 flex h-14 items-center justify-between border-b px-4 backdrop-blur md:hidden">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-md text-xs font-semibold">
            WB
          </div>
          <span className="truncate text-sm font-semibold">Wang Bang</span>
        </Link>
      </header>

      {pathname.startsWith("/wedding") ? (
        <nav className="border-border bg-background sticky top-14 z-30 flex gap-2 overflow-x-auto border-b px-3 py-2 md:hidden">
          {weddingMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
              ].join(" ")}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              <item.icon className="size-4" aria-hidden="true" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      ) : null}

      <nav className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/75 fixed inset-x-0 bottom-0 z-50 grid h-16 grid-cols-4 border-t px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {menuItems.map((item) => (
          <MobileNavigationLink
            key={item.href}
            item={item}
            active={
              item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href)
            }
          />
        ))}
      </nav>
    </>
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
        "flex h-10 items-center justify-center rounded-md font-medium transition-colors md:justify-start md:gap-3 md:px-3",
        nested ? "text-[13px]" : "text-sm",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      ].join(" ")}
      aria-label={item.title}
      aria-current={active ? "page" : undefined}
    >
      <item.icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="hidden md:inline">{item.title}</span>
    </Link>
  );
}

function MobileNavigationLink({
  item,
  active,
}: {
  item: (typeof menuItems)[number];
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={[
        "flex min-w-0 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-medium transition-colors",
        active ? "text-foreground" : "text-muted-foreground",
      ].join(" ")}
      aria-label={item.title}
      aria-current={active ? "page" : undefined}
    >
      <item.icon
        className={[
          "size-5 shrink-0",
          active ? "stroke-[2.5]" : "stroke-[2]",
        ].join(" ")}
        aria-hidden="true"
      />
      <span className="max-w-full truncate">{item.title}</span>
    </Link>
  );
}
