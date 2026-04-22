<?php

namespace App\Mail;

use App\Support\EmailSettings;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InquiryAcknowledged extends Mailable
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
        return $this->subject('Inquiry Acknowledged')
            ->with([
                'name' => $this->data['name'],
                'payment_method' => $this->data['payment_method'],
                'account_details' => $this->data['account_details'],
                'amount' => $this->data['amount'],
                'deadline' => $this->data['deadline'],
                'booking_id' => $this->data['booking_id'],
                'booking_room' => $this->data['booking_room'],
                'booking_date' => $this->data['booking_date'],
                'booking_time' => $this->data['booking_time'],
                'booking_note' => $this->data['booking_note'],
                'booking_room_price' => $this->data['booking_room_price'],
                'booking_total_hours' => $this->data['booking_total_hours'],
                'booking_total_price' => $this->data['booking_total_price'],
            ]);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Inquiry Acknowledged',
            bcc: $this->resolveBcc(),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.inquiry.acknowledged',
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
