<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

/** @method \App\Models\Amenity route(string $key = null) */
class UpdateAmenityRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255', Rule::unique('amenities', 'name')->ignore($this->route('amenity')->id),],
            'description' => ['nullable', 'string', 'max:255'],
            'icon' => ['required', 'string', 'max:255'],
        ];
    }
}
