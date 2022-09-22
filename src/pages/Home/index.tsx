import { useEffect, useState } from "react";
import { HandPalm, Play } from "phosphor-react";

import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";



type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesDuration: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {

  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)


  function handleCreateNewCycle(data: NewCycleFormData) {
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

    reset()
  }

  function handleInterruptCycle() {
    setCycles((state) => state.map(cycle => {
      if (cycle.id === activeCycleId) {
        return { ...cycle, interruptedDate: new Date() }
      } else {
        return cycle
      }
    }))

    setActiveCycleId(null)
  }
  console.log(activeCycleId)

  const currentSeconds = activeCycle ? totalSeconds - totalSecondsPassed : 0
  const remainingMinutes = Math.floor(currentSeconds / 60)
  const remainingSeconds = currentSeconds % 60
  const minutes = String(remainingMinutes).padStart(2, '0')
  const seconds = String(remainingSeconds).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds])

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>

        <NewCycleForm />

        <Countdown />

        {activeCycle ?
          (<StopCountdownButton
            onClick={handleInterruptCycle}
            type="button"
          >
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>) :
          (<StartCountdownButton
            disabled={isSubmitDisabled}
            type="submit"
          >
            <Play size={24} />
            Começar
          </StartCountdownButton>)}
      </form>
    </HomeContainer>
  )
}
