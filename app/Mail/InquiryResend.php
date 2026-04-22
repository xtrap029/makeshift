<?php

namespace App\Mail;

use App\Support\EmailSettings;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class InquiryResend extends Mailable
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
        return $this->subject('Inquiry Resend')
            ->with([
                'name' => $this->data['name'],
                'bookings' => $this->data['bookings'],
            ]);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Active Bookings',
            bcc: $this->resolveBcc(),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.inquiry.active-bookings',
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
