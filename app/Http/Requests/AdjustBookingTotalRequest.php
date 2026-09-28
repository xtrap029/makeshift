<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class AdjustBookingTotalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * A signed amount (positive raises the total, negative lowers it). Null or 0
     * removes the adjustment. The reason is required when setting one, because it
     * is printed next to the adjustment in the customer's emails.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'amount' => 'nullable|numeric|between:-9999999,9999999',
            'reason' => 'nullable|string|max:255',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $amount = (float) ($this->input('amount') ?? 0);

            if ($amount == 0) {
                return; // Removing the adjustment — nothing else to check.
            }

            if (trim((string) $this->input('reason')) === '') {
                $validator->errors()->add('reason', 'Please give a reason — it is shown to the customer.');
            }

            // A deduction must not take the total below zero. The model floors the
            // total at 0, so without this the email would read e.g. "Subtotal 1,000
            // / Discount -200 / Adjustment -1,500 / Total 0" — visibly not adding up.
            /** @var \App\Models\Booking $booking */
            $booking = $this->route('booking');
            $booking->loadMissing('room', 'discounts');
            $beforeAdjustment = round($booking->subtotal() - $booking->discount_amount(), 2);

            if ($amount < 0 && abs($amount) > $beforeAdjustment) {
                $validator->errors()->add(
                    'amount',
                    "The deduction can't be more than the current total (PHP "
                        . number_format($beforeAdjustment, 2, '.', ',') . ').'
                );
            }
        });
    }
}
