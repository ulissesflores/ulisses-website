import { redirect } from 'next/navigation';

export default function LegacySlowdownRoute() {
  redirect('/simulacoes/ia-2027?path=slowdown');
}
