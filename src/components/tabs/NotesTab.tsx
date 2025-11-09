import { Note } from '../../types';

interface NotesTabProps {
  notes: Note[];
}

export function NotesTab({ notes }: NotesTabProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 grid grid-cols-[80px_1fr] md:grid-cols-[140px_1fr] gap-4 md:gap-8 items-center">
        <div className="rounded-xl overflow-hidden stagger-1">
          <img
            src="/notes.png"
            alt="Notes"
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="stagger-2">
          <h1 className="mb-3">Notes & Tips</h1>
          <p className="text-muted-foreground">
            Additional strategies, storage recommendations, and ideas for getting the most
            out of your meal prep.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-6 md:p-8 bg-card/30 backdrop-blur-sm rounded-xl border border-border"
          >
            <h3 className="mb-4 flex items-center gap-2">
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 18 18" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5"
              >
                <path d="M3 3h9l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1z" />
                <path d="M12 3v3h3" />
              </svg>
              {note.title}
            </h3>
            <div className="space-y-3">
              {note.content.map((paragraph, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Resources */}
      <div className="mt-8 p-6 md:p-8 bg-accent/30 backdrop-blur-sm rounded-xl border border-border">
        <h3 className="mb-4">Questions or Feedback?</h3>
        <p className="text-muted-foreground mb-4">
          This meal prep system is designed to be flexible and adaptable. As you use it, 
          you'll discover your own shortcuts and preferences.
        </p>
        <p className="text-muted-foreground">
          Feel free to swap ingredients, adjust quantities, or completely riff on the 
          suggested meals. The core principle remains: prep versatile components on Sunday, 
          assemble different meals all week.
        </p>
      </div>
    </div>
  );
}
