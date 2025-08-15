<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Kreait\Firebase\Auth as FirebaseAuth;
use Illuminate\Support\Facades\Auth;



class FirebaseAuthController extends Controller
{
    public function login(Request $request, FirebaseAuth $firebase)
    {
        $request->validate([
            'id_token' => 'required|string', // Firebase ID token from client
        ]);

        try {
            $verifiedIdToken = $firebase->verifyIdToken($request->id_token);
            $claims = $verifiedIdToken->claims();

            $phone = $claims->get('phone_number');
            if (!$phone) {
                return response()->json(['message' => 'No phone number found in token'], 422);
            }

            // Find or create user
            $user = User::firstOrCreate(['phone' => $phone], [
                'name' => null,
                'email' => null,
                'password' => null,
            ]);

            // If it's API (mobile app), return token
            if ($request->expectsJson()) {
                $token = $user->createToken('mobile')->plainTextToken;
                return response()->json(['token' => $token, 'user' => $user]);
            }

            // If it's Inertia/web, login via session
            Auth::login($user);
            return response()->json(['ok' => true, 'user' => $user]);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Invalid Firebase token', 'error' => $e->getMessage()], 401);
        }
    }

    public function logout(Request $request)
    {
        if ($request->expectsJson()) {
            $request->user()->currentAccessToken()?->delete();
        } else {
            Auth::logout();
        }
        return response()->json(['ok' => true]);
    }
}
