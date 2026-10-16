import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="not-found">
      <span className="eyebrow">404 / A small detour</span>
      <h1>
        This page took
        <br />a different path<span className="accent">.</span>
      </h1>
      <p>Let’s get you back to the good stuff.</p>
      <Button asChild>
        <Link href="/">
          Back to the portfolio
          <ArrowUpRight size={18} />
        </Link>
      </Button>
    </main>
  );
}
