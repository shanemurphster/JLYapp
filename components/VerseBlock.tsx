interface VerseBlockProps {
  reference: string;
  text: string;
}

export default function VerseBlock({ reference, text }: VerseBlockProps) {
  return (
    <div className="border-l-2 border-grace-gold pl-4 py-1">
      <p className="font-serif text-lg leading-relaxed text-grace-text italic">
        &ldquo;{text}&rdquo;
      </p>
      <p className="mt-2 text-sm font-sans text-grace-gold font-medium tracking-wide uppercase">
        {reference}
      </p>
    </div>
  );
}
