import { useEffect, useState } from "react";
import { differenceInSeconds } from 'date-fns'
import { CountdownContainer, Separator } from "./styles";


export function Countdown() {

    const [totalSecondsPassed, setTotalSecondsPassed] = useState(0)

    const totalSeconds = activeCycle ? activeCycle.minutesDuration * 60 : 0

    useEffect(() => {
        let interval: number

        if (activeCycle) {
            interval = window.setInterval(() => {
                const secondsDifference = differenceInSeconds(
                    new Date(),
                    new Date(activeCycle.startDate)
                )

                if (secondsDifference >= totalSeconds) {
                    setCycles((state) => state.map(cycle => {
                        if (cycle.id === activeCycleId) {
                            return { ...cycle, finishedDate: new Date() }
                        } else {
                            return cycle
                        }
                    }))
                    setTotalSecondsPassed(totalSeconds)
                    clearInterval(interval)
                } else {
                    setTotalSecondsPassed(secondsDifference)
                }

            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }
    }, [activeCycle, totalSeconds])

    return (
        <CountdownContainer>
            <span>{minutes[0]}</span>
            <span>{minutes[1]}</span>
            <Separator>:</Separator>
            <span>{seconds[0]}</span>
            <span>{seconds[1]}</span>
        </CountdownContainer>
    )
}