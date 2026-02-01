import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function TopBanner() {
    return (
        <div className="h-9 w-full bg-violet-100/90 text-[11px] sm:text-xs font-medium text-violet-900 flex justify-between items-center px-4 md:px-8 border-b border-violet-200/50 relative">
            {/* Left: Navigation Links */}
            <div className="hidden sm:flex items-center gap-1 z-10">
                <span className="opacity-90">For</span>
                <Link href="/children" className="hover:underline opacity-90 hover:opacity-100 transition-opacity">Children</Link>
                <span className="opacity-90"> / </span>
                <Link href="/parents" className="hover:underline opacity-90 hover:opacity-100 transition-opacity">Parents</Link>
                <span className="opacity-90"> / </span>
                <Link href="/institutions" className="hover:underline opacity-90 hover:opacity-100 transition-opacity">Institutions</Link>
            </div>

            {/* Mobile Only Left Placeholder */}
            <div className="sm:hidden text-[10px] opacity-90 z-10">
                Family Protection
            </div>

            {/* Center: Promo Text (Absolute Centered) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none">
                <span className="opacity-90 pointer-events-auto">Get complete online protection for your family. </span>
                <span className="font-bold underline decoration-violet-400 decoration-2 underline-offset-2 ml-1 cursor-pointer hover:text-violet-950 transition-colors pointer-events-auto">
                    Join our Pilot Study
                </span>
            </div>

            {/* Right: Secondary Action / Info */}
            <div className="flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity cursor-pointer z-10">
                <span className="hidden sm:inline">Join Now</span>
                <ArrowRight className="w-3 h-3" />
            </div>
        </div>
    );
}
