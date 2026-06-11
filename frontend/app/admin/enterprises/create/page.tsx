import { use } from 'react';
import EnterpriseStep1 from '@/libs/tts/components/EnterpriseStep1';

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = use(searchParams);
  return <EnterpriseStep1 searchParams={params} />;
}
