const baseUrl =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    : '';

async function parseApiResponse(res: Response) {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Lỗi kết nối backend';
    throw new Error(message);
  }

  return data;
}

export async function requestChangeEmailOtp(newEmail: string, token: string) {
  const res = await fetch(`${baseUrl}/auth/request-change-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newEmail }),
  });

  return parseApiResponse(res);
}

export async function verifyChangeEmailOtp(otp: string, token: string) {
  const res = await fetch(`${baseUrl}/auth/verify-change-email-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ otp }),
  });

  return parseApiResponse(res);
}
