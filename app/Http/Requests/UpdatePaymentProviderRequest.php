<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/** @method \App\Models\PaymentProvider route(string $key = null) */
class UpdatePaymentProviderRequest extends FormRequest
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
            'name' => 'required|string|max:255|unique:payment_providers,name,' . $this->route('payment_provider')->id,
            'description' => 'nullable|string|max:255',
            'is_manual' => 'required|boolean',
            'is_active' => 'required|boolean',
            'is_default' => 'required|boolean',
        ];
    }
}
