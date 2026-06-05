// Map dish name → real photo path (add more as photos are uploaded)
export const dishImages: Record<string, string> = {
  'سوتو أيام': '/dishes/soto-ayam.png',
};

// Deterministic warm kitchen gradient per dish name
const GRADIENTS = [
  'linear-gradient(135deg, #F5D9A8 0%, #E8A860 50%, #D4875A 100%)', // warm gold
  'linear-gradient(135deg, #C4907A 0%, #B87560 50%, #A86550 100%)', // terracotta
  'linear-gradient(135deg, #C98272 0%, #B86F58 50%, #9A5A48 100%)', // deep terra
  'linear-gradient(135deg, #A8B99A 0%, #879E77 50%, #6B8457 100%)', // sage
  'linear-gradient(135deg, #D4A866 0%, #C09050 50%, #A87840 100%)', // amber
  'linear-gradient(135deg, #B5956A 0%, #9A7A50 50%, #7F6038 100%)', // bronze
  'linear-gradient(135deg, #C8A882 0%, #B0906A 50%, #987850 100%)', // sand
  'linear-gradient(135deg, #E8C49A 0%, #D4A878 50%, #C08C58 100%)', // cream gold
];

export function dishGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i);
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

// Returns imageUrl (real photo) or undefined (use gradient)
export function getDishImage(name: string): string | undefined {
  return dishImages[name];
}
