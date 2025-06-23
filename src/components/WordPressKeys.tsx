import { WordPressKeysList } from './WordPressKeysList';

export function WordPressKeys() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">WordPress Configs</h2>
      <p className="text-muted-foreground">Manage WordPress Configs</p>
      <WordPressKeysList />
    </div>
  );
}
