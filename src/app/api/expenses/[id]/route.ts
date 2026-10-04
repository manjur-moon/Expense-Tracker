import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { updateExpenseSchema } from "@/lib/validations/expense";
import Expense from "@/models/Expense";


export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid expense ID",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const expense = await Expense.findById(id);

    if (!expense) {
      return NextResponse.json(
        {
          success: false,
          message: "Expense not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: expense,
    });
  } catch (error) {
    console.error("Failed to fetch expense:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid expense ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const result = updateExpenseSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid expense data",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    if (Object.keys(result.data).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No fields provided for update",
        },
        { status: 400 }
      );
    }

    const updateData = {
      ...result.data,
      ...(result.data.date
        ? {
            date: new Date(
              `${result.data.date}T00:00:00.000Z`
            ),
          }
        : {}),
    };

    await connectDB();

    const expense = await Expense.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!expense) {
      return NextResponse.json(
        {
          success: false,
          message: "Expense not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (error) {
    console.error("Failed to update expense:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}