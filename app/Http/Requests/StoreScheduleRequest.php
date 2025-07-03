<?php

namespace App\Http\Requests;

use App\Models\Amenity;
use Illuminate\Foundation\Http\FormRequest;

class StoreScheduleRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'is_active' => 'required|boolean',
            'max_day' => 'required|integer|min:0',
            'max_date' => 'required|date',
            'sun_start' => 'nullable|required_with:sun_end|string|max:255',
            'sun_end' => 'nullable|required_with:sun_start|string|max:255',
            'mon_start' => 'nullable|required_with:mon_end|string|max:255',
            'mon_end' => 'nullable|required_with:mon_start|string|max:255',
            'tue_start' => 'nullable|required_with:tue_end|string|max:255',
            'tue_end' => 'nullable|required_with:tue_start|string|max:255',
            'wed_start' => 'nullable|required_with:wed_end|string|max:255',
            'wed_end' => 'nullable|required_with:wed_start|string|max:255',
            'thu_start' => 'nullable|required_with:thu_end|string|max:255',
            'thu_end' => 'nullable|required_with:thu_start|string|max:255',
            'fri_start' => 'nullable|required_with:fri_end|string|max:255',
            'fri_end' => 'nullable|required_with:fri_start|string|max:255',
            'sat_start' => 'nullable|required_with:sat_end|string|max:255',
            'sat_end' => 'nullable|required_with:sat_start|string|max:255',
        ];
    }
}
