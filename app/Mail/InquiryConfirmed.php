<?php

namespace App\Mail;

use App\Support\EmailSettings;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InquiryConfirmed extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    /**
     * Create a new message instance.
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Booking Confirmed')
            ->with([
                'name' => $this->data['name'],
                'booking_id' => $this->data['booking_id'],
                'booking_date' => $this->data['booking_date'],
                'booking_time' => $this->data['booking_time'],
                'booking_room' => $this->data['booking_room'],
                'booking_note' => $this->data['booking_note'],
                'booking_room_price' => $this->data['booking_room_price'],
                'booking_total_hours' => $this->data['booking_total_hours'],
                'booking_total_price' => $this->data['booking_total_price'],
                'voucher_code' => $this->data['voucher_code'],
                'qr_code' => $this->data['qr_code'],
            ]);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Booking Confirmed',
            bcc: $this->resolveBcc(),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.inquiry.confirmed',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

    private function resolveBcc(): array
    {
        $bcc = EmailSettings::all()['bcc'] ?? null;
        if (!$bcc) return [];
        return array_filter(array_map(
            fn($e) => new Address(trim($e)),
            explode(',', $bcc)
        ));
    }
}
