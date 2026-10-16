"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ArrowUpRight, Menu, Moon, Sun } from "lucide-react";
import { navigation } from "@/content/portfolio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="theme-toggle"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle light and dark theme"
      title="Toggle light and dark theme"
    >
      <Sun className="theme-sun" size={19} />
      <Moon className="theme-moon" size={19} />
    </Button>
  );
}

export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a
      href="#home"
      className={`brand${footer ? " brand-footer" : ""}`}
      aria-label="Prince Malonzo, back to top"
    >
      <span className="brand-mark">
        pm<span>.</span>
      </span>
      <span className="brand-wordmark">
        prince<span className="brand-dot">.</span>malonzo
      </span>
    </a>
  );
}

export function Header() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => {
            const isActive = active === item.href.slice(item.href.indexOf("#"));
            return (
              <a
                key={item.href}
                href={item.href}
                className={isActive ? "active" : ""}
                aria-current={isActive ? "location" : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <Button asChild size="sm" variant="outline" className="header-contact">
            <a href="#contact">
              Let’s talk <ArrowUpRight size={15} />
            </a>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mobile-menu-trigger"
                aria-label="Open navigation"
              >
                <Menu size={22} />
              </Button>
            </DialogTrigger>
            <DialogContent className="mobile-navigation">
              <DialogTitle className="sr-only">Navigation</DialogTitle>
              <DialogDescription className="sr-only">
                Explore Prince Malonzo’s portfolio.
              </DialogDescription>
              <span className="mobile-brand">
                prince<span>.</span>malonzo
              </span>
              <nav aria-label="Mobile navigation">
                {navigation.map((item, i) => (
                  <DialogClose key={item.href} asChild>
                    <a href={item.href}>
                      <span className="mono">0{i + 1}</span>
                      {item.label}
                      <ArrowUpRight size={24} />
                    </a>
                  </DialogClose>
                ))}
              </nav>
              <p className="eyebrow">Full Stack Developer · Manila, PH</p>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
