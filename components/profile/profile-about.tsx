"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  type ProfileAboutFormValues,
  profileAboutSchema,
} from "@/lib/schemas/profile";
import { EditSectionWrapper } from "./edit-section-wrapper";

interface ProfileAboutProps {
  bio: string;
  skills: string[];
  onSave: (data: ProfileAboutFormValues) => Promise<void>;
}

export function ProfileAbout({ bio, skills, onSave }: ProfileAboutProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const form = useForm<ProfileAboutFormValues>({
    resolver: zodResolver(profileAboutSchema),
    defaultValues: {
      bio,
      skills,
    },
  });

  const currentSkills = form.watch("skills");

  const handleEdit = () => {
    form.reset({ bio, skills });
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.reset({ bio, skills });
    setNewSkill("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const values = form.getValues();
    await onSave(values);
    setIsEditing(false);
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (currentSkills.includes(trimmed)) {
      setNewSkill("");
      return;
    }
    if (currentSkills.length >= 20) return;

    form.setValue("skills", [...currentSkills, trimmed], {
      shouldValidate: true,
    });
    setNewSkill("");
  };

  const removeSkill = (skillToRemove: string) => {
    form.setValue(
      "skills",
      currentSkills.filter((s) => s !== skillToRemove),
      { shouldValidate: true },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <EditSectionWrapper
      title="About Me"
      isEditing={isEditing}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={handleSave}
      isSaving={form.formState.isSubmitting}
    >
      {isEditing ? (
        <FieldGroup>
          <Controller
            control={form.control}
            name="bio"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    id="bio"
                    rows={5}
                    placeholder="Tell others about yourself..."
                    {...field}
                    disabled={form.formState.isSubmitting}
                    aria-invalid={!!fieldState.error}
                  />
                </InputGroup>
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <div>
            <FieldLabel className="mb-3">Skills & Expertise</FieldLabel>
            <InputGroup>
              <InputGroupInput
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a skill"
                disabled={
                  form.formState.isSubmitting || currentSkills.length >= 20
                }
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  variant="secondary"
                  onClick={addSkill}
                  disabled={
                    form.formState.isSubmitting ||
                    !newSkill.trim() ||
                    currentSkills.length >= 20
                  }
                  size="icon-sm"
                  tabIndex={-1}
                >
                  <Plus className="w-4 h-4" />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            {currentSkills.length >= 20 && (
              <p className="text-sm text-muted-foreground mt-2">
                Maximum 20 skills reached
              </p>
            )}
            <Controller
              control={form.control}
              name="skills"
              render={({ fieldState }) => (
                <FieldError>{fieldState.error?.message}</FieldError>
              )}
            />

            <div className="flex flex-wrap gap-2 mt-3">
              {currentSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="gap-1 p-2 pr-1 text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    disabled={form.formState.isSubmitting}
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="size-4" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </FieldGroup>
      ) : (
        <>
          <p className="text-foreground leading-relaxed mb-6">{bio}</p>

          <h4 className="font-semibold mb-3">Skills & Expertise</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-sm p-2">
                {skill}
              </Badge>
            ))}
          </div>
        </>
      )}
    </EditSectionWrapper>
  );
}
