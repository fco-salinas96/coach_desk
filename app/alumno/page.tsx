import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AlumnoPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted/40 p-6 md:p-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Portal del Alumno</CardTitle>
          <CardDescription>
            Esta sección está en desarrollo
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Pronto podrás ver tus clases, pagos y más información aquí.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
