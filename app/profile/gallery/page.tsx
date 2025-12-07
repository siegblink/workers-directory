"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GalleryAddForm } from "@/components/profile/gallery-add-form";
import {
  type GalleryItem,
  GalleryItemsList,
} from "@/components/profile/gallery-items-list";
import { Button } from "@/components/ui/button";
import type { GalleryItemFormValues } from "@/lib/schemas/profile";

// Mock data - same as profile page
const mockPortfolio: GalleryItem[] = [
  {
    id: 1,
    image: "https://picsum.photos/id/1048/800/600",
    title: "Kitchen Deep Clean",
    description:
      "Complete kitchen cleaning including appliances, cabinets, and floor. All surfaces sanitized and organized.",
    price: 150,
  },
  {
    id: 2,
    image: "https://picsum.photos/id/1067/800/600",
    title: "Home Organization",
    description:
      "Full closet and storage organization with custom solutions. Decluttering and space optimization.",
    price: 200,
  },
  {
    id: 3,
    image: "https://picsum.photos/id/180/800/600",
    title: "Move-out Cleaning",
    description:
      "Comprehensive move-out cleaning service to ensure full deposit return. Every room detailed.",
    price: 350,
  },
];

export default function EditGalleryPage() {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>(mockPortfolio);
  const [isEditingItem, setIsEditingItem] = useState(false);

  const handleItemUpdate = async (
    index: number,
    data: GalleryItemFormValues,
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...data } : item)),
    );
  };

  const handleItemDelete = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemAdd = async (
    data: GalleryItemFormValues,
    imagePreview: string,
  ) => {
    const newItem: GalleryItem = {
      id: Date.now(),
      image: imagePreview,
      ...data,
    };
    setItems((prev) => [...prev, newItem]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        {/* Header */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => router.push("/profile")}
          className="mb-6"
        >
          <ArrowLeft />
          Back to profile
        </Button>

        {/* Two-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
          {/* Left Column: Gallery Items */}
          <GalleryItemsList
            items={items}
            onItemUpdate={handleItemUpdate}
            onItemDelete={handleItemDelete}
            onEditingChange={setIsEditingItem}
          />

          {/* Right Column: Always-Visible Add Form */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <GalleryAddForm
              onItemAdd={handleItemAdd}
              disabled={isEditingItem}
              disabledMessage="Finish or cancel editing before adding new items"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
