<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVoucherRequest extends FormRequest
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
            'description' => 'nullable|string|max:255',
            'type' => ['required', 'integer', Rule::in(array_column(config('global.discount_type'), 0))],
            'value' => [
                'required',
                'numeric',
                'min:0',
                $this->input('type') == config('global.discount_type.percentage')[0] ? 'max:100' : 'max:9999999',
            ],
            'min_hours' => 'nullable|integer|min:1|max:24|required_without:min_spend',
            'min_spend' => 'nullable|numeric|min:0|required_without:min_hours',
            'book_from' => 'required|date',
            'book_to' => 'required|date|after_or_equal:book_from',
            'reserve_from' => 'required|date',
            'reserve_to' => 'required|date|after_or_equal:reserve_from',
            'priority' => 'required|integer|min:0',
            'is_active' => 'required|boolean',
            'rooms' => 'required|array|min:1',
            'rooms.*' => 'required|integer|exists:rooms,id',
        ];
    }

    public function messages(): array
    {
        return [
            'rooms.required' => 'Select at least one room.',
            'book_from.required' => 'Booking period start date is required.',
            'book_to.required' => 'Booking period end date is required.',
            'reserve_from.required' => 'Reservation start date is required.',
            'reserve_to.required' => 'Reservation end date is required.',
            'value.max' => 'A percentage voucher cannot exceed 100.',
            'min_hours.required_without' => 'Set a minimum number of hours, a minimum spend, or both.',
            'min_spend.required_without' => 'Set a minimum number of hours, a minimum spend, or both.',

        ];
    }
}
