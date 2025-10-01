<?php

namespace App\Http\Requests;

use App\Models\Room;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/** @method \App\Models\Room route(string $key = null) */
class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var \Illuminate\Http\Request $this */
        $roomId = $this->input('room_id');
        $layout = $roomId ? optional(Room::find($roomId))->layouts()->pluck('layouts.id')->toArray() ?? [] : [];

        return [
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:255',
            'room_id' => 'required|integer|exists:rooms,id',
            'layout_id' => [
                'required',
                'integer',
                Rule::in($layout),
            ],
            'note' => 'nullable|string|max:255',
            'qty' => 'required|integer',
            'start_date' => 'required|date',
            'start_time' => 'required|date_format:H:i:s|before:end_time',
            'end_time' => 'required|date_format:H:i:s|after:start_time',
        ];
    }

    public function messages(): array
    {
        return [
            'layout_id.in' => 'The selected layout is not valid for the chosen room.',
        ];
    }
}
