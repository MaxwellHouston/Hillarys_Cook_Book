import { Direction } from '../../types'

interface DirectionsProps {
  directions: Direction[];
}

export default function Directions({ directions }: DirectionsProps) {
  const renderDirections = () => {
    return directions.map((direction, index) => {
      return (
        <li key={index}>
          <span className="font-normal">{direction.description}</span>
        </li>
      )
    })
  }

  return (
    <ol className="ml-10 list-decimal font-bold leading-8">
      {renderDirections()}
    </ol>
  )
}
