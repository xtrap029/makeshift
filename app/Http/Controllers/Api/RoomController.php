<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\RoomImage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class RoomController extends Controller
{
    public function images(Request $request, $roomId): JsonResponse
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'images' => 'required|array|min:1',
            'images.*.temp_id' => 'nullable|string|max:50',
            'images.*.file' => 'nullable|image|mimes:' . config('global.settings.banner_mimes') . '|max:' . config('global.settings.banner_max_size'),
            'images.*.url' => 'nullable|string|max:255',
            'images.*.caption' => 'nullable|string|max:50',
        ]);

        // purpose of temp_id is to allow item to enter foreach if caption is not set

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $room = Room::find($roomId);
        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Room not found',
            ], 404);
        }

        foreach ($request->input('images', []) as $index => $image) {
            $file = $request->file("images.$index.file");

            if ($file) {
                $room->image()->create([
                    'name' => $file->store('rooms', 'public'),
                    'caption' => isset($image['caption']) ? $image['caption'] : null,
                    'order' => $index,
                    'is_temp' => true,
                ]);
            } elseif (!empty($image['url'])) {
                RoomImage::where('room_id', $roomId)
                    ->where('name', $image['url'])
                    ->update([
                        'caption' => isset($image['caption']) ? $image['caption'] : null,
                        'order' => $index,
                        'is_temp' => true,
                    ]);
            }
        }

        $deleteImages = RoomImage::where('room_id', $roomId)
            ->where('is_main', false)
            ->where('is_temp', false)
            ->get();

        foreach ($deleteImages as $deleteImage) {
            logger($deleteImage->name);
            Storage::disk('public')->delete($deleteImage->name);
            RoomImage::where('name', $deleteImage->name)->delete();
        }

        RoomImage::where('room_id', $roomId)->update([
            'is_temp' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Images uploaded successfully',
            'data' => [
                'room_id' => $room->id
            ]
        ]);
    }
}
