<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/** @method \App\Models\Schedule route(string $key = null) */
class UpdateScheduleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Modify request data before validation.
     */
    protected function prepareForValidation(): void
    {
        /** @var \Illuminate\Http\Request $this */
        $this->merge([
            'sun_start' => $this->sun_start === 'null' ? null : $this->sun_start,
            'sun_end' => $this->sun_end === 'null' ? null : $this->sun_end,
            'mon_start' => $this->mon_start === 'null' ? null : $this->mon_start,
            'mon_end' => $this->mon_end === 'null' ? null : $this->mon_end,
            'tue_start' => $this->tue_start === 'null' ? null : $this->tue_start,
            'tue_end' => $this->tue_end === 'null' ? null : $this->tue_end,
            'wed_start' => $this->wed_start === 'null' ? null : $this->wed_start,
            'wed_end' => $this->wed_end === 'null' ? null : $this->wed_end,
            'thu_start' => $this->thu_start === 'null' ? null : $this->thu_start,
            'thu_end' => $this->thu_end === 'null' ? null : $this->thu_end,
            'fri_start' => $this->fri_start === 'null' ? null : $this->fri_start,
            'fri_end' => $this->fri_end === 'null' ? null : $this->fri_end,
            'sat_start' => $this->sat_start === 'null' ? null : $this->sat_start,
            'sat_end' => $this->sat_end === 'null' ? null : $this->sat_end,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $day_rules = 'nullable|date_format:H:i:s|required_with:';

        return [
            'name' => 'required|string|max:255',
            'is_active' => 'required|boolean',
            'max_day' => 'required|integer|min:0',
            'max_date' => 'required|date',
            'sun_start' => $day_rules . 'sun_end|before:sun_end',
            'sun_end' => $day_rules . 'sun_start|after:sun_start',
            'mon_start' => $day_rules . 'mon_end|before:mon_end',
            'mon_end' => $day_rules . 'mon_start|after:mon_start',
            'tue_start' => $day_rules . 'tue_end|before:tue_end',
            'tue_end' => $day_rules . 'tue_start|after:tue_start',
            'wed_start' => $day_rules . 'wed_end|before:wed_end',
            'wed_end' => $day_rules . 'wed_start|after:wed_start',
            'thu_start' => $day_rules . 'thu_end|before:thu_end',
            'thu_end' => $day_rules . 'thu_start|after:thu_start',
            'fri_start' => $day_rules . 'fri_end|before:fri_end',
            'fri_end' => $day_rules . 'fri_start|after:fri_start',
            'sat_start' => $day_rules . 'sat_end|before:sat_end',
            'sat_end' => $day_rules . 'sat_start|after:sat_start',
        ];
    }
}
