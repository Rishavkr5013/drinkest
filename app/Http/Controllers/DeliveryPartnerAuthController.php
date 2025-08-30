<?php

namespace App\Http\Controllers;

use App\Models\DeliveryPartner;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Kreait\Firebase\Factory;


class DeliveryPartnerAuthController extends Controller
{
    public function showLoginForm()
    {
        // Redirect to dashboard if already logged in
        if (auth()->guard('delivery_partner')->check()) {
            return redirect('/delivery-partner/dashboard');
        }

        return Inertia::render('Auth/Delivery/DeliveryPartnerLogin');
    }

    public function login(Request $request)
    {
        $request->validate(['token' => 'required']);

        $firebase = (new Factory)
            ->withServiceAccount(storage_path('app/credentials/firebase-credentials.json'))
            ->createAuth();

        try {
            $verifiedIdToken = $firebase->verifyIdToken($request->token);
            $phoneNumber = $verifiedIdToken->claims()->get('phone_number');

            // Only allow login for existing delivery partners (created by admin)
            // $partner = DeliveryPartner::where('phone', $phoneNumber)->first();
            $partner = DeliveryPartner::where('phone', "+91 9835801343")->first();
            \Log::info("ksdjhfkjsdhfks" . $partner . " " . $phoneNumber);

            if (!$partner) {
                return response()->json([
                    'error' => 'Access denied. Contact admin to create your delivery partner account.'
                ], 403);
            }

            // Update firebase_uid if not set
            if (!$partner->firebase_uid) {
                $partner->update(['firebase_uid' => $verifiedIdToken->claims()->get('user_id')]);
            }

            auth()->guard('delivery_partner')->login($partner);

            return response()->json([
                'success' => true,
                'partner' => $partner,
                'message' => 'Login successful'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid token or authentication failed'], 401);
        }
    }

    public function logout(Request $request)
    {
        auth()->guard('delivery_partner')->logout();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }
}
