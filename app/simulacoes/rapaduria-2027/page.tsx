import { redirect } from 'next/navigation';

type LegacySearchParams = Promise<{
  path?: string | string[];
}>;

function resolvePathParam(value?: string | string[]): 'slowdown' | 'race' | null {
  const parsedValue = Array.isArray(value) ? value[0] : value;
  if (parsedValue === 'slowdown' || parsedValue === 'race') {
    return parsedValue;
  }
  return null;
}

export default async function LegacyIA2027Route({
  searchParams,
}: {
  searchParams: LegacySearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const pathParam = resolvePathParam(resolvedSearchParams.path);

  if (pathParam) {
    redirect(`/simulacoes/ia-2027?path=${pathParam}`);
  }

  redirect('/simulacoes/ia-2027');
}
