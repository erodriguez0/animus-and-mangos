"use client"

import Autoplay from "embla-carousel-autoplay"
import Link from "next/link"

import { CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

interface BannerCarouselProps {}

const BannerCarousel = () => {
  return (
    <div className="group relative w-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 10000,
          }),
        ]}
      >
        <CarouselContent>
          <CarouselItem className="flex aspect-video h-auto w-full items-center justify-center bg-muted">
            <Link
              href="/"
              className="flex h-full w-full items-center justify-center"
            >
              1
            </Link>
          </CarouselItem>
          <CarouselItem className="flex aspect-video h-auto w-full items-center justify-center bg-muted">
            <Link
              href="/"
              className="flex h-full w-full items-center justify-center"
            >
              2
            </Link>
          </CarouselItem>
          <CarouselItem className="flex aspect-video h-auto w-full items-center justify-center bg-muted">
            <Link
              href="/"
              className="flex h-full w-full items-center justify-center"
            >
              3
            </Link>
          </CarouselItem>
        </CarouselContent>

        <CarouselPrevious className="absolute left-4 border-2 border-primary opacity-0 transition-all group-hover:opacity-100" />
        <CarouselNext className="absolute right-4 border-2 border-primary opacity-0 transition-all group-hover:opacity-100" />
      </Carousel>
    </div>
  )
}

export default BannerCarousel
