import { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

import * as card from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { IconPicker, type IconName } from './ui/icon-picker'
import { useIdeas } from './ideas-context';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';

export type Idea = {
    id: string
    title: string
    icon: string
    description?: string
}

type IdeaCardProps = {
    idea: Idea
}

export default function IdeaCard({ idea: { id, ...idea } }: IdeaCardProps) {
    const { ideas, setIdeas, setAdd } = useIdeas();
    const [open, setOpen] = useState(!(idea.title || idea.description))
    const [icon, setIcon] = useState(idea.icon ?? 'sun')
    const componentRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const titleRef = useRef<HTMLInputElement>(null)
    const contentHeight = contentRef.current ? contentRef.current.offsetHeight + 3 + 'px' : 'fit-content';

    const handleClickOutside = (event: any) => {
        if (open && componentRef.current && !componentRef.current.contains(event?.target)) {

            if (formRef.current) {
                formRef.current.requestSubmit()
            }
            setAdd(false);
            setOpen(false)
        }
    };

    const handleRemove = () => {
        const newIdeas = {
            ...ideas
        }
        delete newIdeas[id]
        console.log(newIdeas)
        setIdeas(newIdeas)
        // setOpen(false)
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    useEffect(() => {
        if (open && titleRef.current) {
            titleRef.current.focus()
            if (titleRef.current.value) titleRef.current.select()
        }

    }, [open])

    const onSubmit = async (data: FormData) => {
        // if (!id) return
        const title = String(data.get('title'))
        const description = String(data.get('description'))
        const icon = (data.get('icon') || 'sun') as IconName

        console.log(title, id)

        if (title.trim()) {
            const resolvedId = id === 'new' ? uuidv4() : id;
            const newIdeas = {
                ...ideas
            }
            newIdeas[resolvedId] = {
                ...idea,
                id: resolvedId,
                title,
                icon,
                description
            }
            delete newIdeas['new']
            console.log(newIdeas)
            setIdeas(newIdeas)
        } else {
            const newIdeas = {
                ...ideas
            }
            delete newIdeas[id]
            delete newIdeas['new']
            console.log(newIdeas)
            setIdeas(newIdeas)
        }
    }

    return (
        <card.Card
            className={"py-3 rounded-none gap-0 "}
            style={{ backgroundColor: open ? 'var(--muted)' : 'var(--background)' }}
            onClick={() => setOpen(true)}
            ref={componentRef}
        >
            <form ref={formRef} action={onSubmit}>
                <card.CardHeader className="px-3 grid-rows-1" >
                    <div className="flex items-center gap-3">
                        <IconPicker value={icon as IconName} onValueChange={(v) => setIcon(v)} />
                        <input hidden name='icon' value={icon} />
                        <Input
                            ref={titleRef}
                            name='title'
                            className='p-0 border-none pointer-events-none h-8 font-semibold'
                            defaultValue={idea.title}
                            style={{
                                fontSize: ' 1.125rem',
                                pointerEvents: open ? 'all' : 'none'
                            }}
                        />
                    </div>
                </card.CardHeader>
                <card.CardContent
                    className={cn('px-3 pl-[56px] overflow-hidden transition-all',
                    )}
                    style={{ height: open ? contentHeight : '0px' }}
                >
                    <div ref={contentRef} className="pt-3" >
                        <card.CardDescription>
                            <Textarea
                                name='description'
                                className='p-0 border-none pointer-events-none min-h-8'
                                defaultValue={idea.description}
                                style={{
                                    fontSize: '1rem',
                                    pointerEvents: open ? 'all' : 'none'
                                }}
                                spellCheck={false}
                            />
                        </card.CardDescription>
                        <Button size="icon" variant={'outline'} className='border-red-500 text-red-500 rounded-full' onClick={handleRemove}><Trash2 /></Button>
                    </div>
                </card.CardContent>
            </form>
        </card.Card >
    )
}
