"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  Camera,
  Clock,
  MapPin,
  Pencil,
  Shield,
  Star,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { AvatarCropDialog } from "@/components/profile/avatar-crop-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Pill } from "@/components/ui/pill";
import { Spinner } from "@/components/ui/spinner";
import {
  type ProfileHeaderFormValues,
  profileHeaderSchema,
} from "@/lib/schemas/profile";

export interface ProfileData {
  name: string;
  username: string;
  avatar: string;
  statusEmoji?: string;
  statusText?: string;
  profession: string;
  isOnline: boolean;
  verified: boolean;
  rating: number;
  reviews: number;
  location: string;
  joinedDate: string;
  hourlyRate: number;
  completedJobs: number;
  responseTime: string;
}

type ProfileHeaderProps = {
  profile: ProfileData;
  onSave: (data: ProfileHeaderFormValues) => Promise<void>;
  onAvatarChange: (blob: Blob) => Promise<void>;
  hasMainProfile?: boolean;
};

export function ProfileHeader({
  profile,
  onSave,
  onAvatarChange,
  hasMainProfile = true,
}: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show worker-specific fields when the SubProfile context is set OR when
  // real worker data already exists in the DB (profession non-empty).
  const showWorkerInfo = hasMainProfile || !!profile.profession;

  const form = useForm<ProfileHeaderFormValues>({
    resolver: zodResolver(profileHeaderSchema),
    defaultValues: {
      name: profile.name,
      statusEmoji: profile.statusEmoji || "",
      statusText: profile.statusText || "",
      profession: profile.profession,
      location: profile.location,
    },
  });

  const handleEdit = () => {
    form.reset({
      name: profile.name,
      statusEmoji: profile.statusEmoji || "",
      statusText: profile.statusText || "",
      profession: profile.profession,
      location: profile.location,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.reset();
    setAvatarPreview(null);
    setIsEditing(false);
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSave(values);
    setIsEditing(false);
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset so the same file can be re-selected after cancel
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setRawImageSrc(event.target?.result as string);
      setCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropSave = async (blob: Blob) => {
    // Show the cropped result immediately as a local preview
    setAvatarPreview(URL.createObjectURL(blob));
    setCropDialogOpen(false);
    await onAvatarChange(blob);
  };

  const handleCropCancel = () => {
    setCropDialogOpen(false);
    setRawImageSrc("");
  };

  const displayAvatar = avatarPreview || profile.avatar;

  return (
  <>
    <Card className="mb-6">
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar with edit overlay */}
          <button
            type="button"
            className="relative group cursor-pointer self-start border-0 bg-transparent p-0"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Change profile picture"
          >
            <Avatar className="w-32 h-32">
              <AvatarImage
                src={displayAvatar || undefined}
                alt={profile.name}
              />
              <AvatarFallback className="bg-blue-800 text-white text-5xl">
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
              <span className="text-white text-sm mt-1">Edit</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </button>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              {isEditing ? (
                /* Edit Mode */
                <form onSubmit={handleSubmit} className="flex-1">
                  <FieldGroup>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Controller
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                          <Field data-invalid={!!fieldState.error}>
                            <FieldLabel htmlFor="name">Name</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                id="name"
                                placeholder="Your name"
                                {...field}
                                disabled={form.formState.isSubmitting}
                                aria-invalid={!!fieldState.error}
                              />
                            </InputGroup>
                            <FieldError>{fieldState.error?.message}</FieldError>
                          </Field>
                        )}
                      />

                      <Controller
                        control={form.control}
                        name="profession"
                        render={({ field, fieldState }) => (
                          <Field data-invalid={!!fieldState.error}>
                            <FieldLabel htmlFor="profession">
                              Profession
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                id="profession"
                                placeholder="Your profession"
                                {...field}
                                disabled={form.formState.isSubmitting}
                                aria-invalid={!!fieldState.error}
                              />
                            </InputGroup>
                            <FieldError>{fieldState.error?.message}</FieldError>
                          </Field>
                        )}
                      />

                      <Controller
                        control={form.control}
                        name="statusEmoji"
                        render={({ field, fieldState }) => (
                          <Field data-invalid={!!fieldState.error}>
                            <FieldLabel htmlFor="statusEmoji">
                              Status Emoji
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                id="statusEmoji"
                                placeholder="🔧"
                                {...field}
                                disabled={form.formState.isSubmitting}
                                aria-invalid={!!fieldState.error}
                              />
                            </InputGroup>
                            <FieldError>{fieldState.error?.message}</FieldError>
                          </Field>
                        )}
                      />

                      <Controller
                        control={form.control}
                        name="statusText"
                        render={({ field, fieldState }) => (
                          <Field data-invalid={!!fieldState.error}>
                            <FieldLabel htmlFor="statusText">
                              Status Message
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                id="statusText"
                                placeholder="What are you up to?"
                                {...field}
                                disabled={form.formState.isSubmitting}
                                aria-invalid={!!fieldState.error}
                              />
                            </InputGroup>
                            <FieldError>{fieldState.error?.message}</FieldError>
                          </Field>
                        )}
                      />

                      <Controller
                        control={form.control}
                        name="location"
                        render={({ field, fieldState }) => (
                          <Field data-invalid={!!fieldState.error}>
                            <FieldLabel htmlFor="location">Location</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                id="location"
                                placeholder="City, Country"
                                {...field}
                                disabled={form.formState.isSubmitting}
                                aria-invalid={!!fieldState.error}
                              />
                            </InputGroup>
                            <FieldError>{fieldState.error?.message}</FieldError>
                          </Field>
                        )}
                      />

                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleCancel}
                        disabled={form.formState.isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="secondary"
                        type="submit"
                        size="sm"
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting ? (
                          <>
                            <Spinner className="mr-2" />
                            Saving...
                          </>
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </div>
                  </FieldGroup>
                </form>
              ) : (
                /* Display Mode */
                <>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {profile.name}
                      {profile.username && (
                        <span className="text-sm text-muted-foreground font-normal ml-2">
                          @{profile.username}
                        </span>
                      )}
                    </h1>
                    {(profile.statusEmoji || profile.statusText) && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {profile.statusEmoji && (
                          <span className="mr-2">{profile.statusEmoji}</span>
                        )}
                        {profile.statusText}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Pill
                        variant={profile.isOnline ? "success" : "error"}
                        dot
                      >
                        {profile.isOnline ? "Online" : "Offline"}
                      </Pill>
                      {profile.verified && (
                        <Pill variant="primary">
                          <Shield />
                          Verified
                        </Pill>
                      )}
                      <span className={showWorkerInfo ? "contents" : "hidden"}>
                        •
                        <span className="text-sm text-muted-foreground">
                          {profile.profession}
                        </span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div
                        className={
                          showWorkerInfo ? "flex items-center gap-1" : "hidden"
                        }
                      >
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{profile.rating}</span>
                        <span className="text-muted-foreground">
                          ({profile.reviews} reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        Joined {profile.joinedDate}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEdit}
                    className="w-full md:w-auto"
                  >
                    <Pencil />
                    Edit
                  </Button>
                </>
              )}
            </div>

            {/* Stats - visible only when not editing and profile exists */}
            <div
              className={
                !isEditing && showWorkerInfo
                  ? "grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border"
                  : "hidden"
              }
            >
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Jobs Completed</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {profile.completedJobs}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Response Time</span>
                </div>
                <p className="text-lg font-bold text-foreground">
                  {profile.responseTime}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {rawImageSrc && (
      <AvatarCropDialog
        open={cropDialogOpen}
        imageSrc={rawImageSrc}
        onCancel={handleCropCancel}
        onSave={handleCropSave}
      />
    )}
  </>
  );
}
