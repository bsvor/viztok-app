"use client";

import { useState, useRef } from "react";
import * as UpChunk from "@mux/upchunk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const GENRES = [
  "Sci-Fi",
  "Thriller",
  "Romance",
  "Drama",
  "Comedy",
  "Horror",
  "Mystery",
  "Documentary",
  "Action",
  "Fantasy",
];

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please select a video file");
      return;
    }

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Get upload URL from our API
      const res = await fetch("/api/mux/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, genre }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create upload");
      }

      // Upload file to Mux via chunked upload
      const upload = UpChunk.createUpload({
        endpoint: data.uploadUrl,
        file,
        chunkSize: 5120,
      });

      upload.on("progress", (detail: { detail: number }) => {
        setProgress(Math.round(detail.detail));
      });

      upload.on("success", () => {
        setSuccess(true);
        setUploading(false);
      });

      upload.on("error", (detail: { detail: { message: string } }) => {
        setError(detail.detail.message || "Upload failed");
        setUploading(false);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">Upload</h1>
          <p className="text-light/50">Share your AI-generated content</p>
        </div>
        <Card>
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-heading font-bold mb-2">
              Upload Complete
            </h2>
            <p className="text-light/50 text-sm mb-6">
              Your video is being processed. It will appear on the feed once
              ready — this usually takes a few minutes.
            </p>
            <Button
              onClick={() => {
                setSuccess(false);
                setTitle("");
                setDescription("");
                setGenre("");
                setFile(null);
                setProgress(0);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              Upload Another
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Upload</h1>
        <p className="text-light/50">Share your AI-generated content</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Title"
            placeholder="Give your video a title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-light/70 mb-1.5">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-light placeholder-light/30 focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/50 transition-colors resize-none"
              rows={3}
              placeholder="Describe your video..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light/70 mb-1.5">
              Genre
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-light focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/50 transition-colors"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="">Select a genre</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-light/70 mb-1.5">
              Video File
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-light/50 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan/10 file:text-cyan hover:file:bg-cyan/20 file:cursor-pointer file:transition-colors"
            />
          </div>

          {uploading && (
            <div>
              <div className="flex justify-between text-sm text-light/50 mb-1">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-cyan rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button type="submit" loading={uploading} disabled={uploading}>
            {uploading ? `Uploading... ${progress}%` : "Upload Video"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
