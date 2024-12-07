<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\School;
use Illuminate\Http\JsonResponse;


class SchoolController extends Controller
{
    /**
     * Retrieve all schools.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $schools = School::all(); // Retrieve all records from the schools table
        return response()->json($schools);
    }
}
