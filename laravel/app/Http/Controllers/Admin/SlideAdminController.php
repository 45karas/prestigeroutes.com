<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSlide;
use Illuminate\Http\Request;

class SlideAdminController extends Controller
{
    public function index()
    {
        $slides = HeroSlide::orderBy('sort_order')->orderByDesc('created_at')->get();
        return view('admin.slides.index', ['slides' => $slides]);
    }

    public function create()
    {
        return view('admin.slides.form', ['slide' => null]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        HeroSlide::create($data);
        return redirect()->route('admin.slides.index');
    }

    public function edit(HeroSlide $slide)
    {
        return view('admin.slides.form', ['slide' => $slide]);
    }

    public function update(Request $request, HeroSlide $slide)
    {
        $data = $this->validated($request);
        $slide->update($data);
        return redirect()->route('admin.slides.index');
    }

    public function destroy(HeroSlide $slide)
    {
        $slide->delete();
        return redirect()->route('admin.slides.index');
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'min:2', 'max:120'],
            'subtitle' => ['nullable', 'string', 'max:240'],
            'image_url' => ['required', 'url'],
            'cta_text' => ['nullable', 'string', 'max:50'],
            'cta_href' => ['nullable', 'string', 'max:200'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:1000'],
        ]);

        $data['published'] = $request->boolean('published');
        $data['sort_order'] = $data['sort_order'] ?? 0;

        return $data;
    }
}

