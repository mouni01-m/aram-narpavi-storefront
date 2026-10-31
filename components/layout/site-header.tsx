"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { BrandMark } from "@/components/layout/brand-mark";
import { useCart } from "@/components/cart/cart-provider";

const navigationItems = [
  { label: "Shop", href: "/shop" },
  { label: "Bestsellers", href: "/best-sellers" },
  { label: "Combos", href: "/combos" },
  { label: "Heritage Sale", href: "/heritage-sale" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const isActive = (href: string) => pathname === href || (href === "/shop" && (pathname.startsWith("/collections/") || pathname.startsWith("/products/")));

  useEffect(() => {
    if (!menuOpen) return;

    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target) && !menuButtonRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    function handleResize() {
      if (window.matchMedia("(min-width: 801px)").matches) {
        setMenuOpen(false);
        desktopNavRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }

  return (
    <>
      <AnnouncementBar />
      <header className="site-header">
        <div className="container header-inner">
          <BrandMark />
          <nav ref={desktopNavRef} className="desktop-nav" aria-label="Main navigation">
            <Link className="nav-link" href="/" aria-current={pathname === "/" ? "page" : undefined}>Home</Link>
            {navigationItems.map((item) => <Link className="nav-link" href={item.href} key={item.label} aria-current={isActive(item.href) ? "page" : undefined}>{item.label}</Link>)}
          </nav>
          <div className="header-actions">
            <Link className="cart-link" href="/cart" aria-label={`Preview cart, ${itemCount} total ${itemCount === 1 ? "unit" : "units"}`}>
              Cart <span aria-hidden="true">{itemCount}</span>
            </Link>
            <button
              ref={menuButtonRef}
              className="menu-button"
              type="button"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span aria-hidden="true">{menuOpen ? "Close" : "Menu"}</span>
            </button>
          </div>
        </div>
        <nav
          ref={menuRef}
          className="mobile-nav"
          id="mobile-navigation"
          aria-label="Mobile navigation"
          hidden={!menuOpen}
        >
          <ul className="mobile-nav-list">
            <li><Link className="nav-link" href="/" onClick={closeMenu} aria-current={pathname === "/" ? "page" : undefined}>Home</Link></li>
            {navigationItems.map((item) => (
              <li key={item.label}><Link className="nav-link" href={item.href} onClick={closeMenu} aria-current={isActive(item.href) ? "page" : undefined}>{item.label}</Link></li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}
