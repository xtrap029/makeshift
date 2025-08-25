<?php

namespace App\Services;

class VoucherService
{
    public static function generate($blocks = 4, $charsPerBlock = 4): string
    {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $voucher = [];

        for ($i = 0; $i < $blocks; $i++) {
            $block = '';
            for ($j = 0; $j < $charsPerBlock; $j++) {
                $block .= $characters[random_int(0, strlen($characters) - 1)];
            }
            $voucher[] = $block;
        }

        $voucher = implode('-', $voucher);

        generateQr($voucher, 'vouchers', $voucher . '.png');

        return $voucher;
    }
}
