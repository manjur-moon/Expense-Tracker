const sampleExpenses = [
  {
    id: "1",
    title: "Lunch",
    amount: 450,
    category: "Food",
    date: "04 Oct 2026",
  },
  {
    id: "2",
    title: "Bus Fare",
    amount: 80,
    category: "Transport",
    date: "03 Oct 2026",
  },
  {
    id: "3",
    title: "Headphones",
    amount: 2200,
    category: "Shopping",
    date: "02 Oct 2026",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 2xl:px-10">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <p className="text-sm font-medium text-slate-500">
            Personal Finance
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Expense Tracker
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
            Track your daily expenses and understand where your money is going.
          </p>
        </header>

        {/* Summary Cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-slate-500">
              Total Expense
            </p>

            <p className="mt-2 text-2xl font-bold sm:text-3xl">
              ৳2,730
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Across all recorded expenses
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-slate-500">
              Total Entries
            </p>

            <p className="mt-2 text-2xl font-bold sm:text-3xl">
              3
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Expenses currently recorded
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 sm:p-6 xl:col-span-1">
            <p className="text-sm font-medium text-slate-500">
              Top Category
            </p>

            <p className="mt-2 text-2xl font-bold sm:text-3xl">
              Shopping
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Highest spending category
            </p>
          </div>
        </section>

        {/* Main Dashboard */}
        <section className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Add Expense */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold">
                  Add Expense
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add a new expense to your records.
                </p>
              </div>

              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Title
                  </label>

                  <input
                    id="title"
                    type="text"
                    placeholder="e.g. Lunch"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="amount"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Amount
                  </label>

                  <input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Category
                  </label>

                  <select
                    id="category"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Date
                  </label>

                  <input
                    id="date"
                    type="date"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <button
                  type="button"
                  className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                >
                  Add Expense
                </button>
              </form>
            </div>
          </div>

          {/* Expense History */}
          <div className="min-w-0 lg:col-span-8 xl:col-span-9">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Section Header */}
              <div className="border-b border-slate-200 p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Expense History
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      View and manage your recent expenses.
                    </p>
                  </div>

                  <select className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 sm:w-48">
                    <option>All Categories</option>
                    <option>Food</option>
                    <option>Transport</option>
                    <option>Shopping</option>
                    <option>Others</option>
                  </select>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {/* Mobile Cards */}
                <div className="space-y-3 md:hidden">
                  {sampleExpenses.map((expense) => (
                    <article
                      key={expense.id}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold">
                            {expense.title}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {expense.date}
                          </p>
                        </div>

                        <p className="shrink-0 text-base font-semibold">
                          ৳{expense.amount.toLocaleString()}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {expense.category}
                        </span>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium transition hover:bg-slate-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Tablet / Desktop Table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[700px] text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-sm text-slate-500">
                        <th className="pb-3 pr-4 font-medium">
                          Expense
                        </th>

                        <th className="pb-3 pr-4 font-medium">
                          Category
                        </th>

                        <th className="pb-3 pr-4 font-medium">
                          Date
                        </th>

                        <th className="pb-3 pr-4 text-right font-medium">
                          Amount
                        </th>

                        <th className="pb-3 text-right font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {sampleExpenses.map((expense) => (
                        <tr
                          key={expense.id}
                          className="border-b border-slate-100 last:border-0"
                        >
                          <td className="py-4 pr-4 font-medium">
                            {expense.title}
                          </td>

                          <td className="py-4 pr-4">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                              {expense.category}
                            </span>
                          </td>

                          <td className="py-4 pr-4 text-sm text-slate-500">
                            {expense.date}
                          </td>

                          <td className="py-4 pr-4 text-right font-semibold">
                            ৳{expense.amount.toLocaleString()}
                          </td>

                          <td className="py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium transition hover:bg-slate-50"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Future Analytics Area */}
        <section className="mt-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="text-lg font-semibold">
                Expense Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Category chart will be added here later.
              </p>
            </div>

            <div className="mt-6 flex min-h-52 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
              <p className="text-sm text-slate-400">
                Expense chart coming soon
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}