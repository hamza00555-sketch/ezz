export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center p-5"
      style={{ background: 'linear-gradient(160deg, #FFF7ED 0%, #FAF7F2 50%, #FFF7ED 100%)' }}
    >
      {children}
    </div>
  );
}
