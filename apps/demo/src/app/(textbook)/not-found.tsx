import Link from "next/link";

import { ContinueReading } from "@/components/continue-reading";
import { getSession } from "@/lib/auth";

export default async function NotFound() {
  const { user } = await getSession();
  return (
    <div className="grid place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary/80 sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <ContinueReading user={user} />
          <Link href="/" className="text-sm font-semibold">
            Go to home <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
