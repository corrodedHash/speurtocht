interface Props {
  params: Promise<{ token: string }>;
}

export default async function StationPage({ params }: Props) {
  const { token } = await params;

  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Station</h1>
      <p className="text-muted-foreground">Token: {token}</p>
    </div>
  );
}
