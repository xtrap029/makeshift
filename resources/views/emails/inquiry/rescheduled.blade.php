@extends('emails.layouts.master')

@section('title', '📅 Booking Rescheduled')
@section('message', "Hi {$data['name']}, your booking has been moved to a new date and time. Your rate and voucher stay exactly the same — here are the updated details.")

@section('body')
    <!-- Schedule Change -->
    <div style="background: #fffaf0; border: 1px solid #fbd38d; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
        <h3 style="color: #744210; margin: 0 0 20px; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">🔁 Schedule Change</h3>
        <div style="background: white; border-radius: 6px; padding: 20px; border: 1px solid #fbd38d;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #4a5568; font-weight: 500;">Previous Schedule:&nbsp;</span>
                <span style="color: #a0aec0; font-weight: 600; text-decoration: line-through;">{{ $data['previous_date'] }}, {{ $data['previous_time'] }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: {{ !empty($data['reschedule_note']) ? '15px' : '0' }};">
                <span style="color: #4a5568; font-weight: 500;">New Schedule:&nbsp;</span>
                <span style="color: #2d3748; font-weight: 700;">{{ $data['booking_date'] }}, {{ $data['booking_time'] }}</span>
            </div>
            @if (!empty($data['reschedule_note']))
                <div style="display: flex; justify-content: space-between; margin-bottom: 0;">
                    <span style="color: #4a5568; font-weight: 500;">Reason:&nbsp;</span>
                    <span style="color: #2d3748; font-weight: 600;">{{ $data['reschedule_note'] }}</span>
                </div>
            @endif
        </div>
    </div>

    <!-- Booking Details -->
    <div style="background: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
        <h3 style="color: #2d3748; margin: 0 0 20px; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">📋 Booking Details</h3>
        <div style="background: white; border-radius: 6px; padding: 20px; border: 1px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #4a5568; font-weight: 500;">Booking ID:&nbsp;</span>
                <span style="color: #2d3748; font-weight: 600;">{{ $data['booking_id'] }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #4a5568; font-weight: 500;">Room:&nbsp;</span>
                <span style="color: #2d3748; font-weight: 600;">{{ $data['booking_room'] }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #4a5568; font-weight: 500;">Date:&nbsp;</span>
                <span style="color: #2d3748; font-weight: 600;">{{ $data['booking_date'] }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #4a5568; font-weight: 500;">Time:&nbsp;</span>
                <span style="color: #2d3748; font-weight: 600;">{{ $data['booking_time'] }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #4a5568; font-weight: 500;">Note:&nbsp;</span>
                <span style="color: #2d3748; font-weight: 600; white-space: pre-line;">{{ $data['booking_note'] }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #4a5568; font-weight: 500;">Room Price:&nbsp;</span>
                <span style="color: #2d3748; font-weight: 600;">{{ $data['booking_room_price'] }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #4a5568; font-weight: 500;">Total Hours:&nbsp;</span>
                <span style="color: #2d3748; font-weight: 600;">{{ $data['booking_total_hours'] }}</span>
            </div>
            @if (!empty($data['booking_discount']) || !empty($data['booking_adjustment']))
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <span style="color: #4a5568; font-weight: 500;">Subtotal:&nbsp;</span>
                    <span style="color: #2d3748; font-weight: 600;">{{ $data['booking_subtotal'] }}</span>
                </div>
                @foreach ($data['booking_deductions'] ?? [] as $deduction)
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <span style="color: #4a5568; font-weight: 500;">{{ $deduction['label'] }} ({{ $deduction['name'] }}):&nbsp;</span>
                        <span style="color: #48bb78; font-weight: 600;">- {{ $deduction['amount'] }}</span>
                    </div>
                @endforeach
                @if (empty($data['booking_deductions']) && !empty($data['booking_discount']))
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <span style="color: #4a5568; font-weight: 500;">Discount ({{ $data['booking_discount_name'] }}):&nbsp;</span>
                        <span style="color: #48bb78; font-weight: 600;">- {{ $data['booking_discount'] }}</span>
                    </div>
                @endif
                @if (!empty($data['booking_adjustment']))
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <span style="color: #4a5568; font-weight: 500;">Adjustment ({{ $data['booking_adjustment_reason'] }}):&nbsp;</span>
                        <span style="color: {{ !empty($data['booking_adjustment_is_credit']) ? '#48bb78' : '#2d3748' }}; font-weight: 600;">{{ $data['booking_adjustment'] }}</span>
                    </div>
                @endif
            @endif
            <div style="display: flex; justify-content: space-between; margin-bottom: 0;">
                <span style="color: #4a5568; font-weight: 500;">Total Price (unchanged):&nbsp;</span>
                <span style="color: #2d3748; font-weight: 600;">{{ $data['booking_total_price'] }}</span>
            </div>
        </div>
    </div>

    <!-- Voucher Code -->
    <div style="background: #fff5f5; border: 2px dashed #fc8181; border-radius: 8px; padding: 25px; margin-bottom: 30px; text-align: center;">
        <h3 style="color: #c53030; margin: 0 0 15px; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">🎫 Your Voucher Code</h3>
        <div style="background: white; border: 1px solid #fed7d7; border-radius: 6px; padding: 20px; margin-bottom: 15px;">
            <p style="color: #c53030; margin: 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Voucher Code</p>
            <p style="color: #2d3748; margin: 0; font-size: 24px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 2px;">{{ $data['voucher_code'] }}</p>
        </div>
        <p style="color: #4a5568; margin: 0; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            Your existing voucher remains valid for the new schedule.
        </p>
    </div>

    <!-- QR Code -->
    <div style="background: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; margin-bottom: 30px; text-align: center;">
        <h3 style="color: #2d3748; margin: 0 0 20px; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">📱 QR Code for Entry</h3>
        <div style="background: white; border-radius: 6px; padding: 20px; border: 1px solid #e2e8f0; display: inline-block;">
            <img src="{{ $data['qr_code'] }}" alt="QR Code" style="width: 150px; height: 150px; border: 1px solid #e2e8f0;">
        </div>
        <p style="color: #4a5568; margin: 15px 0 0; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            Scan this QR code at the entrance for quick access
        </p>
    </div>

    <!-- Arrival Instructions -->
    <div style="background: #f0fff4; border: 1px solid #9ae6b4; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
        <h3 style="color: #22543d; margin: 0 0 20px; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">📍 Arrival Instructions</h3>
        <div style="background: white; border-radius: 6px; padding: 20px; border: 1px solid #9ae6b4;">
            {!! $emailSettings['templateConfirmedArrival'] !!}
        </div>
    </div>
@endsection
