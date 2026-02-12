import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const eventType = body.type as string;

  const supabase = createAdminClient();

  switch (eventType) {
    case "video.upload.asset_created": {
      // Links the upload to the newly created asset
      const uploadId = body.data?.upload_id || body.object?.upload_id;
      const assetId = body.data?.asset_id || body.object?.asset_id;

      if (uploadId && assetId) {
        await supabase
          .from("videos")
          .update({ mux_asset_id: assetId })
          .eq("mux_upload_id", uploadId);
      }
      break;
    }

    case "video.asset.ready": {
      // Asset is processed and ready for playback
      const asset = body.data || body.object;
      const assetId = asset?.id;
      const playbackId = asset?.playback_ids?.[0]?.id;
      const duration = asset?.duration;
      const uploadId = asset?.upload_id;

      if (assetId && playbackId) {
        // Try matching by asset_id first, then by upload_id
        const { data: byAsset } = await supabase
          .from("videos")
          .update({
            mux_asset_id: assetId,
            mux_playback_id: playbackId,
            duration_seconds: duration ? Math.round(duration) : null,
            status: "published",
            published_at: new Date().toISOString(),
          })
          .eq("mux_asset_id", assetId)
          .select("id");

        if (!byAsset?.length && uploadId) {
          await supabase
            .from("videos")
            .update({
              mux_asset_id: assetId,
              mux_playback_id: playbackId,
              duration_seconds: duration ? Math.round(duration) : null,
              status: "published",
              published_at: new Date().toISOString(),
            })
            .eq("mux_upload_id", uploadId);
        }
      }
      break;
    }

    case "video.asset.errored": {
      const asset = body.data || body.object;
      const assetId = asset?.id;
      const uploadId = asset?.upload_id;

      if (assetId) {
        await supabase
          .from("videos")
          .update({ status: "removed" })
          .eq("mux_asset_id", assetId);
      } else if (uploadId) {
        await supabase
          .from("videos")
          .update({ status: "removed" })
          .eq("mux_upload_id", uploadId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
