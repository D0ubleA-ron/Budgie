<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-teal-50 to-white">
    <!-- Hero -->
    <section class="max-w-6xl mx-auto px-4 py-16 text-center">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-sm font-medium mb-4">
        <span class="text-lg">💸</span> Budgie · Personal Finance
      </div>

      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
        Welcome to <span class="text-teal-500">Budgie</span>
      </h1>
      <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        Track spending, see transactions, and stay on top of your accounts — all in one place.
      </p>

      <!-- Quick actions -->
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <RouterLink
          to="/register"
          class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600 text-white font-semibold shadow-sm hover:bg-teal-700 transition"
        >
          <span>Get started</span> <span aria-hidden>→</span>
        </RouterLink>

        <RouterLink
          to="/login"
          class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-gray-900 font-semibold shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 transition"
        >
          Log in
        </RouterLink>

        <RouterLink
          to="/plaid"
          class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-gray-900 font-semibold shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 transition"
        >
          Link a bank
        </RouterLink>

        <RouterLink
          to="/transactions"
          class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-gray-900 font-semibold shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 transition"
        >
          View transactions
        </RouterLink>
      </div>
    </section>

    <!-- Glass card -->
    <section class="max-w-5xl mx-auto px-4 -mt-4 pb-16">
      <div class="rounded-2xl bg-white/70 backdrop-blur shadow-lg ring-1 ring-gray-200">
        <div class="p-6 md:p-8">
          <div class="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <div class="shrink-0 h-12 w-12 rounded-xl bg-teal-100 text-teal-700 grid place-items-center text-2xl">
              🏠
            </div>
            <div class="flex-1">
              <h2 class="text-xl md:text-2xl font-bold text-gray-900">Your finance home base</h2>
              <p class="mt-1 text-gray-600">
                Connect your bank once, then explore clean, searchable transactions and simple account insights.
              </p>
            </div>
            <RouterLink
              to="/account"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold shadow-sm hover:bg-gray-800 transition"
            >
              Account info <span aria-hidden>↗</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature grid -->
    <section class="max-w-6xl mx-auto px-4 pb-24">
      <div class="grid gap-4 md:gap-6 md:grid-cols-3">
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow transition">
          <div class="h-10 w-10 rounded-lg bg-teal-100 text-teal-700 grid place-items-center text-xl mb-3">🔗</div>
          <h3 class="font-semibold text-gray-900">Secure bank linking</h3>
          <p class="mt-1 text-gray-600 text-sm">
            Link once via Plaid, then fetch accounts and transactions with a click.
          </p>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow transition">
          <div class="h-10 w-10 rounded-lg bg-teal-100 text-teal-700 grid place-items-center text-xl mb-3">🧾</div>
          <h3 class="font-semibold text-gray-900">Clean transactions</h3>
          <p class="mt-1 text-gray-600 text-sm">
            Fast search, sorting, and readable categories to spot patterns quickly.
          </p>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow transition">
          <div class="h-10 w-10 rounded-lg bg-teal-100 text-teal-700 grid place-items-center text-xl mb-3">⚡</div>
          <h3 class="font-semibold text-gray-900">Simple & responsive</h3>
          <p class="mt-1 text-gray-600 text-sm">
            Built with Vue + Tailwind for a smooth experience on any device.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// No logic needed for now
</script>

<style scoped>
/* Tailwind handles styling */
</style>
