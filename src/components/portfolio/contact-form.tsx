"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { contactSchema, type ContactFormData } from "@/lib/validations";
import { addMessage } from "@/lib/supabase/database";
import { toast } from "sonner";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await addMessage(data);
      setSubmitted(true);
      reset();
      toast.success("Message sent successfully!");
    } catch {
      toast.error("Unable to send message. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <h3 className="text-lg font-semibold">Thanks for reaching out!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your message has been received. I&apos;ll get back to you soon.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => setSubmitted(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} placeholder="Jane Doe" />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} placeholder="jane@example.com" />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" {...register("subject")} placeholder="Let's work together" />
        {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" {...register("message")} rows={5} placeholder="Tell me about your project..." />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? <LoadingSpinner size={16} className="mr-2" /> : <Send className="mr-2 h-4 w-4" />}
        Send Message
      </Button>
    </form>
  );
}
