export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center p-5"
      style={{ background: 'linear-gradient(160deg, #F7F2EC 0%, #FFFDF8 50%, #F7F2EC 100%)' }}
    >
      {children}
    </div>
  );
}
