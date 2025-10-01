<?php

namespace App\Http\Requests;

use App\Models\Room;
use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
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
            'booking_id' => 'required|integer|exists:bookings,id',
            'payment_provider_id' => 'required|integer|exists:payment_providers,id',
            'note' => 'nullable|string|max:255',
            'reference_number' => 'required|string|max:255|unique:payments,reference_number',
            'pr_no' => 'nullable|string|max:255',
            'amount' => 'required|integer',
            'amount_paid' => 'required|integer',
            'paid_at' => 'nullable|date_format:Y-m-d\TH:i',
            'with_attachment' => 'required|boolean',
            'attachment' => 'required_if:with_attachment,true|nullable|file|mimes:png,jpg,jpeg,pdf|max:2048',
        ];
    }
}
