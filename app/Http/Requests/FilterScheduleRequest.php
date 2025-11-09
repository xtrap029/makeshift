<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/** @method \App\Models\Room route(string $key = null) */
class FilterScheduleRequest extends FormRequest
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
            'status' => 'nullable|string|in:1,0',
        ];
    }
}
