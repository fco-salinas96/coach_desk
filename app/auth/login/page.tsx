'use client'

import React from "react"

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('coach')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error

      // Get user role from rol_usuario table
      const { data: roleData, error: roleError } = await supabase
        .from('rol_usuario')
        .select('rol, id_coach')
        .eq('id_usuario', data.user.id)
        .single()

      if (roleError) throw new Error('No se encontró el rol del usuario')

      if (activeTab === 'coach') {
        // Verify user is a coach
        if (roleData.rol !== 'coach') {
          throw new Error('Esta cuenta no tiene permisos de coach')
        }

        // Get coach domain for redirect
        const { data: coachData, error: coachError } = await supabase
          .from('coach')
          .select('dominio')
          .eq('id_usuario', data.user.id)
          .single()

        if (coachError) throw new Error('No se encontró información del coach')
        
        // Redirect to coach dashboard (in production would use domain)
        router.push('/coach/alumnos')
      } else {
        // Verify user is an alumno
        if (roleData.rol !== 'alumno') {
          throw new Error('Esta cuenta no tiene permisos de alumno')
        }
        
        // Redirect to alumno dashboard
        router.push('/alumno')
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Ocurrió un error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted/40 p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Coach Desk</h1>
            <p className="text-muted-foreground mt-2">Gestiona tus clases</p>
          </div>
          
          <Card>
            <CardHeader className="pb-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="coach">Coach</TabsTrigger>
                  <TabsTrigger value="alumno">Alumno</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="coach" className="mt-0">
                  <div className="mb-4">
                    <CardTitle className="text-xl">Acceso Coach</CardTitle>
                    <CardDescription>
                      Ingresa con tu cuenta de coach
                    </CardDescription>
                  </div>
                  <form onSubmit={handleLogin}>
                    <div className="flex flex-col gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="coach-email">Correo electrónico</Label>
                        <Input
                          id="coach-email"
                          type="email"
                          placeholder="coach@ejemplo.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="coach-password">Contraseña</Label>
                        <Input
                          id="coach-password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      {error && <p className="text-sm text-destructive">{error}</p>}
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Ingresando...' : 'Ingresar'}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="alumno" className="mt-0">
                  <div className="mb-4">
                    <CardTitle className="text-xl">Acceso Alumno</CardTitle>
                    <CardDescription>
                      Ingresa con tu cuenta de alumno
                    </CardDescription>
                  </div>
                  <form onSubmit={handleLogin}>
                    <div className="flex flex-col gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="alumno-email">Correo electrónico</Label>
                        <Input
                          id="alumno-email"
                          type="email"
                          placeholder="alumno@ejemplo.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="alumno-password">Contraseña</Label>
                        <Input
                          id="alumno-password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      {error && <p className="text-sm text-destructive">{error}</p>}
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Ingresando...' : 'Ingresar'}
                      </Button>
                      <div className="text-center text-sm">
                        ¿No tienes cuenta?{' '}
                        <Link
                          href="/auth/sign-up"
                          className="underline underline-offset-4 hover:text-primary"
                        >
                          Crear cuenta
                        </Link>
                      </div>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
