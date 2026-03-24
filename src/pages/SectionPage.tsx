import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

type SectionPageProps = {
  title: string
  description?: string
}

export default function SectionPage({ title, description }: SectionPageProps) {
  return (
    <Box component={Paper} elevation={1} sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {description ?? 'Content goes here.'}
      </Typography>
    </Box>
  )
}
