<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard/Index');
    }

    public function dashboard()
    {
        return Inertia::render('Admin/Dashboard/Index');
    }

    public function store()
    {
        return Inertia::render('Admin/Store/Index');
    }

    public function users()
    {
        return Inertia::render('Admin/Users/Index');
    }

    public function orders()
    {
        return Inertia::render('Admin/Order/Index');
    }
}
