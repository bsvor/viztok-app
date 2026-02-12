import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMux } from "@/lib/mux";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const uploadId = request.nextUrl.searchParams.get("uploadId");
  if (!uploadId) {
    return NextResponse.json({ error: "Missing uploadId" }, { status: 400 });
  }

  // Check the upload status from Mux
  const upload = await getMux().video.uploads.retrieve(uploadId);

  if (!upload.asset_id) {
    return NextResponse.json({ status: "waiting" });
  }

  // Get the asset to check if it's ready
  const asset = await getMux().video.assets.retrieve(upload.asset_id);

  if (asset.status === "ready" && asset.playback_ids?.length) {
    // Update our DB with the asset info
    const playbackId = asset.playback_ids[0].id;

    await supabase
      .from("videos")
      .update({
        mux_asset_id: asset.id,
        mux_playback_id: playbackId,
        duration_seconds: asset.duration ? Math.round(asset.duration) : null,
        status: "published",
        published_at: new Date().toISOString(),
      })
      .eq("mux_upload_id", uploadId);

    return NextResponse.json({ status: "ready", playbackId });
  }

  if (asset.status === "errored") {
    await supabase
      .from("videos")
      .update({ status: "removed" })
      .eq("mux_upload_id", uploadId);

    return NextResponse.json({ status: "errored" });
  }

  return NextResponse.json({ status: "preparing" });
}
