<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSourceRequest;
use App\Http\Requests\UpdateSourceRequest;
use App\Models\Source;
use Inertia\Inertia;

class SourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('source/index', [
            'sources' => Source::orderBy('name')->paginate(config('global.pagination_limit')),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('source/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSourceRequest $request)
    {
        $validated = $request->validated();

        Source::create($validated);

        return to_route('sources.index')->withSuccess('Source created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Source $source)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Source $source)
    {
        return Inertia::render('source/edit', [
            'source' => $source,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSourceRequest $request, Source $source)
    {
        $validated = $request->validated();

        $source->update($validated);

        return to_route('sources.index')->withSuccess('Source updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Source $source)
    {
        $source->delete();

        return to_route('sources.index')->withSuccess('Source deleted successfully!');
    }
}
