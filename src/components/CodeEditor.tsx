import { useRef, useEffect } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

export function CodeEditor({ value, onChange, language = 'javascript' }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // Sync scroll
  useEffect(() => {
    const ta = textareaRef.current;
    const pre = preRef.current;
    if (!ta || !pre) return;
    const onScroll = () => {
      pre.scrollTop = ta.scrollTop;
      pre.scrollLeft = ta.scrollLeft;
    };
    ta.addEventListener('scroll', onScroll);
    return () => ta.removeEventListener('scroll', onScroll);
  }, []);

  const lines = value.split('\n');
  const lineCount = Math.max(lines.length, 1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  };

  return (
    <div className="relative font-mono text-[13px] leading-relaxed min-h-[220px] max-h-[420px] overflow-hidden">
      {/* Line numbers */}
      <div
        className="absolute left-0 top-0 bottom-0 w-10 py-3 text-right pr-2 text-[var(--color-secondary)] select-none pointer-events-none text-[12px] leading-relaxed overflow-hidden"
        aria-hidden
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      {/* Highlight layer (simplified) */}
      <pre
        ref={preRef}
        className="absolute inset-0 pl-12 pr-4 py-3 m-0 overflow-auto pointer-events-none whitespace-pre text-[var(--color-text)]"
        aria-hidden
      >
        <code>{value || ' '}</code>
      </pre>

      {/* Actual textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        className="relative w-full h-full min-h-[220px] max-h-[420px] pl-12 pr-4 py-3 bg-transparent text-transparent caret-[var(--color-accent)]
                   resize-y outline-none border-0 font-mono text-[13px] leading-relaxed overflow-auto
                   selection:bg-[rgba(124,58,237,0.3)]"
        style={{ WebkitTextFillColor: 'transparent' }}
        aria-label="Code editor"
        data-language={language}
      />
    </div>
  );
}
