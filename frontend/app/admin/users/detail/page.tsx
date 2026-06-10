import { use } from 'react';
import UserDetailClient from './UserDetailClient';

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = use(searchParams);
  return <UserDetailClient searchParams={params} />;
}
