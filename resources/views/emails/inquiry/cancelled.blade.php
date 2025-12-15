@extends('emails.layouts.master')

@section('title', '❌ Inquiry Cancelled')
@section('message', "Hi {$data['name']}, your inquiry has been cancelled. We understand this may be disappointing, and we're here to help if you'd like to make a new booking.")

@section('body')
    <!-- Cancellation Notice -->
    <div style="background: #fff5f5; border: 1px solid #fed7d7; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="color: #c53030; margin: 0 0 15px; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">❌ Inquiry Cancelled</h3>
        <p style="color: #c53030; margin: 0; font-size: 15px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            {!! $emailSettings['templateCancelledInquiry'] !!}
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
        {!! $emailSettings['templateCancelledMeans'] !!}
    </div>

    <!-- Next Steps -->
    <div style="background: #f0fff4; border: 1px solid #9ae6b4; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
        <h3 style="color: #22543d; margin: 0 0 15px; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">🔄 Next Steps</h3>
        <div style="background: white; border-radius: 6px; padding: 20px; border: 1px solid #9ae6b4;">
            {!! $emailSettings['templateCancelledNextSteps'] !!}
        </div>
    </div>

    <!-- Alternative Options -->
    <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
        <h3 style="color: #2d3748; margin: 0 0 15px; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">💡 Alternative Options</h3>
        <div style="background: white; border-radius: 6px; padding: 20px; border: 1px solid #e2e8f0;">
            {!! $emailSettings['templateCancelledAlternative'] !!}
        </div>
    </div>
@endsection
