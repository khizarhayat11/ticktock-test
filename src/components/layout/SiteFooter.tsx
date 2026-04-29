export function SiteFooter() {
  return (
    <footer className="border-2 rounded-2xl mt-8 bg-background">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center text-center justify-center px-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} tentwenty. All rights reserved.</p>
      </div>
    </footer>
  );
}
