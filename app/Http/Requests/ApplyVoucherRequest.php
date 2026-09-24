<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApplyVoucherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Null clears the applied voucher. Eligibility is re-checked in
     * OfferService::applyTo(), so existence is all that's validated here.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'voucher_id' => 'nullable|integer|exists:vouchers,id',
        ];
    }
}
