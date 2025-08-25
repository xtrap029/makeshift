@extends('emails.layouts.master')

@section('title', '❌ Inquiry Cancelled')
@section('message', "Hi {$data['name']}, your inquiry has been cancelled. We understand this may be disappointing, and we're here to help if you'd like to make a new booking.")

@section('body')
    <!-- Cancellation Notice -->
    <div style="background: #fff5f5; border: 1px solid #fed7d7; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="color: #c53030; margin: 0 0 15px; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">❌ Inquiry Cancelled</h3>
        <p style="color: #c53030; margin: 0; font-size: 15px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            We're sorry to inform you that your inquiry has been cancelled. This may be due to payment not being received within the deadline, 
            space unavailability, or other circumstances.
        </p>
    </div>

    <!-- Cancellation Details -->
    <div style="background: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
        <h3 style="color: #2d3748; margin: 0 0 20px; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">📋 Cancellation Details</h3>
        <div style="background: white; border-radius: 6px; padding: 20px; border: 1px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #4a5568; font-weight: 500;">Booking ID:&nbsp;</span>
                <span style="color: #2d3748; font-weight: 600;">{{ $data['booking_id'] }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #4a5568; font-weight: 500;">Reason:&nbsp;</span>
                <span style="color: #2d3748; font-weight: 600;">{{ $data['cancellation_reason'] }}</span>
            </div>
        </div>
    </div>

    <!-- What This Means -->
    <div style="background: #fef7f7; border-left: 4px solid #ff5a5f; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="color: #2d3748; margin: 0 0 15px; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">ℹ️ What This Means</h3>
        <ul style="color: #4a5568; margin: 0; padding-left: 20px; font-size: 15px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <li style="margin-bottom: 8px;">Your inquiry is no longer active</li>
            <li style="margin-bottom: 8px;">The requested space has been released</li>
            <li style="margin-bottom: 8px;">No payment is required for this cancelled inquiry</li>
            <li style="margin-bottom: 0;">You can submit a new inquiry at any time</li>
        </ul>
    </div>

    <!-- Next Steps -->
    <div style="background: #f0fff4; border: 1px solid #9ae6b4; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
        <h3 style="color: #22543d; margin: 0 0 15px; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">🔄 Next Steps</h3>
        <div style="background: white; border-radius: 6px; padding: 20px; border: 1px solid #9ae6b4;">
            <div style="margin-bottom: 15px;">
                <strong style="color: #22543d;">💡 Want to try again?</strong>
                <p style="color: #4a5568; margin: 5px 0 0; font-size: 15px;">Submit a new inquiry for the same or different space</p>
            </div>
            <div style="margin-bottom: 15px;">
                <strong style="color: #22543d;">📅 Check availability:</strong>
                <p style="color: #4a5568; margin: 5px 0 0; font-size: 15px;">Visit our website to see current space availability</p>
            </div>
            <div style="margin-bottom: 0;">
                <strong style="color: #22543d;">📞 Need assistance?</strong>
                <p style="color: #4a5568; margin: 5px 0 0; font-size: 15px;">Contact our support team for help with your next booking</p>
            </div>
        </div>
    </div>

    <!-- Alternative Options -->
    <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
        <h3 style="color: #2d3748; margin: 0 0 15px; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">💡 Alternative Options</h3>
        <div style="background: white; border-radius: 6px; padding: 20px; border: 1px solid #e2e8f0;">
            <p style="color: #4a5568; margin: 0 0 15px; font-size: 15px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <strong>Consider these alternatives:</strong>
            </p>
            <ul style="color: #4a5568; margin: 0; padding-left: 20px; font-size: 15px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <li style="margin-bottom: 8px;">Different dates or times for the same space</li>
                <li style="margin-bottom: 8px;">Alternative spaces that might better suit your needs</li>
                <li style="margin-bottom: 8px;">Flexible booking options with different pricing</li>
                <li style="margin-bottom: 0;">Special packages or promotions currently available</li>
            </ul>
        </div>
    </div>
@endsection
