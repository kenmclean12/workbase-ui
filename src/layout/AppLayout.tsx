import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

type AppLayoutProps = {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <Sidebar />
      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <Box sx={{ p: 3, flex: 1, bgcolor: '#f4f7fb' }}>{children}</Box>
      </Box>
    </Box>
  )
}
