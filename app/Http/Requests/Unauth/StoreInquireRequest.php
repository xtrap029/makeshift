<?php

namespace App\Http\Requests\Unauth;

use Illuminate\Foundation\Http\FormRequest;

class StoreInquireRequest extends FormRequest
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
        $rules = [
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'layout' => 'required|exists:layouts,name',
        ];

        /** @var \Illuminate\Http\Request $this */
        if ($this->routeIs('reservation.inquire.post')) {
            $rules['name'] = 'required|string|max:' . config('form.validation.name.max') . '|min:' . config('form.validation.name.min');
            $rules['email'] = 'required|email|max:' . config('form.validation.email.max');
            $rules['phone'] = 'required|string|min:' . config('form.validation.phone.min');
            $rules['note'] = 'nullable|string|max:' . config('form.validation.note.max');
        }

        return $rules;
    }
}
