@extends('emails.layouts.master')

@section('title', 'Inquiry Received!')
@section('message', "Hi {$data['name']}, thank you for reaching out to us! We've received your inquiry and our team is already working on it.")

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

    <!-- What Happens Next -->
    <div style="background: #fef7f7; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="color: #2d3748; margin: 0 0 15px; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">What happens next?</h3>
        <div style="margin-bottom: 15px;">
            <div style="background: #ff5a5f; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-block; margin-right: 15px; vertical-align: top; position: relative;">
                <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; font-weight: 600; line-height: 2; margin-left: 8px;">1</span>
            </div>
            <p style="color: #4a5568; margin: 0; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: inline-block; vertical-align: top; width: calc(100% - 45px);">Our team will review your inquiry within 24 hours</p>
        </div>
        <div style="margin-bottom: 15px;">
            <div style="background: #ff5a5f; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-block; margin-right: 15px; vertical-align: top; position: relative;">
                <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; font-weight: 600; line-height: 2; margin-left: 8px;">2</span>
            </div>
            <p style="color: #4a5568; margin: 0; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: inline-block; vertical-align: top; width: calc(100% - 45px);">We'll contact you via email to confirm details</p>
        </div>
        <div style="margin-bottom: 0;">
            <div style="background: #ff5a5f; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-block; margin-right: 15px; vertical-align: top; position: relative;">
                <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; font-weight: 600; line-height: 2; margin-left: 8px;">3</span>
            </div>
            <p style="color: #4a5568; margin: 0; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: inline-block; vertical-align: top; width: calc(100% - 45px);">We'll guide you through the reservation and payment process</p>
        </div>
    </div>
@endsection
