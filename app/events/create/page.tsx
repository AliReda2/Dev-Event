"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CreateEventPage = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const formEl = e.currentTarget;
      const raw = new FormData(formEl);

      const tagsInput = (raw.get("tags") as string) || "";
      const agendaInput = (raw.get("agenda") as string) || "";

      const tags = tagsInput
        .split(/[,\n]/)
        .map((t) => t.trim())
        .filter(Boolean);
      const agenda = agendaInput
        .split(/[,\n]/)
        .map((a) => a.trim())
        .filter(Boolean);

      const image = raw.get("image");
      if (!(image instanceof File) || image.size === 0) {
        setError("Please select an image file.");
        setSubmitting(false);
        return;
      }

      const payload = new FormData();
      // Pass-through fields expected by the API/model
      [
        "title",
        "description",
        "overview",
        "venue",
        "location",
        "date",
        "time",
        "mode",
        "audience",
        "organizer",
      ].forEach((key) => {
        const v = raw.get(key);
        if (typeof v === "string") payload.append(key, v);
      });

      payload.append("image", image);
      payload.append("tags", JSON.stringify(tags));
      payload.append("agenda", JSON.stringify(agenda));

      const res = await fetch("/api/events", {
        method: "POST",
        body: payload,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to create event");
      }

      const slug = data?.event?.slug;
      if (slug) router.push(`/events/${slug}`);
      else router.push("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-3xl w-full mx-auto">
      <h1>Create Event</h1>
      <p className="text-light-100 text-lg mt-4">Fill out the form to create a new event.</p>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="mt-10 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" required placeholder="Event title" className="bg-dark-200 rounded-[6px] px-5 py-2.5" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" required placeholder="Short description" className="bg-dark-200 rounded-[6px] px-5 py-2.5 min-h-24" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="overview">Overview</label>
          <textarea id="overview" name="overview" required placeholder="Detailed overview" className="bg-dark-200 rounded-[6px] px-5 py-2.5 min-h-24" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="image">Image</label>
          <input id="image" name="image" type="file" accept="image/*" required className="bg-dark-200 rounded-[6px] px-5 py-2.5 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-black hover:file:bg-primary/90" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="venue">Venue</label>
            <input id="venue" name="venue" required placeholder="Venue name" className="bg-dark-200 rounded-[6px] px-5 py-2.5" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="location">Location</label>
            <input id="location" name="location" required placeholder="City, Country" className="bg-dark-200 rounded-[6px] px-5 py-2.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="date">Date</label>
            <input id="date" name="date" type="date" required className="bg-dark-200 rounded-[6px] px-5 py-2.5" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="time">Time</label>
            <input id="time" name="time" type="time" required className="bg-dark-200 rounded-[6px] px-5 py-2.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="mode">Mode</label>
            <select id="mode" name="mode" required className="bg-dark-200 rounded-[6px] px-5 py-2.5">
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="audience">Audience</label>
            <input id="audience" name="audience" required placeholder="e.g. Developers, Students" className="bg-dark-200 rounded-[6px] px-5 py-2.5" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="agenda">Agenda (comma or one per line)</label>
          <textarea id="agenda" name="agenda" required placeholder="Registration, Keynote, Breakouts, ..." className="bg-dark-200 rounded-[6px] px-5 py-2.5 min-h-24" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input id="tags" name="tags" required placeholder="react, javascript, meetup" className="bg-dark-200 rounded-[6px] px-5 py-2.5" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="organizer">Organizer</label>
          <input id="organizer" name="organizer" required placeholder="Organization or person" className="bg-dark-200 rounded-[6px] px-5 py-2.5" />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90 w-full md:w-fit cursor-pointer items-center justify-center rounded-[6px] px-6 py-3 text-lg font-semibold text-black disabled:opacity-60">
          {submitting ? "Creating..." : "Create Event"}
        </button>
      </form>
    </section>
  );
};

export default CreateEventPage;
