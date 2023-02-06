export default function Directions({ directions }) {
  const renderDirections = () => {
    return directions.map((direction) => {
      return (
        <li key={direction.key}>
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
