<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
  /**
   * Display a listing of users for admin
   */
  public function index()
  {
    $users = User::withCount(['orders', 'locations'])
      ->with([
        'orders' => function ($query) {
          $query->latest()->limit(5);
        },
        'locations' => function ($query) {
          $query->latest();
        }
      ])
      ->latest()
      ->get();

    return Inertia::render('Admin/Users/Index', [
      'users' => $users,
    ]);
  }

  /**
   * Show user details
   */
  public function show(User $user)
  {
    $user->load([
      'orders' => function ($query) {
        $query->with(['store', 'items.product'])->latest();
      },
      'locations'
    ]);

    return Inertia::render('Admin/Users/Show', [
      'user' => $user,
    ]);
  }

  /**
   * Update user status (activate/deactivate)
   */
  public function updateStatus(Request $request, User $user)
  {
    $request->validate([
      'status' => 'required|in:active,inactive'
    ]);

    // Add a status field to users table if it doesn't exist
    // For now, we'll use a simple approach with email_verified_at
    if ($request->status === 'inactive') {
      $user->update(['email_verified_at' => null]);
      $message = 'User deactivated successfully.';
    } else {
      $user->update(['email_verified_at' => now()]);
      $message = 'User activated successfully.';
    }

    return redirect()->back()->with('success', $message);
  }

  /**
   * Delete user (soft delete would be better in production)
   */
  public function destroy(User $user)
  {
    // In production, you might want to use soft deletes
    // and handle user data according to privacy regulations
    $user->delete();

    return redirect()->back()->with('success', 'User deleted successfully.');
  }
}
