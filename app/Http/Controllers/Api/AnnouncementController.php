<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AnnouncementController extends Controller
{
    public function images(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'images' => 'required|array|min:1',
            'images.*.temp_id' => 'nullable|string|max:50',
            'images.*.file' => 'nullable|image|mimes:' . config('global.settings.banner_mimes') . '|max:' . config('global.settings.banner_max_size'),
            'images.*.url' => 'nullable|string|max:255',
            'images.*.mobile_file' => 'nullable|image|mimes:' . config('global.settings.banner_mimes') . '|max:' . config('global.settings.banner_max_size'),
            'images.*.mobile_url' => 'nullable|string|max:255',
            'images.*.link' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        foreach ($request->input('images', []) as $index => $image) {
            $file = $request->file("images.$index.file");
            $mobileFile = $request->file("images.$index.mobile_file");

            // Full state is resent every save (same as the desktop image), so a
            // slide with no mobile file/url this round means it was removed.
            $newMobileImage = null;
            if ($mobileFile) {
                $newMobileImage = $mobileFile->store('announcements', 'public');
            } elseif (!empty($image['mobile_url'])) {
                $newMobileImage = $image['mobile_url'];
            }

            if ($file) {
                Announcement::create([
                    'image' => $file->store('announcements', 'public'),
                    'mobile_image' => $newMobileImage,
                    'link_url' => isset($image['link']) ? $image['link'] : null,
                    'order' => $index,
                    'is_temp' => true,
                ]);
            } elseif (!empty($image['url'])) {
                $existing = Announcement::where('image', $image['url'])->first();

                // A replaced or removed mobile image leaves its old file orphaned
                // on disk unless we clean it up before overwriting the column.
                if ($existing && $existing->mobile_image && $existing->mobile_image !== $newMobileImage) {
                    Storage::disk('public')->delete($existing->mobile_image);
                }

                Announcement::where('image', $image['url'])
                    ->update([
                        'mobile_image' => $newMobileImage,
                        'link_url' => isset($image['link']) ? $image['link'] : null,
                        'order' => $index,
                        'is_temp' => true,
                    ]);
            }
        }

        $deleteAnnouncements = Announcement::where('is_temp', false)->get();

        foreach ($deleteAnnouncements as $deleteAnnouncement) {
            Storage::disk('public')->delete($deleteAnnouncement->image);
            if ($deleteAnnouncement->mobile_image) {
                Storage::disk('public')->delete($deleteAnnouncement->mobile_image);
            }
            $deleteAnnouncement->delete();
        }

        Announcement::query()->update(['is_temp' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Announcement images uploaded successfully',
        ]);
    }
}
