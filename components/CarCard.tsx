import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

type Car = {
  id: number
  make: string
  model: string
  variant?: string | null
  year: number
  price: number
  fuelType: string
  transmission: string
  mileageKmpl?: number | null
  seatingCap?: number | null
  bodyType?: string | null
  safetyRating?: number | null
  features?: string | null
}

export default function CarCard({ car }: { car: Car }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-5 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{car.make} {car.model}</h3>
            <p className="text-sm text-muted-foreground">{car.variant} · {car.year}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-green-600 text-lg">₹{(car.price / 100000).toFixed(1)}L</p>
            <p className="text-xs text-muted-foreground">{car.bodyType}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{car.fuelType}</Badge>
          <Badge variant="secondary">{car.transmission}</Badge>
          {car.mileageKmpl ? (
            <Badge variant="outline">{car.mileageKmpl} kmpl</Badge>
          ) : (
            <Badge variant="outline">EV</Badge>
          )}
          {car.seatingCap && <Badge variant="outline">{car.seatingCap} seats</Badge>}
          {car.safetyRating && (
            <Badge variant={car.safetyRating >= 4 ? 'default' : 'secondary'}>
              {'⭐'.repeat(Math.round(car.safetyRating))} Safety
            </Badge>
          )}
        </div>

        {car.features && (
          <p className="text-xs text-muted-foreground">
            {car.features.split(',').slice(0, 4).join(' · ')}
          </p>
        )}
      </CardContent>
    </Card>
  )
}