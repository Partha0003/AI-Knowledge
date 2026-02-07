import Link from "next/link";
import { Compass } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="layout-container mx-auto py-24">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-700/50 mb-6">
            <Compass className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI Knowledge Compass
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl">
            Intelligent organizational knowledge discovery and role-based delivery
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-colors"
          >
            Enter Knowledge Compass
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
