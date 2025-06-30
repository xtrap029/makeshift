<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLayoutRequest;
use App\Http\Requests\UpdateLayoutRequest;
use App\Models\Layout;
use Inertia\Inertia;

class LayoutController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $layouts = Layout::orderBy('name')->get();

        return Inertia::render('layout/index', [
            'layouts' => $layouts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('layout/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLayoutRequest $request)
    {
        $validated = $request->validated();

        Layout::create($validated);

        return to_route('layouts.index')->withSuccess('Layout created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Layout $layout)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Layout $layout)
    {
        return Inertia::render('layout/edit', [
            'layout' => $layout,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLayoutRequest $request, Layout $layout)
    {
        $validated = $request->validated();

        $layout->update($validated);

        return to_route('layouts.index')->withSuccess('Layout updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Layout $layout)
    {
        $layout->delete();

        return to_route('layouts.index')->withSuccess('Layout deleted successfully!');
    }
}
