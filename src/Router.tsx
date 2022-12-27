import { Route, Routes } from 'react-router-dom'
import { Baby, BabyProps } from './components/Baby/Index'
import { DefaultLayout } from './layouts/DefaultLayout'
import { History } from './pages/History'
import { Home } from './pages/Home'

const babyProps: BabyProps = {
    name: 'Dawith Arthur',
    codeName: 'Steve Jr',
}

export function Router() {
    return (
        <Routes>
            <Route path='/' element={<DefaultLayout />}>
                <Route path='/' element={<Home />} />
                <Route path='/history' element={<History />} />
            </Route>
            {/* <Route path='/baby' element={<Baby key={1} codeName={babyProps.codeName} name={babyProps.name} />} /> */}
        </Routes>
    )
}
