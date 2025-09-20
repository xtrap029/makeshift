<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreScheduleOverrideRequest extends FormRequest
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
            'date' => 'required|date',
            'time_start' => 'required|date_format:H:i:s|required_with:time_end|before:time_end',
            'time_end' => 'required|date_format:H:i:s|required_with:time_start|after:time_start',
            'is_open' => 'required|boolean',
            'note' => 'required|string',
            'rooms' => 'nullable|array',
            'rooms.*' => 'nullable|integer|exists:rooms,id',
        ];
    }
}
