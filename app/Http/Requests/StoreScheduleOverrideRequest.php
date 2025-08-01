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
            'time_start' => 'required|string|max:255',
            'time_end' => 'required|string|max:255',
            'is_open' => 'required|boolean',
            'note' => 'required|string',
            'rooms' => 'nullable|array',
            'rooms.*' => 'nullable|integer|exists:rooms,id',
        ];
    }
}
