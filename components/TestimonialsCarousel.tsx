"use client";

import { useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

export default function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const items = useMemo(() => testimonials, [testimonials]);

  return (
    <div className="w-full flex justify-center">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full max-w-6xl relative"
      >
        {/* Left Arrow */}
        <CarouselPrevious variant="outline" className="absolute left-[-30px] top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 border-border hover:bg-surface hover:text-primary transition-colors z-10 hidden md:flex" />

        <CarouselContent className="-ml-4 pb-2">
          {items.map((t, index) => (
            <CarouselItem key={`${t.author}-${index}`} className="pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3">
              <div className="h-full p-1">
                <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden hover:opacity-0">
                  <CardContent className="flex flex-col justify-between h-full p-5 md:p-6">
                    <div>
                      <Quote className="w-5 h-5 text-primary/15 mb-3" />
                      <p className="text-base text-text italic leading-relaxed font-medium">
                        &quot;{t.quote}&quot;
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <p className="font-bold text-text text-sm">{t.author}</p>
                      <p className="text-xs text-text-dim uppercase tracking-wider font-medium mt-0.5">
                        {t.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Right Arrow */}
        <CarouselNext variant="outline" className="absolute right-[-30px] top-1/2 -translate-y-1/2 translate-x-1/2 h-10 w-10 border-border hover:bg-surface hover:text-primary transition-colors z-10 hidden md:flex" />

        {/* Mobile navigation (centered below) */}
        <div className="flex justify-center gap-4 mt-4 md:hidden">
          <CarouselPrevious variant="outline" className="static translate-y-0 translate-x-0 h-10 w-10 border-border hover:bg-surface hover:text-primary transition-colors" />
          <CarouselNext variant="outline" className="static translate-y-0 translate-x-0 h-10 w-10 border-border hover:bg-surface hover:text-primary transition-colors" />
        </div>
      </Carousel>
    </div>
  );
}
