<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/** @method \App\Models\Room route(string $key = null) */
class UpdateBookingRequest extends FormRequest
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
        $booking = $this->route('booking');
        $isPending = $booking && $booking->status === config('global.booking_status.pending')[0];

        if ($isPending) {
            return [
                'customer_name' => 'required|string|max:255',
                'customer_email' => 'required|email|max:255',
                'customer_phone' => 'required|string|max:255',
                'layout_id' => 'required|integer|exists:layouts,id',
                'note' => 'nullable|string|max:255',
                'expires_at' => 'nullable|date_format:Y-m-d\TH:i',
            ];
        }

        return [
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:255',
            'room_id' => 'required|integer|exists:rooms,id',
            'layout_id' => 'required|integer|exists:layouts,id',
            'note' => 'nullable|string|max:255',
            'qty' => 'required|integer',
            'start_date' => 'required|date',
            'start_time' => 'required|date_format:H:i:s|before:end_time',
            'end_time' => 'required|date_format:H:i:s|after:start_time',
        ];
    }
}
