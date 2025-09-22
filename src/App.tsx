import { Lightbulb, Plus, Trash2 } from 'lucide-react'

import { Button, buttonVariants } from './components/ui/button'
import { cn } from './lib/utils'
import IdeaCard from './components/idea-card'
import { getChrome } from './lib/get-chrome'
import { useIdeas } from './components/ideas-context'


function App() {
  const { ideas, setIdeas } = useIdeas();
  const chrome = getChrome();

  // const handleAdd = () => {
  //   setIdeas(prev => [{
  //     id: crypto.randomUUID(),
  //     title: '',
  //     icon: 'sun'
  //   }, ...prev])
  // }

  const handleAdd = () => {
    setIdeas((prev: any) => ({
      'new': {
        id: 'new',
        title: '',
        icon: 'sun'
      },
      ...prev
    }))
  }
  const handleClear = async () => {
    await chrome.storage.sync.clear()
    setIdeas([])
  }

  return (
    <div className="w-[600px]">
      <header className="border-b ">
        <div className="container mx-auto border-x px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="size-8 text-primary/80" />
            <h1 className="font-bold">Ideas Notebook</h1>
          </div>
          <div className="flex gap-1">
            <Button size={'icon'} variant="ghost" onClick={handleClear}><Trash2 /></Button>
            <Button size={'icon'} variant="ghost" onClick={handleAdd}><Plus /></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto border-x min-h-[calc(100vh-90px)] p-4 box-border space-y-2">
        {Object.values(ideas).length === 0 && <p className='text-center text-muted-foreground'>No ideas yet!</p>}
        {ideas && Object.values(ideas).map(idea => <IdeaCard key={idea.id} idea={idea} />)}
      </main>

      <footer className="border-t">
        <div className="container mx-auto border-x">
          <p className="text-sm text-muted-foreground text-center">
            Built by{' '}
            <a
              href="#"
              className={cn(
                buttonVariants({ variant: 'link' }),
                'p-0 pl-1'
              )}
            >
              Rotocode
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
