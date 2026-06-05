import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name') ?? '';
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 });

  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    return NextResponse.json({ gradient: buildGradient(name) });
  }

  try {
    const query = encodeURIComponent(`${name} food dish meal`);
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=5&orientation=squarish&content_filter=high`,
      { headers: { Authorization: `Client-ID ${key}` }, next: { revalidate: 86400 } },
    );

    if (!res.ok) return NextResponse.json({ gradient: buildGradient(name) });

    const data = await res.json();
    const photos: { urls: { small: string }; alt_description: string | null }[] = data.results ?? [];

    if (photos.length === 0) return NextResponse.json({ gradient: buildGradient(name) });

    // Pick the most food-relevant result
    const photo = photos[0];
    return NextResponse.json({ imageUrl: photo.urls.small });
  } catch {
    return NextResponse.json({ gradient: buildGradient(name) });
  }
}

// Deterministic warm kitchen gradient matching the app palette
function buildGradient(name: string): string {
  const GRADIENTS = [
    'linear-gradient(135deg, #F5D9A8 0%, #E8A860 50%, #D4875A 100%)',
    'linear-gradient(135deg, #C4907A 0%, #B87560 50%, #A86550 100%)',
    'linear-gradient(135deg, #C98272 0%, #B86F58 50%, #9A5A48 100%)',
    'linear-gradient(135deg, #A8B99A 0%, #879E77 50%, #6B8457 100%)',
    'linear-gradient(135deg, #D4A866 0%, #C09050 50%, #A87840 100%)',
    'linear-gradient(135deg, #B5956A 0%, #9A7A50 50%, #7F6038 100%)',
    'linear-gradient(135deg, #C8A882 0%, #B0906A 50%, #987850 100%)',
    'linear-gradient(135deg, #E8C49A 0%, #D4A878 50%, #C08C58 100%)',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i);
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}
