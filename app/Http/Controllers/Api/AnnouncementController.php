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

            if ($file) {
                Announcement::create([
                    'image' => $file->store('announcements', 'public'),
                    'link_url' => isset($image['link']) ? $image['link'] : null,
                    'order' => $index,
                    'is_temp' => true,
                ]);
            } elseif (!empty($image['url'])) {
                Announcement::where('image', $image['url'])
                    ->update([
                        'link_url' => isset($image['link']) ? $image['link'] : null,
                        'order' => $index,
                        'is_temp' => true,
                    ]);
            }
        }

        $deleteAnnouncements = Announcement::where('is_temp', false)->get();

        foreach ($deleteAnnouncements as $deleteAnnouncement) {
            Storage::disk('public')->delete($deleteAnnouncement->image);
            $deleteAnnouncement->delete();
        }

        Announcement::query()->update(['is_temp' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Announcement images uploaded successfully',
        ]);
    }
}
