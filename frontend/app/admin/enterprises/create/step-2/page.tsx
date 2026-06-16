import { use } from 'react';
import EnterpriseStep2 from '@/libs/tts/components/EnterpriseStep2';

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = use(searchParams);
  return <EnterpriseStep2 searchParams={params} />;
}
