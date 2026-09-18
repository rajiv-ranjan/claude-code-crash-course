import { getHooks } from "@/lib/hooks";
import HooksBrowser from "@/components/HooksBrowser";

export default async function Home() {
  const hooks = await getHooks();

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-16 sm:px-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            HookHub
          </h1>
          <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
            Discover open-source Claude Code hooks, pulled live from GitHub. Browse a hook
            below, then jump straight to its repository to install it.
          </p>
        </header>

        <HooksBrowser hooks={hooks} />
      </main>
    </div>
  );
}
