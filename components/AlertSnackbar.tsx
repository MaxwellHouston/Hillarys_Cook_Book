'use client'

import { useEffect, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle } from 'lucide-react'

type AlertSeverity = 'success' | 'error' | 'warning' | 'info'

interface AlertSnackbarProps {
  status: boolean;
  toggle: () => void;
  severity: AlertSeverity;
  message: string;
}

export default function AlertSnackbar({ status, toggle, severity, message }: AlertSnackbarProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (status) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        toggle()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [status])

  if (!visible) return null

  const isError = severity === 'error'

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <Alert className={`flex items-center gap-2 text-white border-0 ${isError ? 'bg-red-600' : 'bg-green-600'}`}>
        {isError ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
        <AlertDescription className="text-white">{message}</AlertDescription>
      </Alert>
    </div>
  )
}
