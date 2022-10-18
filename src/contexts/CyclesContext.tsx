import { createContext, ReactNode, useState } from "react";

interface CreateCycleData {
    task: string
    minutesDuration: number
}

interface Cycle {
    id: string
    task: string
    minutesDuration: number
    startDate: Date
    interruptedDate?: Date
    finishedDate?: Date
}

interface CyclesContextType {
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    setCurrentCycleAsFinished: () => void
    totalSecondsPassed: number
    setSecondsPassed: (seconds: number) => void
    createNewCycle: (data: CreateCycleData) => void
    interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
    children: ReactNode
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {

    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [totalSecondsPassed, setTotalSecondsPassed] = useState(0)

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    function setSecondsPassed(seconds: number) {
        setTotalSecondsPassed(seconds)
    }

    function setCurrentCycleAsFinished() {
        setCycles((state) => state.map(cycle => {
            if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
            } else {
                return cycle
            }
        }))
    }

    function createNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime())
        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesDuration: data.minutesDuration,
            startDate: new Date()
        }
        setCycles(state => [...state, newCycle])
        // always when a state data needs to be updated, is a common practice
        // to use a arrow function to copy the actual data and add the new value at the end
        setActiveCycleId(id)
        setTotalSecondsPassed(0)

        // reset()
    }

    function interruptCurrentCycle() {
        setCycles((state) => state.map(cycle => {
            if (cycle.id === activeCycleId) {
                return { ...cycle, interruptedDate: new Date() }
            } else {
                return cycle
            }
        }))

        setActiveCycleId(null)
    }

    return (
        <CyclesContext.Provider value={{
            activeCycle,
            activeCycleId,
            setCurrentCycleAsFinished,
            totalSecondsPassed,
            setSecondsPassed,
            createNewCycle,
            interruptCurrentCycle
        }}>

            {children}
        </CyclesContext.Provider>
    )
}