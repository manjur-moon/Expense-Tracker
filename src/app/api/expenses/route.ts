import type { FilterQuery } from "mongoose";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import {
  createExpenseSchema,
  expenseFilterSchema,
} from "@/lib/validations/expense";
import Expense from "@/models/Expense";
import type { IExpense } from "@/types/expense";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const filterResult = expenseFilterSchema.safeParse({
      category:
        searchParams.get("category") || undefined,
      from: searchParams.get("from") || undefined,
      to: searchParams.get("to") || undefined,
    });

    if (!filterResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid filter values",
          errors:
            filterResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { category, from, to } =
      filterResult.data;

    const filter: FilterQuery<IExpense> = {};

    if (category) {
      filter.category = category;
    }

    if (from || to) {
      const dateFilter: {
        $gte?: Date;
        $lte?: Date;
      } = {};

      if (from) {
        dateFilter.$gte = new Date(
          `${from}T00:00:00.000Z`
        );
      }

      if (to) {
        dateFilter.$lte = new Date(
          `${to}T23:59:59.999Z`
        );
      }

      if (
        dateFilter.$gte &&
        dateFilter.$lte &&
        dateFilter.$gte > dateFilter.$lte
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "From date cannot be after to date",
          },
          { status: 400 }
        );
      }

      filter.date = dateFilter;
    }

    await connectDB();

    const expenses = await Expense.find(filter).sort({
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