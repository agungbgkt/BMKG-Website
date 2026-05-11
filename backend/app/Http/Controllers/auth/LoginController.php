<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\User;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        // Untuk x-www-form-urlencoded
        $credentials = $request->only(['email', 'password']);
        
        if (empty($credentials['email']) || empty($credentials['password'])) {
            return response()->json([
                'message' => 'Email dan password harus diisi'
            ], 400);
        }
        
        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Email atau password salah'
            ], 401);
        }
        
        $user = Auth::user();
        
        if (!$user->is_bmkg) {
            Auth::logout();
            return response()->json([
                'message' => 'Hanya pegawai BMKG yang diizinkan'
            ], 403);
        }
        
        return response()->json([
            'message' => 'Login berhasil',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_bmkg' => $user->is_bmkg,
            ]
        ]);
    }

    public function register(Request $request)
{
    // Validasi
    $validated = $request->validate([
        'name' => 'required|string',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:6',
        'employeeId' => 'required|unique:users,nip',
        'position' => 'nullable|string',
        'workUnit' => 'nullable|string',
    ]);
    
    // Buat user
    $user = User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
        'nip' => $validated['employeeId'],
        'unit_kerja' => $validated['workUnit'] ?? null,
        'is_bmkg' => true, // Harus validasi email BMKG dulu
    ]);
    
    return response()->json(['message' => 'Register berhasil', 'user' => $user], 201);
}
}