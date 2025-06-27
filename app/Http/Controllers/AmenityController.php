<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAmenityRequest;
use App\Http\Requests\UpdateAmenityRequest;
use App\Models\Amenity;
use Inertia\Inertia;

class AmenityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $amenities = Amenity::orderBy('name')->get();

        return Inertia::render('amenity/index', [
            'amenities' => $amenities,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('amenity/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAmenityRequest $request)
    {
        $validated = $request->validated();

        Amenity::create($validated);

        return to_route('amenities.index')->withSuccess('Amenity created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Amenity $amenity)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Amenity $amenity)
    {
        return Inertia::render('amenity/edit', [
            'amenity' => $amenity,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAmenityRequest $request, Amenity $amenity)
    {
        $validated = $request->validated();

        $amenity->update($validated);

        return to_route('amenities.index')->withSuccess('Amenity updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Amenity $amenity)
    {
        $amenity->delete();

        return to_route('amenities.index')->withSuccess('Amenity deleted successfully!');
    }
}
