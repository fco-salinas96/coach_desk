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
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const validatePhone = (phoneNumber: string) => {
    // Chilean phone format: +569XXXXXXXX
    const phoneRegex = /^\+569\d{8}$/
    return phoneRegex.test(phoneNumber)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Las contraseñas no coinciden')
      setIsLoading(false)
      return
    }

    if (!validatePhone(phone)) {
      setError('El teléfono debe tener el formato +569XXXXXXXX')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        phone,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/alumno`,
          data: {
            phone,
            role: 'alumno',
          },
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Ocurrió un error')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    
    // Auto-prepend +569 if user starts typing without it
    if (value && !value.startsWith('+')) {
      if (value.startsWith('569')) {
        value = '+' + value
      } else if (value.startsWith('9')) {
        value = '+56' + value
      } else if (!value.startsWith('+56')) {
        value = '+569' + value.replace(/\D/g, '')
      }
    }
    
    setPhone(value)
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted/40 p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Coack Desk</h1>
            <p className="text-muted-foreground mt-2">Crea tu cuenta de alumno</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Registro de Alumno</CardTitle>
              <CardDescription>
                Completa tus datos para crear una cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="alumno@ejemplo.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+569XXXXXXXX"
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Formato: +569 seguido de 8 dígitos
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password">Repetir contraseña</Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                  </Button>
                  <div className="text-center text-sm">
                    ¿Ya tienes cuenta?{' '}
                    <Link
                      href="/auth/login"
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      Ingresar
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
