<?php

namespace App\Listeners;

use App\Models\MailLog;
use Illuminate\Mail\Events\MessageSent;

class LogSentMessage
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(MessageSent $event): void
    {
        $toAddresses = $event->message->getTo();
        $to = $toAddresses
            ? implode(',', array_map(fn($addr) => $addr->getAddress(), $toAddresses))
            : null;

        MailLog::create([
            'to'      => $to,
            'subject' => $event->message->getSubject(),
            'status'  => true,
        ]);
    }
}
