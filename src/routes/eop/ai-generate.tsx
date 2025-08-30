import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { AIEOPGenerator } from '@/components/emergency-management/AIEOPGenerator'

function AIGenerateEOPPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: "/emergency-management" })}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Emergency Management
          </Button>
        </div>

        {/* AI EOP Generator */}
        <AIEOPGenerator 
          selectedArea="Da Nang City"
          isEmergency={true}
          emergencyType="Severe Flooding"
          onEOPGenerated={(eop) => {
            console.log('EOP Generated:', eop)
            // Here you could integrate with your EOP management system
          }}
        />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/eop/ai-generate')({
  component: AIGenerateEOPPage,
})