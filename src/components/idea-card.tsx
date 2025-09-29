import { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

import * as card from '@/components/ui/card'
import { IconPicker, type IconName } from './ui/icon-picker'
import { useIdeas } from './ideas-context';
import { MoreVertical, Trash2, Archive } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from './ui/dropdown-menu';

export type Idea = {
    id: string
    title: string
    icon: string
    description?: string
    archived?: boolean
}

type IdeaCardProps = {
    idea: Idea
}

export default function IdeaCard({ idea: { id, ...idea } }: IdeaCardProps) {
    const { ideas, setIdeas } = useIdeas();
    const [value, setValue] = useState({
        title: idea.title || '',
        description: idea.description || '',
        icon: idea.icon || 'sun'
    });
    const firstRender = useRef(true);
    const timer = useRef<number | null>(null);

    const handleSave = async ({ title, description, icon }: typeof value) => {
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

    const handleArchive = () => {
        const newIdeas = {
            ...ideas,
            [id]: {
                ...ideas[id],
                archived: true
            }
        }
        setIdeas(newIdeas)
    }

    const handleRemove = () => {
        const newIdeas = {
            ...ideas
        }
        delete newIdeas[id]
        console.log(newIdeas)
        setIdeas(newIdeas)
    }

    useEffect(() => {
        if (!value) return;
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        if (timer.current) {
            clearTimeout(timer.current);
        }

        timer.current = window.setTimeout(() => {
            handleSave(value);
        }, 500);
    }, [value]);

    return (
        <card.Card
            className={"py-3 rounded-xl gap-0 focus-within:shadow-md transition-all group"}
        >
            <card.CardContent className="relative px-3 grid-rows-1" >
                <DropdownMenu>
                    <DropdownMenuTrigger className="absolute top-2 right-2 p-1 rounded hover:bg-accent/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical size={16} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className='min-w-[120px]'>
                        <DropdownMenuItem
                            className='hover:bg-accent/50'
                            onClick={handleArchive}
                        >
                            <Archive size={14} className='mr-2' /> Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem className='hover:bg-red-500/10 text-red-500' onClick={handleRemove}>
                            <Trash2 size={14} className='mr-2' /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center gap-3">
                    <IconPicker
                        value={value.icon as IconName}
                        onValueChange={(val) => setValue({ ...value, icon: val })}
                    />
                    <input hidden name='icon' value={value.icon} />
                    <input
                        name='title'
                        className='p-0 border-none focus:ring-0 focus:outline-none bg-transparent w-full text-lg'
                        value={value.title}
                        onChange={(e) => setValue({ ...value, title: e.target.value })}
                    />
                </div>
            </card.CardContent>
        </card.Card >
    )
}
