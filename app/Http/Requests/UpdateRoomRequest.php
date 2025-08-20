<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/** @method \App\Models\Room route(string $key = null) */
class UpdateRoomRequest extends FormRequest
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
            'name' => 'required|string|max:255|unique:rooms,name,' . $this->route('room')->id,
            'description' => 'required|string',
            'price' => 'required|numeric',
            'is_active' => 'required|boolean',
            'is_private' => 'required|boolean',
            'sqm' => 'required|integer',
            'qty' => 'required|integer',
            'cap' => 'required|integer',
            'schedule_id' => 'required|integer|exists:schedules,id',
            'amenities' => 'nullable|array',
            'amenities.*' => 'nullable|integer|exists:amenities,id',
            'layouts' => 'nullable|array',
            'layouts.*' => 'nullable|integer|exists:layouts,id',
            'image' => 'nullable|image|mimes:png,jpg,jpeg|max:2048',
        ];
    }
}
