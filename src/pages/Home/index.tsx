import { useEffect, useState } from "react";
import { HandPalm, Play } from "phosphor-react";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod' // when a lib doesn't have export default
import { differenceInSeconds } from 'date-fns'
import { CountdownContainer, FormContainer, HomeContainer, MinutesDurationInput, Separator, StartCountdownButton, StopCountdownButton, TaskInput } from "./styles";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a Tarefa'),
  minutesDuration: zod.number().min(5).max(60)
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesDuration: number
  startDate: Date
  interruptedDate?: Date
}

export function Home() {

  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [totalSecondsPassed, setTotalSecondsPassed] = useState(0)


  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesDuration: 0
    }
  })

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  useEffect(() => {
    let interval: any

    if (activeCycle) {
      interval = setInterval(() => {
        setTotalSecondsPassed(
          differenceInSeconds(
            new Date(),
            new Date(activeCycle.startDate))
        )
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle])

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getDate())
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
    setCycles(cycles.map(cycle => {
      if (cycle.id === activeCycleId) {
        return { ...cycle, interruptedDate: new Date() }
      } else {
        return cycle
      }
    }))

    setActiveCycleId(null)
  }

  const totalSeconds = activeCycle ? activeCycle.minutesDuration * 60 : 0
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
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            type="text"
            id="task"
            placeholder="Dê um nome para o seu projeto"
            list="task-suggestions"
            disabled={!!activeCycle}
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Dormir" />
            <option value="Comer" />
          </datalist>

          <label htmlFor="minutesDuration">durante</label>
          <MinutesDurationInput
            type="number"
            id="minutesDuration"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            disabled={!!activeCycle}
            {...register('minutesDuration', { valueAsNumber: true })}
          />
          <span>minutos</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

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
