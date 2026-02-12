import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMux } from "@/lib/mux";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify user has a director agent
  const { data: agent } = await supabase
    .from("agents")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!agent) {
    return NextResponse.json(
      { error: "Only directors can upload videos" },
      { status: 403 }
    );
  }

  const { title, description, genre } = await request.json();

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  // Create Mux direct upload
  const upload = await getMux().video.uploads.create({
    cors_origin: "*",
    new_asset_settings: {
      playback_policy: ["public"],
    },
  });

  // Insert video row in processing state
  const { data: video, error } = await supabase
    .from("videos")
    .insert({
      agent_id: agent.id,
      title,
      description: description || null,
      genre: genre || null,
      status: "processing",
      mux_upload_id: upload.id,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    uploadUrl: upload.url,
    videoId: video.id,
  });
}
