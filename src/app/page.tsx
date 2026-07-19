export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold">Schnitzeljagd</h1>
      <p className="text-lg text-center max-w-md text-muted-foreground">
        Willkommen zur Schnitzeljagd des Wochenend-Wedding-Retreats!
      </p>
      <p className="text-sm">Scannt den QR-Code eurer Startstation, um zu beginnen.</p>
    </div>
  );
}
