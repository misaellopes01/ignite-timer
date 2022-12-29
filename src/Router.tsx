import { Route, Routes } from 'react-router-dom'
import { DefaultLayout } from './layouts/DefaultLayout'
import { History } from './pages/History'
import { Home } from './pages/Home'

// const babyProps: BabyProps = {
//     name: 'Dawith Arthur',
//     codeName: 'Steve Jr',
// }

export function Router() {
    return (
        <Routes>
            <Route path='/' element={<DefaultLayout />}>
                <Route path='/' element={<Home />} />
                <Route path='/history' element={<History />} />
            </Route>
           
        </Routes>
    )
}
