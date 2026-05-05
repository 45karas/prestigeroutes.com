<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\TripController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\SlideAdminController;
use App\Http\Controllers\Admin\TripAdminController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/trips', [TripController::class, 'index'])->name('trips.index');
Route::get('/trips/{slug}', [TripController::class, 'show'])->name('trips.show');

Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register'])->name('register.post');
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/account/bookings', [AccountController::class, 'bookings'])->name('account.bookings');
    Route::post('/checkout/{tripId}', [CheckoutController::class, 'create'])->name('checkout.create');
    Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');
});

// Stripe webhook should NOT require auth
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handle'])->name('stripe.webhook');

Route::prefix('admin')->middleware(['auth', \App\Http\Middleware\AdminOnly::class])->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('admin.index');

    Route::get('/trips', [TripAdminController::class, 'index'])->name('admin.trips.index');
    Route::get('/trips/new', [TripAdminController::class, 'create'])->name('admin.trips.create');
    Route::post('/trips', [TripAdminController::class, 'store'])->name('admin.trips.store');
    Route::get('/trips/{trip}/edit', [TripAdminController::class, 'edit'])->name('admin.trips.edit');
    Route::post('/trips/{trip}', [TripAdminController::class, 'update'])->name('admin.trips.update');
    Route::post('/trips/{trip}/delete', [TripAdminController::class, 'destroy'])->name('admin.trips.delete');

    Route::get('/slides', [SlideAdminController::class, 'index'])->name('admin.slides.index');
    Route::get('/slides/new', [SlideAdminController::class, 'create'])->name('admin.slides.create');
    Route::post('/slides', [SlideAdminController::class, 'store'])->name('admin.slides.store');
    Route::get('/slides/{slide}/edit', [SlideAdminController::class, 'edit'])->name('admin.slides.edit');
    Route::post('/slides/{slide}', [SlideAdminController::class, 'update'])->name('admin.slides.update');
    Route::post('/slides/{slide}/delete', [SlideAdminController::class, 'destroy'])->name('admin.slides.delete');
});

