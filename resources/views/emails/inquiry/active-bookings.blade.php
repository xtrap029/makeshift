@extends('emails.layouts.master')

@section('title', '📅 Your Active Bookings')
@section('message', "Hi {$data['name']}, here are your current active bookings with MakeShift. Keep this email handy for your upcoming visits!")

@section('body')
    <!-- Bookings List -->
    @foreach($data['bookings'] as $index => $booking)
    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <!-- Booking Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #f1f5f9;">
            <h3 style="color: #2d3748; margin: 0; font-size: 16px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                Booking #{{ $booking['booking_id'] }}
            </h3>
        </div>

        <!-- Booking Details Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <!-- Left Column -->
            <div>
                <div style="margin-bottom: 12px;">
                    <span style="color: #718096; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Room</span>
                    <p style="color: #2d3748; margin: 5px 0 0; font-size: 14px; font-weight: 500;">{{ $booking['room']->name }} ({{ $booking['layout']->name }})</p>
                </div>
                <div style="margin-bottom: 12px;">
                    <span style="color: #718096; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Date</span>
                    <p style="color: #2d3748; margin: 5px 0 0; font-size: 14px; font-weight: 500;">{{ $booking['start_date'] }}
                        {{ \Carbon\Carbon::parse($booking['start_time'])->format('H:i') }}-{{ \Carbon\Carbon::parse($booking['end_time'])->format('H:i') }}
                    </p>
                </div>
                <div style="margin-bottom: 12px;">
                    <span style="color: #718096; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Total Price</span>
                    <p style="color: #2d3748; margin: 5px 0 0; font-size: 16px; font-weight: 600; color: #48bb78;">{{ $booking['total_price'] }}</p>
                </div>
                <div style="margin-bottom: 12px;">
                    <span style="color: #718096; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Voucher Code</span>
                    <p style="color: #2d3748; margin: 5px 0 0; font-size: 14px; font-weight: 600; font-family: 'Courier New', monospace; color: #ff5a5f;">{{ $booking['voucher_code'] }}</p>
                </div>
                <div style="margin-bottom: 0;">
                    <span style="color: #718096; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Note</span>
                    <p style="color: #2d3748; margin: 5px 0 0; font-size: 14px; font-weight: 400; font-style: italic;">{{ $booking['note'] ?? 'No special notes' }}</p>
                </div>
            </div>
        </div>

        <!-- QR Code -->
        <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e2e8f0;">
            <span style="color: #718096; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px;">QR Code for Entry</span>
            <img src="{{ asset('storage/vouchers/' . $booking['voucher_code'] . '.png') }}" alt="QR Code" style="width: 80px; height: 80px; border: 1px solid #e2e8f0; border-radius: 4px;">
            <p style="color: #718096; margin: 8px 0 0; font-size: 11px;">Scan at entrance</p>
        </div>
    </div>
    @endforeach

    <!-- Important Reminders -->
    <div style="background: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
        <h3 style="color: #c53030; margin: 0 0 15px; font-size: 16px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">⚠️ Important Reminders</h3>
        <ul style="color: #c53030; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <li style="margin-bottom: 6px;">Bring your voucher code and valid ID for each visit</li>
            <li style="margin-bottom: 6px;">Arrive 15 minutes before your scheduled time</li>
            <li style="margin-bottom: 6px;">Keep this email handy for quick reference</li>
            <li style="margin-bottom: 0;">Contact support if you need to modify any bookings</li>
        </ul>
    </div>
@endsection
