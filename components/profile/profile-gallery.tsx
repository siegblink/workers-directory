"use client";

import { ChevronLeft, ChevronRight, Images, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export interface PortfolioItem {
  id: number;
  image: string;
  title: string;
  description: string;
  price?: number;
}

interface ProfileGalleryProps {
  portfolio: PortfolioItem[];
}

export function ProfileGallery({ portfolio }: ProfileGalleryProps) {
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (portfolio.length === 0) {
    return (
      <Card className="mb-6">
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Gallery</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile/gallery">
                <Pencil />
                Edit
              </Link>
            </Button>
          </div>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Images className="h-6 w-6" />
              </EmptyMedia>
              <EmptyTitle>No Portfolio Items Yet</EmptyTitle>
              <EmptyDescription>
                Add images to showcase your work and attract more customers.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile/gallery">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Gallery Items
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-6">
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Gallery</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedImageIndex(0);
                  setGalleryModalOpen(true);
                }}
              >
                View All ({portfolio.length})
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile/gallery">
                  <Pencil />
                  Edit
                </Link>
              </Button>
            </div>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {portfolio.map((item, index) => (
                <CarouselItem
                  key={item.id}
                  className="basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <button
                    type="button"
                    className="relative group overflow-hidden rounded-lg cursor-pointer border border-border hover:border-primary transition-all w-full"
                    onClick={() => {
                      setSelectedImageIndex(index);
                      setGalleryModalOpen(true);
                    }}
                  >
                    <div className="aspect-video relative bg-muted">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p className="text-white font-semibold text-sm">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 " />
            <CarouselNext className="right-2" />
          </Carousel>
        </CardContent>
      </Card>

      {/* Gallery View Modal */}
      <Dialog open={galleryModalOpen} onOpenChange={setGalleryModalOpen}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[95vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="flex items-center gap-2">
              <span className="text-foreground">
                {portfolio[selectedImageIndex]?.title}
              </span>
              <span className="text-sm text-muted-foreground font-normal">
                {selectedImageIndex + 1} / {portfolio.length}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="relative px-4">
            <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
              <Image
                src={portfolio[selectedImageIndex]?.image || "/placeholder.svg"}
                alt={portfolio[selectedImageIndex]?.title || "Gallery image"}
                fill
                className="object-cover"
                priority
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm rounded-full"
              onClick={() =>
                setSelectedImageIndex(
                  (prev) => (prev - 1 + portfolio.length) % portfolio.length,
                )
              }
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm rounded-full"
              onClick={() =>
                setSelectedImageIndex((prev) => (prev + 1) % portfolio.length)
              }
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          <div className="px-4 py-4">
            <p className="text-muted-foreground leading-relaxed">
              {portfolio[selectedImageIndex]?.description}
            </p>
            {portfolio[selectedImageIndex]?.price && (
              <p className="text-2xl font-bold text-primary mt-3">
                ${portfolio[selectedImageIndex].price.toLocaleString()}
              </p>
            )}
          </div>

          <div className="p-4 pt-2">
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {portfolio.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-video rounded-md overflow-hidden border-2 transition-all ${
                    index === selectedImageIndex
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
