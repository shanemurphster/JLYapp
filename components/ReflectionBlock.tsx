interface ReflectionBlockProps {
  text: string;
}

export default function ReflectionBlock({ text }: ReflectionBlockProps) {
  return (
    <div>
      <p className="text-xs font-sans font-semibold tracking-widest uppercase text-grace-muted mb-2">
        Reflection
      </p>
      <p className="font-sans text-base leading-relaxed text-grace-text-soft">
        {text}
      </p>
    </div>
  );
}
