import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Idea } from "./idea-card";


type IdeasContextValue = {
    ideas: Record<string, Idea>;
    setIdeas: any;
    add: boolean;
    setAdd: any;
}

const ideasContext = createContext<IdeasContextValue>({
    ideas: {},
    setIdeas: () => '',
    add: false,
    setAdd: () => ''
});

export const useIdeas = () => useContext(ideasContext);

export default function IdeasProvider({ children }: { children: ReactNode }) {
    const [ideas, setIdeas] = useState<Record<string, Idea>>({});
    const [add, setAdd] = useState(false);

    function cleanRecord(record: Record<string, Idea>): Record<string, Idea> {
        return Object.fromEntries(
            Object.entries(record).filter(([key]) => key && key !== "undefined")
        );
    }

    const fetchIdeas = async () => {
        const { ideas } = await chrome.storage.sync.get('ideas')
        if (ideas) setIdeas(cleanRecord(ideas))
    }

    const syncIdeas = async () => {
        await chrome.storage?.sync?.set({ ideas: { ...cleanRecord(ideas) } })
    }

    useEffect(() => {
        fetchIdeas();
    }, []);

    useEffect(() => {
        syncIdeas();
    }, [ideas]);

    const value = {
        ideas,
        setIdeas,
        add,
        setAdd
    }

    return <ideasContext.Provider value={value}>{children}</ideasContext.Provider>

}
