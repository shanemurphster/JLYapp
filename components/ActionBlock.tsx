interface ActionBlockProps {
  text: string;
}

export default function ActionBlock({ text }: ActionBlockProps) {
  return (
    <div className="bg-grace-warm rounded-2xl px-5 py-4">
      <p className="text-xs font-sans font-semibold tracking-widest uppercase text-grace-gold mb-2">
        Today
      </p>
      <p className="font-sans text-base leading-relaxed text-grace-brown-deep">
        {text}
      </p>
    </div>
  );
}
