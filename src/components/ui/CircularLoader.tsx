export default function CircularLoader({ size = 20 }: { size?: number }) {
  return (
    <div
      className="border-2 border-white border-t-transparent rounded-full animate-spin"
      style={{
        width: size,
        height: size,
      }}
    />
  );
}