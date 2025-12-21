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
        className="w-full max-w-6xl"
      >
        <CarouselContent className="-ml-4 pb-4">
          {items.map((t, index) => (
            <CarouselItem key={`${t.author}-${index}`} className="pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3">
              <div className="h-full p-1">
                <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl overflow-hidden">
                  <CardContent className="flex flex-col justify-between h-full p-8 md:p-10">
                    <div>
                      <Quote className="w-8 h-8 text-primary/20 mb-6" />
                      <p className="text-lg text-text italic leading-relaxed font-medium">
                        &quot;{t.quote}&quot;
                      </p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-border/50">
                      <p className="font-bold text-text text-base">{t.author}</p>
                      <p className="text-sm text-text-dim uppercase tracking-wider font-medium mt-1">
                        {t.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-4 mt-8">
          <CarouselPrevious variant="outline" className="static translate-y-0 translate-x-0 h-12 w-12 border-border hover:bg-surface hover:text-primary transition-colors" />
          <CarouselNext variant="outline" className="static translate-y-0 translate-x-0 h-12 w-12 border-border hover:bg-surface hover:text-primary transition-colors" />
        </div>
      </Carousel>
    </div>
  );
}
