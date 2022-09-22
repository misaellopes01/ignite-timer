import { useForm } from 'react-hook-form'
import * as zod from 'zod' // when a lib doesn't have export default
import { zodResolver } from '@hookform/resolvers/zod'
import { FormContainer, MinutesDurationInput, TaskInput } from "./styles"

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a Tarefa'),
    minutesDuration: zod.number().min(1).max(60)
})

export function NewCycleForm() {

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesDuration: 0
        }
    })

    return (
        <FormContainer>
            <label htmlFor="task" > Vou trabalhar em </label>
            <TaskInput
                type="text"
                id="task"
                placeholder="Dê um nome para o seu projeto"
                list="task-suggestions"
                disabled={!!activeCycle}
                {...register('task')}
            />

            <datalist id="task-suggestions" >
                <option value="Projeto 1" />
                <option value="Projeto 2" />
                <option value="Dormir" />
                <option value="Comer" />
            </datalist>

            <label htmlFor="minutesDuration" > durante </label>
            <MinutesDurationInput
                type="number"
                id="minutesDuration"
                placeholder="00"
                step={1}
                min={1}
                max={60}
                disabled={!!activeCycle}
                {...register('minutesDuration', { valueAsNumber: true })}
            />
            <span> minutos </span>
        </FormContainer>

    )
}