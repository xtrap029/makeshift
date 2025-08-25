<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{{ $subject ?? 'MakeShift - Space Booking' }}</title>
    <style>
        /* Reset styles for email clients */
        body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        
        /* Base styles */
        body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #f4f4f4 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
            font-size: 16px;
            line-height: 1.6;
            color: #333;
        }
        
        /* Container */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        
        /* Header */
        .header {
            background: linear-gradient(135deg, #ff5a5f 0%,rgb(255, 77, 82) 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 50px 10px;
        }
        
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
            color: white;
        }
        
        /* Content */
        .content {
            padding: 0;
        }
        
        /* Footer */
        .footer {
            background: #f8f9fa;
            color: #6c757d;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            border-top: 1px solid #e9ecef;
        }
        
        /* Responsive design */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                max-width: 100% !important;
            }
            
            .header {
                padding: 20px 15px !important;
            }
            
            .header h1 {
                font-size: 24px !important;
            }
            
            .content {
                padding: 0 !important;
            }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .email-container {
                background-color: #1a1a1a !important;
            }
            
            .footer {
                background: #2d2d2d !important;
                color: #b0b0b0 !important;
                border-top-color: #404040 !important;
            }
        }
    </style>
</head>
<body>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #f4f4f4;">
        <tr>
            <td>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-container">
                    <!-- Header -->
                    <tr>
                        <td class="header">
                            <h1>{{ config('app.name') }}</h1>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td class="content">
                            
                            <!-- Main Content -->
                            <div style="background: white; padding: 50px 30px 0px 30px;">
                                <!-- Greeting -->
                                <div style="text-align: center; margin-bottom: 30px;">
                                    <h2 style="color: #2d3748; margin: 0 0 15px; font-size: 24px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">@yield('title')</h2>
                                        <p style="color: #4a5568; margin: 0; font-size: 16px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                            @yield('message')
                                        </p>
                                </div>
                                @yield('body')
                            </div>
                            <!-- Contact Info -->
                            <div style="text-align: center; margin-bottom: 30px;">
                                <p style="color: #718096; margin: 0 0 20px; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                    Have questions? Feel free to reply to this email or contact us directly.
                                </p>
                                <div style="display: inline-block; background: #ff5a5f; color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: 500; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                    Contact Support
                                </div>
                            </div>

                            <!-- Thank You -->
                            <div style="text-align: center; padding: 30px 0; border-top: 1px solid #e2e8f0;">
                                <p style="color: #4a5568; margin: 0; font-size: 16px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                    Thank you for choosing MakeShift! We look forward to helping you create amazing experiences.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="footer">
                            <p style="margin: 0 0 10px;">
                                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #999;">
                                This email was sent to you because you submitted an inquiry on our website.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>