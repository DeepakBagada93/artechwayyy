export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/20 py-6 px-4 md:px-6">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Artechway. All rights reserved.</p>
      </div>
    </footer>
  );
}
