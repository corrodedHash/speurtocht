import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-4">
      <h2 className="text-2xl font-semibold">Nicht gefunden</h2>
      <p className="text-muted-foreground">Diese Seite existiert nicht.</p>
      <Link href="/" className="underline">
        Zur Startseite
      </Link>
    </div>
  );
}
