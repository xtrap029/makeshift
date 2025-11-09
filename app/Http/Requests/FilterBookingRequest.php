<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/** @method \App\Models\Room route(string $key = null) */
class FilterBookingRequest extends FormRequest
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
        return [
            'rooms' => 'nullable|array',
            'layouts' => 'nullable|array',
            'status' => 'nullable|string|in:' . implode(',', array_column(config('global.booking_status'), 0)),
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
        ];
    }
}
