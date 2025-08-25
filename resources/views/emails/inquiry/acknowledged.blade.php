@extends('emails.layouts.master')

@section('title', 'Payment Required - Action Needed')
@section('message', "Hi {$data['name']}, your inquiry has been acknowledged and is now pending payment. Please complete the payment steps below to confirm your reservation.")

@section('body')
    <!-- Inquiry Details -->
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

    <!-- Payment Steps -->
    <div style="background: #fef7f7; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="color: #2d3748; margin: 0 0 15px; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Payment Steps Required</h3>
        <div style="margin-bottom: 15px;">
            <div style="background: #ff5a5f; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-block; margin-right: 15px; vertical-align: top; position: relative;">
                <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; font-weight: 600; line-height: 2; margin-left: 8px;">1</span>
            </div>
            <p style="color: #4a5568; margin: 0; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: inline-block; vertical-align: top; width: calc(100% - 45px);">Complete your payment using the provided payment details</p>
        </div>
        <div style="margin-bottom: 15px;">
            <div style="background: #ff5a5f; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-block; margin-right: 15px; vertical-align: top; position: relative;">
                <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; font-weight: 600; line-height: 2; margin-left: 8px;">2</span>
            </div>
            <p style="color: #4a5568; margin: 0; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: inline-block; vertical-align: top; width: calc(100% - 45px);">Take a screenshot of your payment confirmation</p>
        </div>
        <div style="margin-bottom: 15px;">
            <div style="background: #ff5a5f; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-block; margin-right: 15px; vertical-align: top; position: relative;">
                <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; font-weight: 600; line-height: 2; margin-left: 8px;">3</span>
            </div>
            <p style="color: #4a5568; margin: 0; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: inline-block; vertical-align: top; width: calc(100% - 45px);">Reply to this email with the screenshot attached</p>
        </div>
        <div style="margin-bottom: 0;">
            <div style="background: #ff5a5f; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-block; margin-right: 15px; vertical-align: top; position: relative;">
                <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; font-weight: 600; line-height: 2; margin-left: 8px;">4</span>
            </div>
            <p style="color: #4a5568; margin: 0; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: inline-block; vertical-align: top; width: calc(100% - 45px);">Wait for confirmation from our team</p>
        </div>
    </div>

    <!-- Payment Details -->
    <div style="background: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
        <h3 style="color: #2d3748; margin: 0 0 20px; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Payment Information</h3>
        <div style="background: white; border-radius: 6px; padding: 20px; border: 1px solid #e2e8f0;">
            <p style="color: #4a5568; margin: 0 0 15px; font-size: 15px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <strong>Payment Method:</strong> {{ $data['payment_method'] ?? 'Bank Transfer' }}<br>
                <strong>Account Details:</strong> {{ $data['account_details'] ?? 'Will be provided separately' }}<br>
                <strong>Amount Due:</strong> {{ $data['amount'] ?? 'Contact us for pricing' }}
            </p>
        </div>
    </div>

    <!-- Screenshot Requirement -->
    <div style="background: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
        <h3 style="color: #c53030; margin: 0 0 15px; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">⚠️ Screenshot Requirement</h3>
        <p style="color: #c53030; margin: 0; font-size: 15px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <strong>Important:</strong> You must attach a screenshot of your payment confirmation when replying to this email. 
            This helps us verify your payment quickly and process your reservation.
        </p>
    </div>

    <!-- Deadline Warning -->
    <div style="background: #fffaf0; border: 1px solid #f6ad55; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
        <h3 style="color: #c05621; margin: 0 0 15px; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">⏰ Payment Deadline</h3>
        <p style="color: #c05621; margin: 0; font-size: 15px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <strong>Deadline:</strong> {{ $data['deadline'] ? \Carbon\Carbon::parse($data['deadline'])->format('F j, Y, g:i a') : 'N/A' }}<br>
            <strong>Note:</strong> If payment is not received by the deadline, your inquiry may be cancelled and the space will be released to other customers.
        </p>
    </div>
@endsection
