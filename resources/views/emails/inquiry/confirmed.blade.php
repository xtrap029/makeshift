@extends('emails.layouts.master')

@section('title', '🎉 Booking Confirmed!')
@section('message', "Congratulations {$data['name']}! Your booking has been confirmed and payment received. Here are your booking details and arrival instructions.")

@section('body')
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
                <span style="color: #2d3748; font-weight: 600;">{{ $data['booking_note'] }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #4a5568; font-weight: 500;">Room Price:&nbsp;</span>
                <span style="color: #2d3748; font-weight: 600;">{{ $data['booking_room_price'] }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #4a5568; font-weight: 500;">Total Hours:&nbsp;</span>
                <span style="color: #2d3748; font-weight: 600;">{{ $data['booking_total_hours'] }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0;">
                <span style="color: #4a5568; font-weight: 500;">Total Price:&nbsp;</span>
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
            <div style="margin-bottom: 15px;">
                <strong style="color: #22543d;">🚪 Entry Point:</strong>
                <p style="color: #4a5568; margin: 5px 0 0; font-size: 15px;">{{ $data['entry_point'] ?? 'Main entrance on the ground floor' }}</p>
            </div>
            <div style="margin-bottom: 15px;">
                <strong style="color: #22543d;">📱 What to Bring:</strong>
                <p style="color: #4a5568; margin: 5px 0 0; font-size: 15px;">Your voucher code, QR code (on phone), and valid ID</p>
            </div>
            <div style="margin-bottom: 0;">
                <strong style="color: #22543d;">ℹ️ Check-in Process:</strong>
                <p style="color: #4a5568; margin: 5px 0 0; font-size: 15px;">Present your voucher code and ID at the reception desk</p>
            </div>
        </div>
    </div>

    <!-- Additional Information -->
    <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
        <h3 style="color: #2d3748; margin: 0 0 15px; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">ℹ️ Additional Information</h3>
        <ul style="color: #4a5568; margin: 0; padding-left: 20px; font-size: 15px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <li style="margin-bottom: 8px;">Free Wi-Fi is available throughout the space</li>
            <li style="margin-bottom: 8px;">Refreshments and coffee are provided</li>
            <li style="margin-bottom: 8px;">Parking is available on-site (first come, first served)</li>
            <li style="margin-bottom: 0;">For any changes or cancellations, contact us at least 24 hours in advance</li>
        </ul>
    </div>
@endsection
