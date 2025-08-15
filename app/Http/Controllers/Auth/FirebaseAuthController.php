<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Kreait\Firebase\Factory;

class FirebaseAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate(['token' => 'required']);

        $firebase = (new Factory)
            ->withServiceAccount(storage_path('app/credentials/firebase-credentials.json'))
            ->createAuth();

        try {
            $verifiedIdToken = $firebase->verifyIdToken($request->token);
            $phoneNumber = $verifiedIdToken->claims()->get('phone_number');

            $user = User::firstOrCreate(
                ['phone' => $phoneNumber],
                ['name' => 'User ' . $phoneNumber],
                ['phone_verified_at' => now()]
            );

            auth()->login($user);

            return redirect()->route('dashboard');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Invalid token']);
        }
    }
}
