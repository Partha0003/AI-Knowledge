"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Compass, ChevronDown } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import type { DomainRole } from "@/types";

const navLinks = [
  { href: "/dashboard", label: "Organization Overview" },
  { href: "/upload", label: "Upload" },
  { href: "/insights", label: "Insights" },
  { href: "/alerts", label: "Alerts" },
  { href: "/knowledge-graph", label: "Knowledge Graph" },
  { href: "/learning", label: "Knowledge Campus" },
];

const ROLES: DomainRole[] = ["Finance", "Operations", "HR", "Sales", "Legal", "IT"];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const role = useAppStore((s) => s.role);
  const setRole = useAppStore((s) => s.setRole);
  const [roleOpen, setRoleOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isPublicPage = pathname === "/" || pathname === "/login";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRoleOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSwitchRole(newRole: DomainRole) {
    setRole(newRole);
    setRoleOpen(false);
    router.push(`/dashboard/${newRole.toLowerCase()}`);
  }

  if (isPublicPage) return null;

  return (
    <nav className="bg-slate-900/95 border-b border-slate-700/50 sticky top-0 z-50">
      <div className="layout-container mx-auto">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors">
              <Compass className="w-5 h-5" />
              <span className="font-semibold">AI Knowledge Compass</span>
            </Link>
            <div className="hidden md:flex gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {role && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setRoleOpen(!roleOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-medium text-white"
                >
                  {role}
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${roleOpen ? "rotate-180" : ""}`} />
                </button>
                {roleOpen && (
                  <div className="absolute right-0 mt-1 py-1 w-40 bg-slate-800 rounded-xl shadow-lg border border-slate-700 z-50">
                    {ROLES.map((r) => (
                      <button
                        key={r}
                        onClick={() => handleSwitchRole(r)}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-700 transition-colors rounded-lg mx-1 ${
                          role === r ? "text-blue-400 font-medium" : "text-slate-300"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <Link href="/" className="px-3 py-2 text-sm text-slate-400 hover:text-white rounded-lg transition-colors">
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
