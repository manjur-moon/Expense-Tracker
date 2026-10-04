import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { createExpenseSchema } from "@/lib/validations/expense";
import Expense from "@/models/Expense";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    const expenses = await Expense.find().sort({
      date: -1,
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    console.error("Failed to fetch expenses:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = createExpenseSchema.safeParse(body);

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

    await connectDB();

    const expense = await Expense.create({
      ...result.data,
      date: new Date(`${result.data.date}T00:00:00.000Z`),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Expense created successfully",
        data: expense,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create expense:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}